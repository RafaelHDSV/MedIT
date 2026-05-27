# Roteiro Operacional - Apresentacao Final TCC MedIT

---

## Estrutura Geral

| Item | Definicao |
|------|-----------|
| Duracao | 20 minutos (5 min contexto + 15 min demonstracao) |
| Equipe | 7 integrantes; cada um conduz **um unico bloco** e nao retorna |
| Ordem da demo | Administrador -> Enfermeiro -> Medico -> Paciente |
| Mensagem central | Plataforma de apoio ao fluxo hospitalar, com controle por perfil e sugestoes por regras — **sem substituir o profissional** |
| Regra de ouro (admin) | Todo usuario operacional pertence a **uma unidade**; listagens do admin sao **da unidade dele** |

**Credenciais (senha `fastpass` para todas):**

| Perfil | E-mail |
|--------|--------|
| Administrador | `admin.vieira@yopmail.com` |
| Enfermeiro | `nurse.vieira@yopmail.com` |
| Medico | `doctor.vieira@yopmail.com` |
| Paciente | `patient.vieira@yopmail.com` |

**Preparacao no dia (antes de entrar na sala):**

- `yarn dev` rodando; MongoDB com seeds do dia (`create-attendances` entre os ultimos).
- Quatro abas do Chrome ja posicionadas (admin, enfermeiro, medico, paciente) ou um operador de apoio para trocar login.
- `patient.vieira` **sem** atendimento ativo (concluir ou cancelar episodio pendente antes da apresentacao).
- Slides da Brenda e do Rafael Vieira abertos em apresentacao separada.

---

## Cronograma Resumido

| Horario | Integrante | Topicos (sem falas) |
|---------|------------|---------------------|
| 00:00-02:50 | Brenda Silva | Slides: abertura, equipe, problema, motivacao, objetivo, impacto |
| 02:50-05:00 | Evellin Simoes | Slides: arquitetura e modulos; tela de login e cadastro publico |
| 05:00-09:30 | Jonatas Lima | Admin: dashboard, medicos CRUD+detail, enfermeiros CRUD+detail, pacientes list+detail+edit, config, unidades parceiras, medicamentos |
| 09:30-12:00 | Matheus Chagas | Enfermeiro: dashboard/fila, triagem completa, historico triagens, config |
| 12:00-14:30 | Rafael Silva | Medico: dashboard/fila, atendimento, sugestoes, finalizar atendimento, historico, config |
| 14:30-16:30 | Rafael Vieira | Slides: fluxo de status, seguranca, IA simbolica |
| 16:30-20:00 | Victor Campos | Paciente: sign-up (opcional), pre-cadastro, confirmar chegada, config, encerramento |

---

## Possiveis Perguntas da Banca

| Pergunta | Resposta sugerida |
|----------|-------------------|
| Dois profissionais no mesmo caso? | Claim atomico na fila; API valida status e se ja ha responsavel. |
| Admin ve medicos de outras unidades? | Nao; listagens filtradas pelo `unitId` do token. |
| Por que admin primeiro e paciente por ultimo? | Da governanca operacional ao impacto na ponta (usuario final). |
| E diagnostico automatico? | Nao; sugestao por regras com % de compatibilidade; decisao e do medico. |
| LGPD? | Controle por perfil, minimizacao de exposicao; conformidade plena depende da instituicao. |
| So dados de seed? | Demonstramos criacao ao vivo (medico/enfermeiro no admin, pre-atendimento do paciente). |

---

## Script Completo

> Formato de cada cena: **Tela** (onde estar) -> **Acao** (o que fazer, clique a clique) -> **Fala** (texto integral, com a tela indicada em destaque).
>
> Linhas `[APOIO]` sao para quem opera o notebook, sem microfone.

---

### Brenda Silva (2 minutos e 50 segundos)

**Cena 1 — Abertura**

- **Tela:** Slide de capa (projetor; notebook pode estar em standby ou com login ao fundo, sem foco).
- **Acao:** Posicionar-se de frente para a banca. Olhar para os avaliadores. Nao mexer no computador ainda.
- **Fala:** "Boa noite, professores e professoras. Somos a equipe do Trabalho de Conclusao de Curso em Analise e Desenvolvimento de Sistemas, e hoje apresentamos o **MedIT** — uma plataforma web de apoio a triagem e a organizacao do fluxo hospitalar."

**Cena 2 — Equipe**

- **Tela:** Slide com nomes dos sete integrantes.
- **Acao:** Apontar o slide, citar cada nome com uma palavra sobre a area (frontend, backend, regras de negocio, etc.), sem ler lista mecanicamente.
- **Fala:** "O time e formado por Brenda Silva, Evellin Simoes, Jonatas Lima, Matheus Chagas, Rafael Silva, Rafael Vieira e Victor Campos. Cada um conduz um bloco da demonstracao, em sequencia, para mostrar o sistema completo em vinte minutos."

**Cena 3 — Problema**

- **Tela:** Slide "Problema".
- **Acao:** Pausa breve apos o titulo. Gestualizar fila / sobrecarga se couber.
- **Fala:** "Partimos de um problema real nas unidades publicas: superlotacao, filas com pouca previsibilidade, retrabalho na coleta de informacoes e falta de visibilidade operacional para quem gerencia o dia a dia."

**Cena 4 — Motivacao e objetivo**

- **Tela:** Slide "Objetivo" (ou motivacao + objetivo no mesmo slide).
- **Acao:** Transicao de slide com calma.
- **Fala:** "Nosso objetivo foi construir uma solucao que organize a jornada do atendimento de ponta a ponta: cadastro, triagem, consulta e indicadores, com dados estruturados, controle por perfil de acesso e um mecanismo de sugestoes baseado em regras — sempre como **apoio** ao profissional, nunca como substituicao da decisao clinica."

**Cena 5 — Impacto e passagem**

- **Tela:** Slide "Impacto esperado".
- **Acao:** Fechar slides da Brenda. Olhar para Evellin ou para o notebook.
- **Fala:** "Esperamos reduzir friccao na entrada do paciente, diminuir retrabalho na triagem e dar base objetiva para a gestao da unidade. Com o contexto apresentado, a Evellin mostra a arquitetura e em seguida entramos na demonstracao ao vivo."

- **[APOIO]** Nao trocar tela ainda; Evellin assume com slide de arquitetura.

---

### Evellin Simoes (2 minutos e 10 segundos)

**Cena 1 — Arquitetura**

- **Tela:** Slide "Arquitetura" (diagrama frontend / API / MongoDB).
- **Acao:** Explicar o diagrama com o dedo ou laser; nao abrir o sistema ainda.
- **Fala:** "O MedIT e um monorepo: **frontend** em React com Vite, **backend** em Express com TypeScript e **persistencia** em MongoDB. A comunicacao e via API REST, com autenticacao JWT — access token e refresh token — e senhas armazenadas com hash."

**Cena 2 — Modulos**

- **Tela:** Slide "Modulos" ou lista: Admin, Enfermagem, Medico, Paciente.
- **Acao:** Enumerar os quatro blocos que a banca vera na sequencia.
- **Fala:** "Na demonstracao percorremos o sistema na ordem operacional: primeiro o **administrador da unidade**, depois **enfermagem**, **medico** e, por fim, o **paciente** — fechando com a experiencia de quem inicia o atendimento fora da unidade."

**Cena 3 — Entrada no sistema**

- **Tela:** **Tela de login** do MedIT (`/`) — projeto ja aberto no navegador, tema claro ou escuro fixo.
- **Acao:** Mostrar campos "E-mail ou CPF" e "Senha". Apontar o link "Cadastrar-se" na parte inferior, **sem** clicar ainda.
- **Fala:** "Este e o ponto de entrada do sistema, *na tela de login*. Pacientes podem se cadastrar pela rota publica de sign-up; profissionais e gestores acessam com credenciais da unidade. A partir de agora o Jonatas entra com o perfil administrador e mostra a gestao completa da unidade."

- **[APOIO]** Deixar a **tela de login** visivel. Jonatas assume o teclado.

---

### Jonatas Lima (4 minutos e 30 segundos)

**Cena 1 — Login administrador**

- **Tela:** **Tela de login** (`/`).
- **Acao:** Clicar no campo de identificador. Digitar `admin.vieira@yopmail.com`. Clicar em senha. Digitar `fastpass`. Clicar no botao de entrar (submit do formulario).
- **Fala:** "Entro agora como administrador da unidade, *na tela de login*, com o usuario que representa a gestao operacional local — nao a rede inteira, e sim **uma** unidade especifica."

**Cena 2 — Dashboard**

- **Tela:** **Dashboard do administrador** (`/auth/dashboard`) — menu lateral com Dashboard, Medicos, Enfermeiros, Pacientes, Unidades parceiras, Medicamentos.
- **Acao:** Aguardar carregar os cards. Apontar, da esquerda para a direita (ou na ordem visual): Entradas, Em atendimento, Atendidos, Ocupacao.
- **Fala:** "No *dashboard do administrador*, a gestao enxerga indicadores da **propria unidade**: quantos entraram no periodo, quantos estao em atendimento, quantos foram concluidos e a ocupacao em relacao a capacidade nominal."

**Cena 3 — Filtro de periodo**

- **Tela:** **Dashboard** — barra superior com seletor de periodo (dia / semana / mes / ano) e calendario de data de referencia.
- **Acao:** Clicar no seletor de periodo. Escolher "Semana". Clicar no calendario. Selecionar a data de hoje (ou uma data da semana corrente). Aguardar recarregar cards e grafico.
- **Fala:** "Altero o recorte temporal para mostrar que os numeros nao sao estaticos: entradas, fila e grafico respondem ao periodo e a data de referencia escolhidos."

**Cena 4 — Grafico e fila (rapido)**

- **Tela:** **Dashboard** — grafico "Atendimentos por tempo" e card da fila administrativa.
- **Acao:** Rolar levemente se necessario. Apontar o grafico. Apontar a fila sem abrir tela cheia (a menos que sobre tempo).
- **Fala:** "O grafico distribui os atendimentos no tempo; a fila ao lado reflete o mesmo periodo no perfil administrador, alinhando leitura gerencial e operacao."

**Cena 5 — Listagem de medicos**

- **Tela:** Menu lateral -> clicar em **Medicos** (`/auth/doctors`).
- **Acao:** Aguardar tabela carregar. Passar o mouse sobre uma linha. Apontar colunas (nome, contato, acoes).
- **Fala:** "Em *Medicos*, o que voces veem nao e todos os medicos do sistema: e a listagem dos medicos **da unidade do administrador logado**. Cada usuario operacional carrega um `unitId` no token, e o backend filtra por essa unidade."

**Cena 6 — Criar medico**

- **Tela:** **Medicos** — botao **Adicionar medico(a)** no canto superior direito.
- **Acao:** Clicar em **Adicionar medico(a)**. Preencher no modal: nome (ex.: "Dr. Demo Banca"), e-mail `doctor.demo-banca@yopmail.com`, senha, CRM, especializacao e demais campos obrigatorios. Clicar em **Continuar** / salvar conforme o fluxo do modal. Aguardar mensagem de sucesso e linha nova na tabela.
- **Fala:** "Cadastro um medico novo ao vivo para demonstrar que o sistema nao depende apenas de dados de seed: a unidade pode incluir profissionais no dia a dia."

**Cena 7 — Editar medico**

- **Tela:** **Medicos** — linha do medico recém-criado ou existente.
- **Acao:** Clicar no icone/botao **Editar** da linha. Alterar um campo visivel (ex.: telefone ou consultorio). Clicar em **Salvar alteracoes**. Fechar modal.
- **Fala:** "A edicao completa o ciclo de manutencao do cadastro profissional dentro da mesma unidade."

**Cena 8 — Detalhe do medico**

- **Tela:** **Medicos** — clicar na linha ou em **Ver detalhes** para abrir `/auth/doctors/:id`.
- **Acao:** Mostrar dados do medico. Apontar card "Ultimo atendimento" ou mensagem de sem atendimentos. Nao editar aqui se o tempo apertar.
- **Fala:** "No *detalhe do medico*, consolidamos informacoes do profissional e o vinculo com atendimentos, apoiando a gestao e a auditoria."

**Cena 9 — Listagem de enfermeiros**

- **Tela:** Menu lateral -> **Enfermeiros** (`/auth/nurses`).
- **Acao:** Mostrar tabela carregada.
- **Fala:** "A mesma regra vale para enfermeiros: listagem escopada a unidade do administrador."

**Cena 10 — Criar e editar enfermeiro**

- **Tela:** **Enfermeiros**.
- **Acao:** Clicar **Adicionar enfermeiro(a)**. Preencher nome, e-mail `nurse.demo-banca@yopmail.com`, COREN, turno, etc. Salvar. Em seguida, **Editar** o registro e salvar uma alteracao simples.
- **Fala:** "Incluo e atualizo um enfermeiro da unidade, mantendo o cadastro operacional sob controle local."

**Cena 11 — Detalhe do enfermeiro**

- **Tela:** **Enfermeiros** -> abrir detalhe `/auth/nurses/:id`.
- **Acao:** Mostrar tela de detalhes. Voltar com seta ou menu.
- **Fala:** "O detalhe do enfermeiro espelha o do medico: visao consolidada para gestao."

**Cena 12 — Listagem de pacientes**

- **Tela:** Menu lateral -> **Pacientes** (`/auth/patients`).
- **Acao:** Mostrar alerta informativo no topo: cadastro de pacientes via SignUp. Mostrar tabela de pacientes da unidade.
- **Fala:** "Em *Pacientes*, o administrador consulta e edita quem ja esta vinculado a unidade. O cadastro inicial do paciente e feito pelo proprio usuario em *Cadastrar-se*, na tela publica — reforcamos isso no bloco final do Victor."

**Cena 13 — Editar paciente e detalhe**

- **Tela:** **Pacientes**.
- **Acao:** Clicar **Editar** em um paciente existente. Alterar campo permitido (ex.: condicoes ou alergias). Salvar. Abrir **detalhe** `/auth/patients/:id`. Mostrar dados e ultimo atendimento.
- **Fala:** "A gestao pode atualizar dados cadastrais sem apagar o historico clinico do paciente na unidade."

**Cena 14 — Configuracoes do admin**

- **Tela:** Menu lateral inferior -> botao **Configuracoes** (icone de engrenagem) — abre **ConfigModal**.
- **Acao:** Mostrar abas/campos de nome, contato, senha. Alterar telefone ou apenas exibir fluxo de troca de senha **sem** salvar senha nova, se preferir seguranca na demo.
- **Fala:** "Todo perfil autenticado mantem seus dados de conta em *Configuracoes*, com validacao na API."

**Cena 15 — Unidades parceiras**

- **Tela:** Menu lateral -> **Unidades parceiras** (`/auth/units`).
- **Acao:** Mostrar grid de cards de unidades. Apontar nome, endereco e status (Aberto/Fechado).
- **Fala:** "Aqui consultamos a rede de unidades parceiras — util quando um medicamento nao esta disponivel na unidade local."

**Cena 16 — Medicamentos da unidade**

- **Tela:** Menu lateral -> **Medicamentos** (`/auth/units/:unitId/medications`) — o sistema redireciona para a unidade do admin.
- **Acao:** Aguardar grid de cards de medicamentos. Apontar nome, categoria, tag de disponibilidade e quantidade em estoque.
- **Fala:** "O estoque exibido e da **unidade do usuario logado**. Administrador, medico, enfermeiro e paciente enxergam medicamentos no contexto da unidade, com regras de permissao diferentes."

**Cena 17 — Cadastrar ou editar medicamento**

- **Tela:** **Medicamentos**.
- **Acao:** Clicar **Adicionar Medicamento**. Preencher nome (ex.: "Medicamento Demo Banca"), categoria, quantidade em estoque. Clicar **Cadastrar**. Alternativa: clicar em um card existente -> **Editar medicamento** no modal de detalhes -> salvar.
- **Fala:** "Demonstramos a manutencao do estoque em tempo real, algo relevante para transparencia na rede publica."

**Cena 18 — Indisponivel e parceira**

- **Tela:** **Medicamentos** — card com status indisponivel ou estoque zero.
- **Acao:** Clicar no card. No modal de detalhes, apontar link/mensagem para unidades parceiras. Opcional: voltar, menu **Unidades parceiras**, clicar em outra unidade para ver medicamentos **somente leitura** (sem editar).
- **Fala:** "Quando o item nao esta disponivel aqui, a unidade pode orientar a busca em parceiras — sem quebrar o isolamento de edicao entre unidades."

**Cena 19 — Passagem**

- **Tela:** Qualquer tela autenticada do admin.
- **Acao:** Olhar para Matheus. [APOIO] Fazer logout do admin (menu ou limpar sessao) OU trocar para aba ja logada como enfermeiro.
- **Fala:** "Com a camada de gestao demonstrada, o Matheus assume o perfil de enfermagem e a operacao de triagem."

---

### Matheus Chagas (2 minutos e 30 segundos)

**Cena 1 — Login enfermeiro**

- **Tela:** **Tela de login** (`/`) — ou aba ja autenticada como enfermeiro.
- **Acao:** Login com `nurse.vieira@yopmail.com` / `fastpass` se necessario.
- **Fala:** "Assumo o perfil de enfermagem, *na tela de login*, para mostrar a operacao de triagem na unidade."

**Cena 2 — Dashboard e fila**

- **Tela:** **Dashboard do enfermeiro** (`/auth/dashboard`) — card da fila de triagem.
- **Acao:** Apontar pacientes em `Aguardando triagem`. Citar botao unico **Iniciar triagem** (nao ha acao por linha). Opcional rapido: apontar botao **Presencial** ("cadastrar paciente sem celular").
- **Fala:** "A fila mostra casos da mesma unidade ainda sem enfermeiro atribuido. O botao *Iniciar triagem* faz o claim atomico: evita que dois profissionais peguem o mesmo paciente."

**Cena 3 — Claim e abertura da triagem**

- **Tela:** **Dashboard do enfermeiro**.
- **Acao:** Clicar **Iniciar triagem**. Aguardar redirecionamento para `/auth/triage/:attendanceId`.
- **Fala:** "Ao iniciar, o sistema atribui o caso a mim e abre o detalhe da triagem."

**Cena 4 — Revisar pre-atendimento**

- **Tela:** **Detalhe da triagem** — secao de queixa, sintomas, dor, dados declarados pelo paciente.
- **Acao:** Rolar devagar. Apontar queixa principal e tags de sintomas.
- **Fala:** "A enfermagem recebe o que o paciente ja informou no pre-atendimento, reduzindo repeticao de perguntas na recepcao."

**Cena 5 — Sinais vitais e risco**

- **Tela:** **Detalhe da triagem** — cards de sinais vitais editaveis e seletor de classificacao de risco.
- **Acao:** Preencher ou ajustar: temperatura, pressao arterial, frequencia cardiaca, saturacao, escala de dor. Selecionar nivel de risco (ex.: Urgente). Preencher observacao breve se houver campo.
- **Fala:** "Registramos sinais vitais estruturados e a classificacao de risco, padronizando a passagem para o medico."

**Cena 6 — Concluir triagem**

- **Tela:** **Detalhe da triagem** — botao **Concluir triagem** no topo.
- **Acao:** Clicar **Concluir triagem**. No modal de confirmacao, revisar resumo. Clicar **Confirmar e concluir triagem**. Aguardar sucesso.
- **Fala:** "Ao concluir, o status vai para aguardando atendimento medico — o caso entra na fila do medico da mesma unidade."

**Cena 7 — Historico de triagens**

- **Tela:** Menu lateral -> **Historico de triagens** (`/auth/triages`).
- **Acao:** Mostrar lista com data "Triado em". Clicar em uma linha se quiser reabrir detalhe em leitura.
- **Fala:** "O enfermeiro acompanha o historico das triagens que realizou, com rastreabilidade."

**Cena 8 — Configuracoes**

- **Tela:** **Configuracoes** na sidebar — ConfigModal.
- **Acao:** Abrir e mostrar campo de local de trabalho / dados profissionais. Fechar.
- **Fala:** "O perfil tambem mantem local de triagem, usado depois para avisar o paciente onde se dirigir."

**Cena 9 — Passagem**

- **Tela:** Dashboard ou menu.
- **Acao:** [APOIO] Trocar para aba do medico ou logout/login `doctor.vieira@yopmail.com`.
- **Fala:** "Triagem concluida. O Rafael Silva assume a consulta medica."

---

### Rafael Silva (2 minutos e 30 segundos)

**Cena 1 — Login medico**

- **Tela:** **Tela de login** ou sessao medico.
- **Acao:** `doctor.vieira@yopmail.com` / `fastpass`.
- **Fala:** "No perfil medico, *na tela de login*, continuamos o mesmo episodio que acabou de sair da triagem."

**Cena 2 — Fila medica**

- **Tela:** **Dashboard do medico** (`/auth/dashboard`).
- **Acao:** Apontar fila **Aguardando atendimento**. Clicar **Iniciar atendimento**.
- **Fala:** "Mesma logica de claim: um medico por caso, atribuicao atomica na fila."

**Cena 3 — Detalhe do atendimento — contexto**

- **Tela:** **Detalhe do atendimento** (`/auth/attendance/:attendanceId`).
- **Acao:** Mostrar dados da triagem: vitais, risco, sintomas, queixa.
- **Fala:** "O medico recebe continuidade clinica — nao recomeca do zero."

**Cena 4 — Sugestoes por regras**

- **Tela:** **Detalhe do atendimento** — coluna lateral **Condicoes sugeridas**.
- **Acao:** Aguardar carregar cards com nome da doenca e percentual de compatibilidade. Clicar em uma condicao para abrir modal **Detalhes da Sugestao**.
- **Fala:** "As sugestoes sao *IA simbolica*: pesos de sintomas na base curada, compatibilidade em percentual. Nao e modelo generativo e **nao e diagnostico automatico**."

**Cena 5 — Detalhe da sugestao**

- **Tela:** Modal **Detalhes da Sugestao**.
- **Acao:** Apontar sintomas de referencia, medicamentos e exames sugeridos na base. Fechar modal.
- **Fala:** "O medico usa isso como apoio a decisao, com transparencia sobre o que foi considerado."

**Cena 6 — Finalizar atendimento**

- **Tela:** **Detalhe do atendimento** — botao **Finalizar atendimento**.
- **Acao:** Clicar **Finalizar atendimento**. No modal: selecionar diagnostico da lista (diagnosisKey da base). Preencher texto de diagnostico se opcional. Definir destino do paciente. Adicionar prescricao de medicamento e/ou exame se o modal permitir. Confirmar envio. Aguardar sucesso.
- **Fala:** "A conclusao exige diagnostico alinhado ao catalogo de doencas — amarrando regra de negocio e registro clinico estruturado."

**Cena 7 — Resumo concluido**

- **Tela:** **Detalhe do atendimento** — secao **Resumo do atendimento** (status concluido).
- **Acao:** Apontar diagnostico, prescricoes, exames, data de conclusao.
- **Fala:** "O episodio fica fechado com rastreabilidade para historico e indicadores."

**Cena 8 — Historico**

- **Tela:** Menu -> **Historico de atendimentos** (`/auth/attendances`).
- **Acao:** Mostrar lista. Opcional: reabrir um atendimento concluido.
- **Fala:** "O medico consulta atendimentos anteriores pelos quais foi responsavel."

**Cena 9 — Configuracoes e passagem**

- **Tela:** **Configuracoes** — mostrar `workLocationLabel` (consultorio).
- **Acao:** Fechar. [APOIO] Preparar slide do Rafael Vieira ou troca de apresentador.
- **Fala:** "Encerro o bloco clinico. O Rafael Vieira consolida a arquitetura do fluxo antes do fechamento com o paciente."

---

### Rafael Vieira (2 minutos)

**Cena 1 — Fluxo de estados**

- **Tela:** Slide com fluxo: `onTheWay` -> `waitingTriage` -> `inTriage` -> `waitingAttendance` -> `inAttendance` -> `attendanceCompleted`.
- **Acao:** Percorrer cada seta com o dedo.
- **Fala:** "O que voces viram nao sao telas soltas: e um **maquina de estados** de atendimento, com historico em `changesHistory` para auditoria."

**Cena 2 — Seguranca e isolamento**

- **Tela:** Slide ou diagrama: perfil + unitId + titularidade (doctorId, nurseId, patientId).
- **Acao:** Reforcar tres camadas.
- **Fala:** "Seguranca combina **papel** — admin, enfermeiro, medico, paciente —, **unidade** e **titularidade** do episodio. Por isso o medico A nao abre atendimento do medico B."

**Cena 3 — IA simbolica e limites**

- **Tela:** Slide "IA simbolica" ou trecho do codigo/servico (opcional).
- **Acao:** Tom firme, olhar para a banca.
- **Fala:** "A sugestao calcula compatibilidade por pesos de sintomas — explicavel e reproduzivel. O prototipo nao integra SUS nem substitui o profissional; e apoio a decisao em ambiente academico."

**Cena 4 — Passagem**

- **Tela:** Slide final tecnico ou tela de login ao fundo.
- **Acao:** Chamar Victor.
- **Fala:** "Fechando a parte tecnica, o Victor mostra a jornada do paciente — onde o fluxo comeca de fato."

---

### Victor Campos (3 minutos e 30 segundos)

**Cena 1 — Login paciente**

- **Tela:** **Tela de login**.
- **Acao:** `patient.vieira@yopmail.com` / `fastpass`. Confirmar que **nao** ha atendimento ativo pendente no dashboard antes de criar novo.
- **Fala:** "Fechamos com o paciente, *na tela de login* — o ponto onde a jornada costuma comecar fora da unidade."

**Cena 2 — Cadastro publico (opcional, 30 s)**

- **Tela:** Fazer logout. Abrir `/sign-up` pelo link **Cadastrar-se**.
- **Acao:** Percorrer campos principais (unidade, dados pessoais). Pode **nao** submeter se o tempo apertar.
- **Fala:** "Qualquer pessoa pode criar conta de paciente em *Cadastrar-se*, vinculando-se a uma unidade da rede."

**Cena 3 — Login paciente novamente**

- **Tela:** Login com `patient.vieira@yopmail.com`.
- **Acao:** Entrar.
- **Fala:** "Uso uma conta de demonstracao ja vinculada a unidade para o pre-atendimento ao vivo."

**Cena 4 — Pre-cadastro**

- **Tela:** Menu ou atalho -> **Pre-Cadastro** (`/auth/pre-registration`).
- **Acao:** Preencher queixa principal (ex.: "Febre e dor de garganta ha dois dias"). Data de inicio dos sintomas. Nivel de dor (ex.: 6). Selecionar sintomas nas tags (febre, dor de garganta, etc.). Preencher observacao se desejar. Clicar **Finalizar pre-cadastro**.
- **Fala:** "O paciente registra o pedido de atendimento antes de chegar fisicamente, com sintomas estruturados para a triagem."

**Cena 5 — Confirmacao no modal**

- **Tela:** Modal **Confirmacao de consulta**.
- **Acao:** Revisar resumo. Clicar **Confirmar consulta**. Aguardar redirecionamento ao dashboard com mensagem de sucesso.
- **Fala:** "O status inicial e *a caminho* — o paciente ainda nao entrou na fila da enfermagem."

**Cena 6 — Dashboard paciente — chegada**

- **Tela:** **Dashboard do paciente** (`/auth/dashboard`) — card do atendimento ativo.
- **Acao:** Apontar status "A caminho". Clicar **Confirmar chegada ao hospital**. Aguardar atualizacao para aguardando triagem.
- **Fala:** "Ao confirmar a chegada, *na tela do dashboard do paciente*, o caso entra na fila operacional da unidade — conectando o que fizemos no admin, na enfermagem e no medico."

**Cena 7 — Acompanhamento**

- **Tela:** **Dashboard do paciente** — mensagem de jornada / aviso de local se ja houver claim posterior (mencionar que atualiza quando profissional assume).
- **Acao:** Mostrar status atual. Opcional: abrir **Editar pre-atendimento** se disponivel no card.
- **Fala:** "O paciente acompanha o andamento sem repetir dados ja informados — menos friccao na porta da unidade."

**Cena 8 — Configuracoes do paciente**

- **Tela:** **Configuracoes** — ConfigModal.
- **Acao:** Mostrar dados de saude (alergias, condicoes). Fechar.
- **Fala:** "O paciente tambem atualiza seus dados de perfil de forma autonoma."

**Cena 9 — Encerramento final**

- **Tela:** Slide de encerramento ou dashboard paciente.
- **Acao:** Toda a equipe pode se posicionar junto. Olhar para a banca.
- **Fala:** "Concluimos a demonstracao do **MedIT** em vinte minutos: gestao por unidade, cadastro de equipe, triagem estruturada, consulta com apoio por regras, medicamentos e a jornada do paciente de ponta a ponta. O sistema nao substitui o profissional de saude — organiza o fluxo e apoia a decisao. Agradecemos a atencao da banca e ficamos a disposicao para perguntas."

- **[APOIO]** Fim da apresentacao. Equipe preparada para demo de backup em perguntas (reabrir um atendimento concluido no historico medico, se solicitado).

---

### Dados de demonstracao sugeridos (referencia rapida no dia)

| Acao ao vivo | Valor sugerido |
|--------------|----------------|
| Novo medico | `doctor.demo-banca@yopmail.com` |
| Novo enfermeiro | `nurse.demo-banca@yopmail.com` |
| Novo medicamento | "Medicamento Demo Banca" |
| Pre-atendimento | Queixa: febre + dor de garganta; dor 6/10; sintomas: febre, dor de garganta |
| Paciente sign-up (opcional) | `patient.demo-banca@yopmail.com` |

---

*Fim do roteiro operacional.*
