# Especificação do seed de atendimentos (`createAttendances.script.ts`)

Este documento descreve **como o script de seed funciona** (`createAttendances.script.ts`): constantes, regras por dia civil, fases de geração e requisitos de negócio.

---

## Visão geral

| Item                       | Comportamento                                                                                                                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nome do script**         | `create-attendances`                                                                                                                                                                                                         |
| **Antes de inserir**       | `Attendance.deleteMany()` — remove **todos** os atendimentos.                                                                                                                                                                |
| **Unidades**               | Carrega todas as `Unit`; para cada uma monta um _pool_ de pacientes, enfermeiros e médicos da mesma unidade. Unidades sem algum dos três são **ignoradas**.                                                                  |
| **Janela temporal**        | `windowStart` = meia-noite local do dia `(hoje − 364)`; `windowEnd` = instante `now` da execução. Ou seja, ~**365 dias** de histórico rolante até "agora".                                                                   |
| **Granularidade de datas** | A maior parte da lógica usa **meia-noite e aritmética em horário local** (`setHours`, `setDate`). O dashboard agrega com **UTC** em `getPeriodDateRange` — pode haver pequeno desvio de bucket dia/semana em bordas de fuso. |
| **Inserção**               | Lotes de `INSERT_BATCH_SIZE` (300) com `insertMany(..., { ordered: false, timestamps: false })` — `createdAt` / `updatedAt` vêm explícitos do seed.                                                                          |

---

## Modelo mental dos campos principais

| Campo                | Uso no seed                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **`date`**           | Início do atendimento (entrada no fluxo). Usado no dashboard em agregações "por dia / hora" (`getAttendanceByTime`, `getEntries`, etc.). |
| **`status`**         | Estado atual do documento.                                                                                                               |
| **`changesHistory`** | Lista `{ status, changedAt }` do fluxo até o estado atual (concluído = fluxo completo; ativo = prefixo do fluxo até um status "ativo").  |
| **`createdAt`**      | Em geral igual a `date` no seed.                                                                                                         |
| **`updatedAt`**      | Concluídos: último `changedAt` do histórico. Ativos: último `changedAt` do histórico (última transição "simulada").                      |
| **`diagnosis`**      | Preenchido em concluídos (texto + key da base `SymptomsDiseases`); **omitido** (`undefined`) nos ativos do dia atual.                    |
| **`vitalSigns`**     | Subdocumento com `temperature`, `bloodPressure`, `heartRate`, `oxygenSaturation` — valores correlacionados ao `risk` do atendimento.     |
| **`painLevel`**      | Escala 0–10, correlacionada ao risco.                                                                                                    |

---

## Constantes (valores atuais no código)

| Constante                       | Valor (referência)                                                    | Papel                                                                                                 |
| ------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `DAYS_BACK`                     | 364                                                                   | Largura da janela para trás a partir de hoje 00h.                                                     |
| `INSERT_BATCH_SIZE`             | 300                                                                   | Tamanho do lote de insert.                                                                            |
| `WEEKDAY_TARGET_MIN/MAX`        | 21 / 26                                                               | Faixa de meta diária para dias de semana (por unidade).                                               |
| `WEEKEND_TARGET_MIN/MAX`        | 14 / 19                                                               | Faixa de meta diária para fins de semana (por unidade).                                               |
| `ABSOLUTE_MAX_PER_DAY`          | 30                                                                    | **Regra suprema (histórico):** nunca mais que isto de documentos com o mesmo dia civil (por unidade). |
| `TODAY_TOTAL_CAP`               | 45                                                                    | Teto do dia atual (concluídos + ativos + fila).                                                       |
| `TCC_MIN_COMPLETED_PER_PATIENT` | 10                                                                    | Mínimo de concluídos para cada **paciente** TCC.                                                      |
| `TCC_MIN_COMPLETED_PER_DOCTOR`  | 8                                                                     | Mínimo de concluídos com `doctorId` para cada **médico** TCC.                                         |
| `TCC_MIN_COMPLETED_PER_NURSE`   | 8                                                                     | Mínimo de concluídos com `nurseId` para cada **enfermeiro** TCC.                                      |
| `MIN_QUEUE_WAITING_TRIAGE`      | 5                                                                     | Atendimentos `WAITING_TRIAGE` sem `nurseId` na fila (por unidade, dia atual).                         |
| `MIN_QUEUE_WAITING_ATTENDANCE`  | 5                                                                     | Atendimentos `WAITING_ATTENDANCE` sem `doctorId` na fila (por unidade, dia atual).                    |
| `TCC_ACTIVE_PER_DOCTOR`         | 2                                                                     | Ativos `IN_ATTENDANCE` atribuídos por médico TCC no dia atual.                                        |
| `TCC_ACTIVE_PER_NURSE`          | 1                                                                     | Ativos `IN_TRIAGE` atribuídos por enfermeiro TCC no dia atual.                                        |
| `RISK_WEIGHTS`                  | NOT_URGENT 35, LESS_URGENT 30, URGENT 20, VERY_URGENT 10, EMERGENCY 5 | Distribuição ponderada de risco.                                                                      |

`maxOccupancy` por unidade vem do documento `Unit` (fallback **50** se ausente/inválido).

---

## Distribuição horária e temporal

- **`HOUR_WEIGHTS`**: array de 24 pesos — pico entre 8h–11h e 14h–17h; madrugada (0h–6h) com pesos mínimos (1–3). ~80% do volume concentrado entre 8h–20h.
- **Meta diária**: dia de semana [21–26], fim de semana [14–19], com jitter de ±2 para variação natural entre unidades.
- **Dia atual**: concluídos limitados pela fração do dia já decorrida (`elapsedDayFraction`); fila + ativos adicionados depois.

---

## Dados clínicos (realismo)

- **Sinais vitais (`vitalSignsForRisk`)**: valores correlacionados ao risco atribuído — emergência produz temp 38.5–40.5°C, FC 110–160, SpO₂ 85–93%, PA sistólica 160–200; não urgente produz valores normais (36.0–36.8°C, FC 60–85, SpO₂ 96–99%).
- **Nível de dor (`painLevelForRisk`)**: emergência 7–10, não urgente 0–2.
- **Queixa principal**: mapeada a partir dos sintomas do perfil de doença via `SYMPTOM_KEY_TO_COMPLAINTS`, com fallback de lista genérica.
- **Prescrições de medicamentos**: ~60% dos concluídos recebem 1–4 medicamentos do `MEDICATION_POOL`, com dosagem, frequência e duração realistas.
- **Exames prescritos**: ~40% dos concluídos recebem 1–3 exames do `EXAM_POOL`.
- **Disposição do paciente (`patientDisposition`)**: correlacionada ao risco — emergência/muito urgente → hospitalização/observação; não urgente → alta.
- **Sintomas**: construídos a partir do mapa `symptoms` do perfil `SymptomsDiseases` da base.
- **Outros campos**: `diagnosisText`, `generalObservation`, `selfMedicated`, `symptomStartDate`, `conditions`, `allergies` preenchidos com dados realistas via faker/listas estáticas.

---

## Detecção de membros do TCC

- **Short names**: `brenda`, `evellin`, `jota`, `take`, `rafa`, `vieira`, `victor`.
- **Padrão de email**: `{level}.{shortName}@yopmail.com` (ex.: `doctor.brenda@yopmail.com`, `nurse.vieira@yopmail.com`).
- **Regex**: `^\w+\.{shortName}@yopmail\.com$` para cada short name, combinados com `|` e filtro case-insensitive.
- Detectados em três conjuntos: `tccPatientIdSet`, `tccNurseIdSet`, `tccDoctorIdSet`.

---

## Fluxo de status no código

- **`FULL_FLOW`**: `ON_THE_WAY` → `WAITING_TRIAGE` → `IN_TRIAGE` → `TRIAGE_COMPLETED` → `WAITING_ATTENDANCE` → `IN_ATTENDANCE` → `ATTENDANCE_COMPLETED` → `COMPLETED` (8 passos).
- **Concluído** (`buildCompletedFlow`): percorre **todos** os passos; `status` final `COMPLETED`; intervalo entre passos baseado em `riskStepMinutes(risk)` com **±30% jitter** por degrau.
- **Ativos**: gerados **apenas para o dia atual**; status parcial dentro do fluxo (ON_THE_WAY, WAITING_TRIAGE, IN_TRIAGE, WAITING_ATTENDANCE, IN_ATTENDANCE).
- **`nurseId`**: omitido em `ON_THE_WAY` e `WAITING_TRIAGE`.
- **`doctorId`**: omitido até `IN_ATTENDANCE` (só atribuído quando o status exige médico).

---

## Geração por unidade (3 fases)

Tudo roda **por unidade**, sequencialmente. Arrays de profissionais/pacientes são shuffled para distribuição round-robin.

### Fase 1 — Concluídos diários (baseline equalizado)

- Lista todos os dias civis de `windowStart` (00h local) até hoje (inclusive).
- Sorteia uma **meta diária** por tipo de dia: weekday [21–26], weekend [14–19], com jitter ±2.
- **Dias anteriores a hoje:** insere exatamente a meta de atendimentos **concluídos** (`buildCompletedFlow`), com horário ponderado por `HOUR_WEIGHTS`.
- **Hoje:** insere até `min(meta, ceil(meta × elapsedDayFraction))` concluídos (fração do dia já decorrida).
- Nunca ultrapassa `ABSOLUTE_MAX_PER_DAY` (30) por dia.

### Fase 2 — Mínimos TCC (concluídos extras)

- Após o baseline, verifica se cada membro TCC atingiu seus mínimos de concluídos:
  - Pacientes: ≥10 concluídos.
  - Médicos: ≥8 concluídos com `doctorId` atribuído.
  - Enfermeiros: ≥8 concluídos com `nurseId` atribuído.
- Cada concluído extra vai para o **dia civil com menor carga** que ainda tenha vaga (`< ABSOLUTE_MAX_PER_DAY`).
- Se não houver vaga em nenhum dia, emite `console.warn`.

### Fase 3 — Fila ativa + ativos TCC (somente hoje)

- **Fila sem atribuição (pool compartilhado):**
  - 5 × `WAITING_TRIAGE` sem `nurseId` (fila do enfermeiro).
  - 5 × `WAITING_ATTENDANCE` sem `doctorId` (fila do médico).
- **Ativos TCC atribuídos:**
  - Cada médico TCC na unidade recebe 2 atendimentos em `IN_ATTENDANCE` com `doctorId`.
  - Cada enfermeiro TCC na unidade recebe 1 atendimento em `IN_TRIAGE` com `nurseId`.
- **Extras variados:** ~7 atendimentos adicionais em estados mistos (ON_THE_WAY, WAITING_TRIAGE, IN_TRIAGE, WAITING_ATTENDANCE, IN_ATTENDANCE).
- Todos respeitam o `TODAY_TOTAL_CAP` (45).

### Persistência

- Um único `insertBatched(unitDocs)` por unidade após as 3 fases.

---

## Distribuição (round-robin shuffled)

- Arrays de pacientes, enfermeiros e médicos são embaralhados (`faker.helpers.shuffle`) antes do início.
- Contadores round-robin (`patIdx`, `nurseIdx`, `docIdx`) avançam ciclicamente a cada atendimento, garantindo que todos os profissionais/pacientes recebam atendimentos de forma equilibrada sem concentrar em poucos.

---

## Volume estimado

- ~23 dias/mês com meta ~23.5 (weekdays) + ~8 dias/mês com meta ~16.5 (weekends) = ~670/mês/unidade.
- 12 meses × 670 ≈ **~8.040/unidade** (baseline) + mínimos TCC + ativos ≈ **~8.400/unidade**.
- 12 unidades × 8.400 ≈ **~101k atendimentos** no total.

---

## Limitações / avisos

- **Múltiplas unidades:** o teto é **por unidade**; somando unidades no mesmo dia civil, o total global pode passar de 30.
- **Mínimos TCC vs teto:** se o teto 30/dia for insuficiente para todos os mínimos TCC, o script registra `console.warn` e pode deixar algum mínimo incompleto.
- **UTC vs local:** o dashboard usa UTC em parte das agregações; o seed usa meia-noite **local** — possível pequeno desvio visual nas bordas do dia.
- **Status CANCELED:** não gerado pelo seed (removido conforme requisito).

---

## Dependências de dados

- **Obrigatório:** pelo menos uma unidade com pacientes, enfermeiros e médicos já existentes (criados por outros seeds: `create-units`, `create-doctors-by-unit`, `create-nurses-by-unit`, `create-patients-by-unit`).
- **Base `SymptomsDiseases`:** usada para gerar sintomas e diagnósticos realistas (`create-symptoms-diseases`).
- **Membros TCC:** criados por `create-tcc-users` — short names no padrão `{level}.{shortName}@yopmail.com`.

---

## Como rodar

- Pelo runner de scripts do backend (`yarn scripts` / `npm run scripts`) escolhendo `create-attendances`.
- Ou diretamente: `yarn scripts create-attendances` (execução por nome sem menu interativo).

---

## Requisitos de negócio (referência — implementados no script)

1. **Equalização / teto:** não pode haver um dia civil (por unidade, pelo campo `date`) com mais de **30** atendimentos (histórico); meta base diária diferenciada weekday vs weekend com jitter.
2. **Fluxo hospitalar completo:** concluídos usam `FULL_FLOW` desde `ON_THE_WAY` até `COMPLETED` com jitter temporal. Ativos usam prefixo do mesmo fluxo.
3. **Ativos só no dia atual:** nenhum documento em status "em andamento" (não `COMPLETED`) com `date` em dia anterior ao dia da execução do seed.
4. **Fila ativa por unidade:** mínimo de 5 `WAITING_TRIAGE` (fila enfermeiro) + 5 `WAITING_ATTENDANCE` (fila médico) sem atribuição profissional.
5. **Mínimos TCC:** pacientes ≥10 concluídos; médicos ≥8 concluídos atribuídos + 2 ativos; enfermeiros ≥8 concluídos atribuídos + 1 ativo.
6. **Correlação risco → dados clínicos:** sinais vitais, nível de dor, disposição do paciente e prescrições correlacionados ao nível de risco.
7. **Volume mínimo:** ≥93k atendimentos totais (~101k estimado com 12 unidades).
8. **Sem status CANCELED:** nenhum atendimento gerado com status cancelado.
9. **Distribuição horária realista:** concentração entre 8h–20h com pico em horário comercial.
10. **Detecção TCC por short name:** regex `^\w+\.{shortName}@yopmail\.com$` (não genérico `@yopmail.com`).

Para novas alterações, edite esta lista e o código será ajustado de acordo.
