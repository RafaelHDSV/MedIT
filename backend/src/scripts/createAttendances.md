# Especificação do seed de atendimentos (`createAttendances.script.ts`)

Este documento descreve **como o script de seed funciona** (`createAttendances.script.ts`): constantes, regras por dia civil e ordem de geração. A seção final registra os requisitos de negócio que orientaram a última revisão do código.

---

## Visão geral

| Item                       | Comportamento                                                                                                                                                                                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome do script**         | `create-attendances`                                                                                                                                                                                                                                                             |
| **Antes de inserir**       | `Attendance.deleteMany()` — remove **todos** os atendimentos.                                                                                                                                                                                                                    |
| **Unidades**               | Carrega todas as `Unit`; para cada uma monta um _pool_ de pacientes, enfermeiros e médicos da mesma unidade. Unidades sem algum dos três são **ignoradas**.                                                                                                                      |
| **Janela temporal**        | `windowStart` = meia-noite local do dia `(hoje − 364)`; `windowEnd` = instante `now` da execução. Ou seja, ~**365 dias** de histórico rolante até “agora”.                                                                                                                       |
| **Granularidade de datas** | A maior parte da lógica usa **meia-noite e aritmética em horário local** (`setHours`, `setDate`). O dashboard agrega com **UTC** em `getPeriodDateRange` — pode haver pequeno desvio de bucket dia/semana em bordas de fuso; hoje script e API não estão unificados nesse ponto. |
| **Inserção**               | Lotes de `INSERT_BATCH_SIZE` (400) com `insertMany(..., { ordered: false, timestamps: false })` — `createdAt` / `updatedAt` vêm explícitos do seed.                                                                                                                              |

---

## Modelo mental dos campos principais

| Campo                | Uso no seed                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **`date`**           | Início do atendimento (entrada no fluxo). Usado no dashboard em agregações “por dia / hora” (`getAttendanceByTime`, `getEntries`, etc.).      |
| **`status`**         | Estado atual do documento.                                                                                                                    |
| **`changesHistory`** | Lista `{ status, changedAt }` do fluxo até o estado atual (concluído = fluxo completo; ativo = prefixo do fluxo até um status “ativo”).       |
| **`createdAt`**      | Em geral igual a `date` no seed.                                                                                                              |
| **`updatedAt`**      | Concluídos: costuma ser igual a `date` (fim lógico colapsado no seed). Ativos: último `changedAt` do histórico (última transição “simulada”). |
| **`diagnosis`**      | Preenchido em concluídos; **omitido** (`undefined`) nos ativos do dia atual.                                                                  |

---

## Constantes (valores atuais no código)

| Constante                                        | Valor (referência) | Papel                                                                                               |
| ------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------- |
| `DAYS_BACK`                                      | 364                | Largura da janela para trás a partir de hoje 00h.                                                   |
| `MIN_COMPLETED_PER_PATIENT` / `DOCTOR` / `NURSE` | 5                  | Mínimos de **concluídos** (após baseline), respeitando o teto diário.                               |
| `MAX_ATTENDANCES_PER_CALENDAR_DAY`               | 30                 | **Regra suprema:** nunca mais que isto de documentos com o mesmo dia civil de `date` (por unidade). |
| `MIN_ATTENDANCES_PER_CALENDAR_DAY`               | 15                 | Limite inferior do sorteio da meta diária `dailyTarget`.                                            |
| `OCCUPANCY_TARGET_MIN` / `MAX`                   | 0.45 / 0.68        | Fração de `maxOccupancy`: define faixa do número de **ativos só no dia atual**.                     |
| `INSERT_BATCH_SIZE`                              | 400                | Tamanho do lote de insert.                                                                          |
| `TARGET_MIN_TOTAL_ATTENDANCES`                   | 0                  | Top-up **desligado** (evitar quebrar o teto diário).                                                |
| `ABSOLUTE_MAX_TOTAL_ATTENDANCES`                 | 180_000            | Teto de segurança (mantido no código).                                                              |
| `MAX_TOP_UP_BATCHES`                             | 450                | Limite de lotes se o top-up for reativado.                                                          |

`maxOccupancy` por unidade vem do documento `Unit` (fallback **50** se ausente/ inválido).

---

## Distribuição de risco e textos clínicos

- **`riskDistribution`**: pesos manuais (mais `NOT_URGENT` / `LESS_URGENT`, menos emergência).
- **`complaints`** / **`diagnoses`**: listas fixas para `complaint` e `diagnosis` (concluídos).
- **`maybeClinicalExtras`**: ~40% dos concluídos ganham campos opcionais (`painLevel`, `symptoms`, etc.).

---

## Fluxo de status no código

- **`FULL_FLOW`**: `ON_THE_WAY` → … → `COMPLETED` (8 passos).
- **Concluído** (`buildCompletedFlow`): percorre **todos** os passos; `status` final `COMPLETED`; intervalo entre passos = `riskStepMinutes(risk)` por degrau.
- **Ativo** (`buildActiveFlowAnchored`): corta o fluxo até um `targetStatus` (`pickActiveTargetStatus` inclui `ON_THE_WAY`, `WAITING_TRIAGE`, … até `IN_ATTENDANCE`). **Só é gerado para o dia civil atual**; `date` e histórico caem no “hoje”. `doctorId` omitido em `ON_THE_WAY` e `WAITING_TRIAGE`.

---

## Geração por unidade (ordem exata)

Tudo roda **por unidade**; em seguida o bloco de top-up global **não executa** enquanto `TARGET_MIN_TOTAL_ATTENDANCES === 0`.

### 1. Baseline equalizado (concluídos)

- Lista todos os dias civis de `windowStart` (00h local) até hoje (inclusive).
- Sorteia uma **meta única** `dailyTarget` inteira em `[MIN_ATTENDANCES_PER_CALENDAR_DAY, MAX_ATTENDANCES_PER_CALENDAR_DAY]` (15–30).
- **Dias anteriores a hoje:** insere exatamente `dailyTarget` atendimentos **concluídos** (`buildCompletedFlow`), com início em `randomCompletedStartOnCalendarDay` naquele dia. Atualiza contador por dia; nunca ultrapassa `MAX_ATTENDANCES_PER_CALENDAR_DAY`.
- **Hoje:** insere até `min(dailyTarget, ceil(dailyTarget * elapsedDayFraction(now)), vagas restantes)` concluídos (fração do dia já decorrida).

### 2. Ativos (somente hoje)

- Quantidade desejada: inteiro aleatório em `[occLow, occHigh]` (derivado de `maxOccupancy`), limitada às **vagas restantes** no teto do dia atual.
- Pacientes distintos; `ensurePatients` se faltar paciente.
- Âncoras só com `randomActiveEndTimeOnCalendarDay(todayStart, …)` + fallbacks, de forma que `date` permaneça no dia atual.
- `doctorId` só quando o status já exige médico (não em `ON_THE_WAY` / `WAITING_TRIAGE`).

### 3. Mínimos por paciente, médico e enfermeiro

- Após o baseline + ativos, garante ≥5 concluídos por paciente, médico e enfermeiro.
- Cada novo concluído vai para o **dia civil com menor carga** entre os que ainda têm vaga (`< MAX_ATTENDANCES_PER_CALENDAR_DAY`). Se não houver vaga, emite aviso e interrompe aquele mínimo.

### 4. Persistência

- Um único `insertBatched(unitDocs)` por unidade após os passos acima.

---

## Limitações / avisos

- **Múltiplas unidades:** o teto é **por unidade**; somando unidades no mesmo dia civil, o total global pode passar de 30.
- **Mínimos vs teto:** se o teto 30/dia for insuficiente para todos os mínimos, o script registra `console.warn` e pode deixar algum mínimo incompleto.
- **UTC vs local:** o dashboard usa UTC em parte das agregações; o seed usa meia-noite **local** — possível pequeno desvio visual nas bordas do dia.

---

## Dependências de dados

- **Obrigatório:** pelo menos uma unidade com pacientes, enfermeiros e médicos já existentes (criados por outros seeds).
- O script **cria pacientes extras** via `ensurePatients` quando o pool é menor que o necessário para os ativos do dia atual.

---

## Como rodar

- Pelo runner de scripts do backend (`npm run scripts` / fluxo do projeto) escolhendo `create-attendances`.
- (Detalhe exato do comando depende do `runner` do repositório.)

---

## Requisitos de negócio (referência — implementados no script)

1. **Equalização / teto:** não pode haver um dia civil (por unidade, pelo campo `date`) com mais de **30** atendimentos; a meta base diária é sorteada entre **15 e 30** (`dailyTarget`).
2. **Fluxo hospitalar completo:** concluídos usam `FULL_FLOW` desde `ON_THE_WAY` até `COMPLETED`. Ativos usam prefixo do mesmo fluxo; estados iniciais incluem `ON_THE_WAY` e `WAITING_TRIAGE`.
3. **Ativos só no dia atual:** nenhum documento em status “em andamento” (não `COMPLETED`) com `date` em dia anterior ao dia da execução do seed.

Para novas alterações, edite esta lista e o código será ajustado de acordo.
