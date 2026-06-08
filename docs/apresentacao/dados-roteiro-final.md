# Ficha de dados — Apresentação TCC MedIT

Dados para copy-paste na demonstração. Roteiro de falas e tempos: [`roteiro-final.md`](./roteiro-final.md).

Senha (contas seed TCC): `fastpass`

**Unidade da demo (todos os blocos):** `UPH 24h Zona Norte` — Avenida Itavuvu, 19 - Vila Olímpia, Sorocaba - SP, 18075042 (apelido seed: `jota`)

## Cronograma e logins

| Horário | Integrante | Bloco | Login | Senha | Unidade (seed) |
|---------|------------|-------|-------|-------|----------------|
| 00:00–02:00 | Brenda Silva | Slides 1–4 | — | — | — |
| 02:00–03:30 | Victor Campos | Slides 5–6 | — | — | — |
| 03:30–05:30 | Évellin Simões | Slides 7–9 | — | — | — |
| 05:30–11:30 | Rafael Vieira | Demo administrador | `admin.jota@yopmail.com` | `fastpass` | `UPH 24h Zona Norte` |
| 11:30–14:15 | Jonatas Lima | Demo paciente | `patient.demo.banca@yopmail.com` | `fastpass` | `UPH 24h Zona Norte` |
| 14:15–16:45 | Matheus Chagas | Demo enfermeiro | `nurse.demo.banca@yopmail.com` | `fastpass` | `UPH 24h Zona Norte` |
| 16:45–20:00 | Rafael Silva | Demo médico + encerramento | `doctor.demo.banca@yopmail.com` | `fastpass` | `UPH 24h Zona Norte` |

**Ordem da demo:** administrador → paciente → enfermeiro → médico.

**Mesmo atendimento (paciente → enfermeiro → médico):** paciente criado no sign-up; **enfermeiro e médico** são os cadastrados ao vivo pelo administrador (`nurse.demo.banca@...` e `doctor.demo.banca@...`). Todos na mesma unidade (`UPH 24h Zona Norte`).

---

## Rafael Vieira — Demo administrador

### Login

| Campo | Valor |
|-------|-------|
| E-mail ou CPF | `admin.jota@yopmail.com` |
| Senha | `fastpass` |

### Cadastrar médico(a)

| Campo | Valor |
|-------|-------|
| Nome completo | `Dr. Demo Banca` |
| CPF | `457.924.950-09` |
| Data de nascimento | `15/03/1985` |
| Gênero | `Masculino` |
| E-mail | `doctor.demo.banca@yopmail.com` |
| Senha | `fastpass` |
| Telefone | `(15) 99100-0001` |
| Sala ou consultório | `Consultório Demo 1` |
| CRM | `123456/SP` |
| Especialidade | `Medicina de Emergência` |

### Editar médico

| Campo | Valor |
|-------|-------|
| Telefone | `(15) 99100-0099` |

### Cadastrar enfermeiro(a)

| Campo | Valor |
|-------|-------|
| Nome completo | `Enf. Demo Banca` |
| CPF | `390.533.447-05` |
| Data de nascimento | `20/07/1992` |
| Gênero | `Feminino` |
| E-mail | `nurse.demo.banca@yopmail.com` |
| Senha | `fastpass` |
| Telefone | `(15) 99200-0002` |
| UF do COREN | `SP` |
| COREN | `654321` |
| Tipo do COREN | `ENF` |
| Turno | `Manhã` |
| Sala ou local de triagem | `Sala triagem Demo 1` |

### Editar enfermeiro(a)

| Campo | Valor |
|-------|-------|
| Telefone | `(15) 99200-0099` |

### Editar paciente

| Campo | Valor |
|-------|-------|
| Condições médicas | `Hipertensão controlada` |

### Cadastrar medicamento

| Campo | Valor |
|-------|-------|
| Nome do medicamento | `Medicamento Demo Banca` |
| Categoria | `Analgésicos` |
| Descrição | `Item cadastrado ao vivo na apresentação TCC MedIT` |
| Quantidade em estoque | `50` |
| Necessita de receita médica? | `Não` |

### Editar medicamento

| Campo | Valor |
|-------|-------|
| Quantidade em estoque | `45` |

### Unidades parceiras

Sem formulário — apenas exibir a rede. Se faltar item no estoque, apontar busca nas parceiras (somente consulta).

### Configurações (admin)

| Campo | Valor |
|-------|-------|
| Telefone | `(15) 99300-0003` |

---

## Jonatas Lima — Demo paciente

Fluxo: **sign-up** → login (se necessário) → **pré-cadastro** → **editar pré-atendimento** (opcional) → **confirmar chegada**.

### Sign-up — `/sign-up` (ao vivo)

| Campo | Valor |
|-------|-------|
| Nome | `Paciente Demo Banca` |
| CPF | `111.444.777-35` |
| Unidade de saúde | `UPH 24h Zona Norte` |
| E-mail | `patient.demo.banca@yopmail.com` |
| Senha | `fastpass` |

### Login (conta criada no sign-up ou seed de backup)

| Campo | Valor |
|-------|-------|
| E-mail ou CPF | `patient.demo.banca@yopmail.com` |
| Senha | `fastpass` |
| Unidade vinculada | `UPH 24h Zona Norte` |

**Backup (se o sign-up apertar o tempo):** `patient.jota@yopmail.com` / `fastpass`

### Pré-cadastro

| Campo | Valor |
|-------|-------|
| Queixa principal | `Dor de garganta` |
| Nível de dor | `10` |
| Se automedicou? | `Não` |
| Quando os sintomas começaram? | 2 dias atrás |
| Sintomas | `Febre`, `Dor de garganta` |
| Observação geral | `Pré-atendimento para demonstração MedIT` |

> **Nota:** com nível de dor **10**, o sistema já classifica o atendimento como **Emergência** no pré-cadastro (risco provisório). A enfermagem pode confirmar ou ajustar a classificação na triagem (ver seção enfermeiro).

### Editar pré-atendimento (opcional)

| Ação | Detalhe |
|------|---------|
| Onde | Card **Consulta atual** no dashboard do paciente |
| Botão | Ícone de lápis — **Editar pré-atendimento** |
| Quando | Enquanto o status for **Em Rota** (`onTheWay`) |

### Confirmar chegada

| Ação | Detalhe |
|------|---------|
| Status antes | `Em Rota` |
| Botão | Confirmar chegada ao hospital |
| Status depois | entra na fila de triagem da unidade |
| Dashboard | Mostrar card de status atualizado (**Aguardando triagem**) |

---

## Matheus Chagas — Demo enfermeiro

Login com o **enfermeiro cadastrado ao vivo** pelo administrador (bloco Rafael Vieira).

### Login

| Campo | Valor |
|-------|-------|
| E-mail ou CPF | `nurse.demo.banca@yopmail.com` |
| Senha | `fastpass` |

### Fila de triagem

| Ação | Detalhe |
|------|---------|
| Presencial | Apontar o botão **Presencial** (cadastro sem celular) — não é obrigatório executar |
| Prioridade | Paciente **Demo** deve aparecer no topo da fila |
| Iniciar triagem | Reserva o caso e abre o detalhe |

### Triagem — sinais vitais e risco

| Campo | Valor |
|-------|-------|
| Temperatura | `38,2` |
| Pressão arterial | `130/85` |
| Frequência cardíaca | `92` |
| Saturação | `97` |
| Escala de dor | `10` |
| Classificação de risco | `Emergência` |
| Observação | `Paciente com febre e odinofagia; pré-atendimento remoto` |

> **Nota:** o risco **Emergência** já vem do pré-cadastro quando a dor é 10; na triagem, confirme ou ajuste conforme a avaliação clínica.

### Após concluir triagem

| Ação | Detalhe |
|------|---------|
| Status | **Aguardando atendimento** na fila médica |
| Paciente | Dashboard do paciente atualiza o status (mencionar se couber tempo) |

---

## Rafael Silva — Demo médico + encerramento

Login com o **médico cadastrado ao vivo** pelo administrador (bloco Rafael Vieira).

### Login

| Campo | Valor |
|-------|-------|
| E-mail ou CPF | `doctor.demo.banca@yopmail.com` |
| Senha | `fastpass` |

### Antes de iniciar o atendimento

| Ação | Detalhe |
|------|---------|
| Menu | **Histórico de atendimentos** |
| Objetivo | Mostrar episódios anteriores do paciente (apoio clínico) antes de **Iniciar atendimento** |

### Finalizar atendimento

| Campo | Valor |
|-------|-------|
| Texto do diagnóstico | `Quadro compatível com infecção de vias aéreas superiores` |
| Destino do paciente | `Alta` |

---

## Contas da equipe (referência)

| Integrante | Unidade (seed) | Admin | Médico | Enfermeiro | Paciente |
|------------|----------------|-------|--------|------------|----------|
| Brenda | `UBS Vila Hortência` | `admin.brenda@yopmail.com` | `doctor.brenda@yopmail.com` | `nurse.brenda@yopmail.com` | `patient.brenda@yopmail.com` |
| Victor | `UPA 24h Zona Sul` | `admin.victor@yopmail.com` | `doctor.victor@yopmail.com` | `nurse.victor@yopmail.com` | `patient.victor@yopmail.com` |
| Évellin | `UBS Jardim Vera Cruz` | `admin.evellin@yopmail.com` | `doctor.evellin@yopmail.com` | `nurse.evellin@yopmail.com` | `patient.evellin@yopmail.com` |
| Jonatas | `UPH 24h Zona Norte` | `admin.jota@yopmail.com` | `doctor.jota@yopmail.com` | `nurse.jota@yopmail.com` | `patient.jota@yopmail.com` |
| Matheus | `UBS Éden` | `admin.take@yopmail.com` | `doctor.take@yopmail.com` | `nurse.take@yopmail.com` | `patient.take@yopmail.com` |
| Rafael Silva | `UBS Wanel Ville` | `admin.rafa@yopmail.com` | `doctor.rafa@yopmail.com` | `nurse.rafa@yopmail.com` | `patient.rafa@yopmail.com` |
| Rafael Vieira | `UPA 24h Zona Norte` | `admin.vieira@yopmail.com` | `doctor.vieira@yopmail.com` | `nurse.vieira@yopmail.com` | `patient.vieira@yopmail.com` |

Todas com senha `fastpass`.

**Na apresentação final:** admin e paciente usam contas `jota` / demo banca na unidade `UPH 24h Zona Norte`; **enfermeiro e médico** usam as contas **Demo Banca** criadas ao vivo no bloco do administrador.

### Contas criadas ao vivo na demo

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Médico | `doctor.demo.banca@yopmail.com` | `fastpass` |
| Enfermeiro | `nurse.demo.banca@yopmail.com` | `fastpass` |
| Paciente (sign-up) | `patient.demo.banca@yopmail.com` | `fastpass` |
| Medicamento | `Medicamento Demo Banca` | (cadastro na unidade do admin) |
