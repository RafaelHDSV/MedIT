# Ficha de dados — Apresentação TCC MedIT

Dados para copy-paste na demonstração. Roteiro de falas e tempos: [`divisao-apresentacao-tcc.md`](./divisao-apresentacao-tcc.md).

Senha (contas seed TCC): `fastpass`

## Cronograma e logins

| Horário | Integrante | Bloco | Login | Senha | Unidade (seed) |
|---------|------------|-------|-------|-------|----------------|
| 00:00–02:00 | Brenda Silva | Slides 1–4 | — | — | — |
| 02:00–03:30 | Victor Campos | Slides 5–6 | — | — | — |
| 03:30–05:30 | Évellin Simões | Slides 7–9 | — | — | — |
| 05:30–11:30 | Rafael Vieira | Demo administrador | `admin.vieira@yopmail.com` | `fastpass` | `UPA 24h Zona Norte` |
| 11:30–14:15 | Jonatas Lima | Demo paciente | ver seção Jonatas | `fastpass` | `UBS Vila Barão` |
| 14:15–16:45 | Matheus Chagas | Demo enfermeiro | `nurse.jota@yopmail.com` | `fastpass` | `UBS Vila Barão` |
| 16:45–20:00 | Rafael Silva | Demo médico + encerramento | `doctor.jota@yopmail.com` | `fastpass` | `UBS Vila Barão` |

**Ordem da demo:** administrador → paciente → enfermeiro → médico.

**Mesmo atendimento (paciente → enfermeiro → médico):** usar contas da **mesma unidade** (`UBS Vila Barão` / apelido `jota` na tabela de referência). O admin (Rafael Vieira) usa unidade própria só no bloco de gestão.

---

## Rafael Vieira — Demo administrador

### Login

| Campo | Valor |
|-------|-------|
| E-mail ou CPF | `admin.vieira@yopmail.com` |
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

Fluxo: **sign-up** → login (se necessário) → **pré-cadastro** → **confirmar chegada**.

### Sign-up — `/sign-up` (ao vivo)

| Campo | Valor |
|-------|-------|
| Nome | `Paciente Demo Banca` |
| CPF | `111.444.777-35` |
| Unidade de saúde | `UBS Vila Barão` |
| E-mail | `patient.demo.banca@yopmail.com` |
| Senha | `fastpass` |

### Login (conta criada no sign-up ou seed de backup)

| Campo | Valor |
|-------|-------|
| E-mail ou CPF | `patient.demo.banca@yopmail.com` |
| Senha | `fastpass` |
| Unidade vinculada | `UBS Vila Barão` |

**Backup (se o sign-up apertar o tempo):** `patient.jota@yopmail.com` / `fastpass`

### Pré-cadastro

| Campo | Valor |
|-------|-------|
| Queixa principal | `Dor de garganta` |
| Nível de dor | `6` |
| Se automedicou? | `Não` |
| Quando os sintomas começaram? | 2 dias atrás |
| Sintomas | `Febre`, `Dor de garganta` |
| Observação geral | `Pré-atendimento para demonstração MedIT` |

### Confirmar chegada

| Ação | Detalhe |
|------|---------|
| Status antes | `Em Rota` |
| Botão | Confirmar chegada ao hospital |
| Status depois | entra na fila de triagem da unidade |

---

## Matheus Chagas — Demo enfermeiro

### Login

| Campo | Valor |
|-------|-------|
| E-mail ou CPF | `nurse.jota@yopmail.com` |
| Senha | `fastpass` |

### Fila de triagem

| Ação | Detalhe |
|------|---------|
| Presencial | Apenas **apontar** o botão (cadastro sem celular) — não é obrigatório executar |
| Iniciar triagem | Reserva o caso e abre o detalhe |

### Triagem — sinais vitais e risco

| Campo | Valor |
|-------|-------|
| Temperatura | `38,2` |
| Pressão arterial | `130/85` |
| Frequência cardíaca | `92` |
| Saturação | `97` |
| Escala de dor | `6` |
| Classificação de risco | `Urgente` |
| Observação | `Paciente com febre e odinofagia; pré-atendimento remoto` |

---

## Rafael Silva — Demo médico + encerramento

### Login

| Campo | Valor |
|-------|-------|
| E-mail ou CPF | `doctor.jota@yopmail.com` |
| Senha | `fastpass` |

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
| Jonatas | `UBS Vila Barão` | `admin.jota@yopmail.com` | `doctor.jota@yopmail.com` | `nurse.jota@yopmail.com` | `patient.jota@yopmail.com` |
| Matheus | `UBS Éden` | `admin.take@yopmail.com` | `doctor.take@yopmail.com` | `nurse.take@yopmail.com` | `patient.take@yopmail.com` |
| Rafael Silva | `UBS Wanel Ville` | `admin.rafa@yopmail.com` | `doctor.rafa@yopmail.com` | `nurse.rafa@yopmail.com` | `patient.rafa@yopmail.com` |
| Rafael Vieira | `UPA 24h Zona Norte` | `admin.vieira@yopmail.com` | `doctor.vieira@yopmail.com` | `nurse.vieira@yopmail.com` | `patient.vieira@yopmail.com` |

Todas com senha `fastpass`.

### Contas criadas ao vivo na demo

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Médico | `doctor.demo.banca@yopmail.com` | `fastpass` |
| Enfermeiro | `nurse.demo.banca@yopmail.com` | `fastpass` |
| Paciente (sign-up) | `patient.demo.banca@yopmail.com` | `fastpass` |
| Medicamento | `Medicamento Demo Banca` | (cadastro na unidade do admin) |
