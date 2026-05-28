# Roteiro Operacional — Apresentação Final TCC MedIT

---

## Estrutura Geral

| Item | Definição |
|------|-----------|
| Duração | 20 minutos (~6 min slides + ~14 min demonstração ao vivo) |
| Equipe | 7 integrantes; cada um conduz **um único bloco** e não retorna |
| Ordem linear | Brenda → Evellin → Rafael Vieira → Jonatas → Matheus → Rafael Silva → Victor (cada um fala **uma vez**, sem retorno) |
| Fases | **Slides** (Brenda, Evellin, Rafael Vieira) → **Sistema** (Jonatas, Matheus, Rafael Silva, Victor) |
| Ordem da demo | Administrador → Enfermeiro → Médico → Paciente |
| Mensagem central | Plataforma de apoio ao fluxo hospitalar, com controle por perfil e sugestões por regras — **sem substituir o profissional** |
| Regra de ouro (admin) | Todo usuário operacional pertence a **uma unidade**; listagens do admin são **da unidade dele** |

---

## Cronograma Resumido

### Bloco 1 — Slides (~6 min)

| Horário | Integrante | Tópicos |
|---------|------------|---------|
| 00:00–02:50 | Brenda Silva | Slides: abertura, equipe, problema, motivação, objetivo, impacto |
| 02:50–04:20 | Evellin Simões | Slides: arquitetura e módulos |
| 04:20–06:00 | Rafael Vieira | Slides: fluxo de status, segurança, IA simbólica |

### Bloco 2 — Demonstração ao vivo (~14 min)

| Horário | Integrante | Tópicos |
|---------|------------|---------|
| 06:00–11:15 | Jonatas Lima | Login (entrada + perfil admin), dashboard, médicos CRUD+detail, enfermeiros CRUD+detail, pacientes list+detail+edit, config, unidades parceiras, medicamentos |
| 11:15–13:45 | Matheus Chagas | Enfermeiro: dashboard/fila, triagem completa, histórico triagens, config |
| 13:45–16:15 | Rafael Silva | Médico: dashboard/fila, atendimento, sugestões, finalizar atendimento, histórico, config |
| 16:15–20:00 | Victor Campos | Paciente: sign-up (opcional), pré-cadastro, confirmar chegada, config, encerramento |

---

## Possíveis Perguntas da Banca

| Pergunta | Resposta sugerida |
|----------|-------------------|
| Dois profissionais no mesmo caso? | Claim atômico na fila; API valida status e se já há responsável. |
| Admin vê médicos de outras unidades? | Não; listagens filtradas pelo `unitId` do token. |
| Por que admin primeiro e paciente por último? | Da governança operacional ao impacto na ponta (usuário final). |
| É diagnóstico automático? | Não; sugestão por regras com % de compatibilidade; decisão é do médico. |
| LGPD? | Controle por perfil, minimização de exposição; conformidade plena depende da instituição. |
| Só dados de seed? | Demonstramos criação ao vivo (médico/enfermeiro no admin, pré-atendimento do paciente). |

---

## Script Completo

> Formato de cada cena: **Tela** (onde estar) → **Ação** (o que fazer, clique a clique) → **Fala** (texto integral, com a tela indicada em destaque).
>
> Linhas `[APOIO]` são para quem opera o notebook, sem microfone.

---

## Bloco 1 — Slides

### Brenda Silva (2 minutos e 50 segundos)

**Cena 1 — Abertura**

- **Tela:** Slide de capa (projetor; notebook pode estar em standby ou com login ao fundo, sem foco).
- **Ação:** Posicionar-se de frente para a banca. Olhar para os avaliadores. Não mexer no computador ainda.
- **Fala:** "Boa noite, professores e professoras. Somos a equipe do Trabalho de Conclusão de Curso em Análise e Desenvolvimento de Sistemas, e hoje apresentamos o **MedIT** — uma plataforma web de apoio à triagem e à organização do fluxo hospitalar."

**Cena 2 — Equipe**

- **Tela:** Slide com nomes dos sete integrantes.
- **Ação:** Apontar o slide, citar cada nome com uma palavra sobre a área (frontend, backend, regras de negócio, etc.), sem ler lista mecanicamente.
- **Fala:** "O time é formado por Brenda Silva, Evellin Simões, Jonatas Lima, Matheus Chagas, Rafael Silva, Rafael Vieira e Victor Campos. Cada um conduz um bloco da apresentação, em sequência, para mostrar o sistema completo em vinte minutos."

**Cena 3 — Problema**

- **Tela:** Slide "Problema".
- **Ação:** Pausa breve após o título. Gestualizar fila / sobrecarga se couber.
- **Fala:** "Partimos de um problema real nas unidades públicas: superlotação, filas com pouca previsibilidade, retrabalho na coleta de informações e falta de visibilidade operacional para quem gerencia o dia a dia."

**Cena 4 — Motivação e objetivo**

- **Tela:** Slide "Objetivo" (ou motivação + objetivo no mesmo slide).
- **Ação:** Transição de slide com calma.
- **Fala:** "Nosso objetivo foi construir uma solução que organize a jornada do atendimento de ponta a ponta: cadastro, triagem, consulta e indicadores, com dados estruturados, controle por perfil de acesso e um mecanismo de sugestões baseado em regras — sempre como **apoio** ao profissional, nunca como substituição da decisão clínica."

**Cena 5 — Impacto e passagem**

- **Tela:** Slide "Impacto esperado".
- **Ação:** Manter slide visível. Olhar para Evellin.
- **Fala:** "Esperamos reduzir fricção na entrada do paciente, diminuir retrabalho na triagem e dar base objetiva para a gestão da unidade. Com o contexto apresentado, a Evellin mostra a arquitetura do sistema."

- **[APOIO]** Evellin assume com slide de arquitetura.

---

### Evellin Simões (1 minuto e 30 segundos — slides)

**Cena 1 — Arquitetura**

- **Tela:** Slide "Arquitetura" (diagrama frontend / API / MongoDB).
- **Ação:** Explicar o diagrama com o dedo ou laser; não abrir o sistema ainda.
- **Fala:** "O MedIT é um monorepo: **frontend** em React com Vite, **backend** em Express com TypeScript e **persistência** em MongoDB. A comunicação é via API REST, com autenticação JWT — access token e refresh token — e senhas armazenadas com hash."

**Cena 2 — Módulos e passagem**

- **Tela:** Slide "Módulos" ou lista: Admin, Enfermagem, Médico, Paciente.
- **Ação:** Enumerar os quatro blocos que a banca verá na demonstração. Olhar para Rafael Vieira.
- **Fala:** "Na demonstração percorremos o sistema na ordem operacional: primeiro o **administrador da unidade**, depois **enfermagem**, **médico** e, por fim, o **paciente** — fechando com a experiência de quem inicia o atendimento fora da unidade. O Rafael Vieira consolida o fluxo técnico antes de entrarmos ao vivo."

- **[APOIO]** Rafael Vieira assume com slides de fluxo, segurança e IA simbólica.

---

### Rafael Vieira (1 minuto e 40 segundos — slides)

**Cena 1 — Fluxo de estados**

- **Tela:** Slide com fluxo: `onTheWay` → `waitingTriage` → `inTriage` → `waitingAttendance` → `inAttendance` → `attendanceCompleted`.
- **Ação:** Percorrer cada seta com o dedo.
- **Fala:** "O atendimento não é uma sequência de telas soltas: é uma **máquina de estados**, com histórico em `changesHistory` para auditoria — da chegada do paciente à conclusão do episódio."

**Cena 2 — Segurança e isolamento**

- **Tela:** Slide ou diagrama: perfil + unitId + titularidade (doctorId, nurseId, patientId).
- **Ação:** Reforçar três camadas.
- **Fala:** "A segurança combina **papel** — admin, enfermeiro, médico, paciente —, **unidade** e **titularidade** do episódio. Por isso o médico A não abre atendimento do médico B, e o administrador enxerga apenas a própria unidade."

**Cena 3 — IA simbólica e limites**

- **Tela:** Slide "IA simbólica" ou trecho do serviço (opcional).
- **Ação:** Tom firme, olhar para a banca.
- **Fala:** "As sugestões calculam compatibilidade por pesos de sintomas — explicável e reproduzível. O protótipo não integra o SUS nem substitui o profissional; é apoio à decisão em ambiente acadêmico."

**Cena 4 — Passagem para a demonstração**

- **Tela:** Slide final técnico ou tela de login ao fundo (projeto já aberto no navegador).
- **Ação:** Fechar apresentação de slides ou alternar para o navegador. Chamar Jonatas ao notebook.
- **Fala:** "Com o fluxo e as regras de negócio apresentados, o Jonatas abre a demonstração ao vivo pelo perfil administrador da unidade."

- **[APOIO]** Deixar o MedIT na **tela de login** (`/`). Jonatas assume o teclado.

---

## Bloco 2 — Demonstração ao vivo

### Jonatas Lima (5 minutos e 15 segundos)

**Cena 1 — Entrada no sistema**

- **Tela:** **Tela de login** do MedIT (`/`) — projeto já aberto no navegador, tema claro ou escuro fixo.
- **Ação:** Mostrar campos "E-mail ou CPF" e "Senha". Apontar o link "Cadastrar-se" na parte inferior, **sem** clicar ainda.
- **Fala:** "Este é o ponto de entrada do sistema, *na tela de login*. Pacientes podem se cadastrar pela rota pública de sign-up; profissionais e gestores acessam com credenciais vinculadas à unidade. Entro agora como administrador da unidade."

**Cena 2 — Login administrador**

- **Tela:** **Tela de login** (`/`).
- **Ação:** Clicar no campo de identificador. Informar o usuário administrador da unidade. Clicar em senha. Informar a senha. Clicar no botão de entrar (submit do formulário).
- **Fala:** "Com o perfil administrador, *na tela de login*, represento a gestão operacional local — não a rede inteira, e sim **uma** unidade específica."

**Cena 3 — Dashboard**

- **Tela:** **Dashboard do administrador** (`/auth/dashboard`) — menu lateral com Dashboard, Médicos, Enfermeiros, Pacientes, Unidades parceiras, Medicamentos.
- **Ação:** Aguardar carregar os cards. Apontar, da esquerda para a direita (ou na ordem visual): Entradas, Em atendimento, Atendidos, Ocupação.
- **Fala:** "No *dashboard do administrador*, a gestão enxerga indicadores da **própria unidade**: quantos entraram no período, quantos estão em atendimento, quantos foram concluídos e a ocupação em relação à capacidade nominal."

**Cena 4 — Filtro de período**

- **Tela:** **Dashboard** — barra superior com seletor de período (dia / semana / mês / ano) e calendário de data de referência.
- **Ação:** Clicar no seletor de período. Escolher "Semana". Clicar no calendário. Selecionar a data de hoje (ou uma data da semana corrente). Aguardar recarregar cards e gráfico.
- **Fala:** "Altero o recorte temporal para mostrar que os números não são estáticos: entradas, fila e gráfico respondem ao período e à data de referência escolhidos."

**Cena 5 — Gráfico e fila (rápido)**

- **Tela:** **Dashboard** — gráfico "Atendimentos por tempo" e card da fila administrativa.
- **Ação:** Rolar levemente se necessário. Apontar o gráfico. Apontar a fila sem abrir tela cheia (a menos que sobre tempo).
- **Fala:** "O gráfico distribui os atendimentos no tempo; a fila ao lado reflete o mesmo período no perfil administrador, alinhando leitura gerencial e operação."

**Cena 6 — Listagem de médicos**

- **Tela:** Menu lateral → clicar em **Médicos** (`/auth/doctors`).
- **Ação:** Aguardar tabela carregar. Passar o mouse sobre uma linha. Apontar colunas (nome, contato, ações).
- **Fala:** "Em *Médicos*, o que vocês veem não é todos os médicos do sistema: é a listagem dos médicos **da unidade do administrador logado**. Cada usuário operacional carrega um `unitId` no token, e o backend filtra por essa unidade."

**Cena 7 — Criar médico**

- **Tela:** **Médicos** — botão **Adicionar médico(a)** no canto superior direito.
- **Ação:** Clicar em **Adicionar médico(a)**. Preencher no modal: nome (ex.: "Dr. Demo Banca"), identificador de login, senha, CRM, especialização e demais campos obrigatórios. Clicar em **Continuar** / salvar conforme o fluxo do modal. Aguardar mensagem de sucesso e linha nova na tabela.
- **Fala:** "Cadastro um médico novo ao vivo para demonstrar que o sistema não depende apenas de dados de seed: a unidade pode incluir profissionais no dia a dia."

**Cena 8 — Editar médico**

- **Tela:** **Médicos** — linha do médico recém-criado ou existente.
- **Ação:** Clicar no ícone/botão **Editar** da linha. Alterar um campo visível (ex.: telefone ou consultório). Clicar em **Salvar alterações**. Fechar modal.
- **Fala:** "A edição completa o ciclo de manutenção do cadastro profissional dentro da mesma unidade."

**Cena 9 — Detalhe do médico**

- **Tela:** **Médicos** — clicar na linha ou em **Ver detalhes** para abrir `/auth/doctors/:id`.
- **Ação:** Mostrar dados do médico. Apontar card "Último atendimento" ou mensagem de sem atendimentos. Não editar aqui se o tempo apertar.
- **Fala:** "No *detalhe do médico*, consolidamos informações do profissional e o vínculo com atendimentos, apoiando a gestão e a auditoria."

**Cena 10 — Listagem de enfermeiros**

- **Tela:** Menu lateral → **Enfermeiros** (`/auth/nurses`).
- **Ação:** Mostrar tabela carregada.
- **Fala:** "A mesma regra vale para enfermeiros: listagem escopada à unidade do administrador."

**Cena 11 — Criar e editar enfermeiro**

- **Tela:** **Enfermeiros**.
- **Ação:** Clicar **Adicionar enfermeiro(a)**. Preencher nome, identificador de login, COREN, turno, etc. Salvar. Em seguida, **Editar** o registro e salvar uma alteração simples.
- **Fala:** "Incluo e atualizo um enfermeiro da unidade, mantendo o cadastro operacional sob controle local."

**Cena 12 — Detalhe do enfermeiro**

- **Tela:** **Enfermeiros** → abrir detalhe `/auth/nurses/:id`.
- **Ação:** Mostrar tela de detalhes. Voltar com seta ou menu.
- **Fala:** "O detalhe do enfermeiro espelha o do médico: visão consolidada para gestão."

**Cena 13 — Listagem de pacientes**

- **Tela:** Menu lateral → **Pacientes** (`/auth/patients`).
- **Ação:** Mostrar alerta informativo no topo: cadastro de pacientes via SignUp. Mostrar tabela de pacientes da unidade.
- **Fala:** "Em *Pacientes*, o administrador consulta e edita quem já está vinculado à unidade. O cadastro inicial do paciente é feito pelo próprio usuário em *Cadastrar-se*, na tela pública — reforçamos isso no bloco final do Victor."

**Cena 14 — Editar paciente e detalhe**

- **Tela:** **Pacientes**.
- **Ação:** Clicar **Editar** em um paciente existente. Alterar campo permitido (ex.: condições ou alergias). Salvar. Abrir **detalhe** `/auth/patients/:id`. Mostrar dados e último atendimento.
- **Fala:** "A gestão pode atualizar dados cadastrais sem apagar o histórico clínico do paciente na unidade."

**Cena 15 — Configurações do admin**

- **Tela:** Menu lateral inferior → botão **Configurações** (ícone de engrenagem) — abre **ConfigModal**.
- **Ação:** Mostrar abas/campos de nome, contato e opção de alteração de senha. Alterar telefone ou apenas exibir o fluxo **sem** salvar alteração sensível, se preferir na demo.
- **Fala:** "Todo perfil autenticado mantém seus dados de conta em *Configurações*, com validação na API."

**Cena 16 — Unidades parceiras**

- **Tela:** Menu lateral → **Unidades parceiras** (`/auth/units`).
- **Ação:** Mostrar grid de cards de unidades. Apontar nome, endereço e status (Aberto/Fechado).
- **Fala:** "Aqui consultamos a rede de unidades parceiras — útil quando um medicamento não está disponível na unidade local."

**Cena 17 — Medicamentos da unidade**

- **Tela:** Menu lateral → **Medicamentos** (`/auth/units/:unitId/medications`) — o sistema redireciona para a unidade do admin.
- **Ação:** Aguardar grid de cards de medicamentos. Apontar nome, categoria, tag de disponibilidade e quantidade em estoque.
- **Fala:** "O estoque exibido é da **unidade do usuário logado**. Administrador, médico, enfermeiro e paciente enxergam medicamentos no contexto da unidade, com regras de permissão diferentes."

**Cena 18 — Cadastrar ou editar medicamento**

- **Tela:** **Medicamentos**.
- **Ação:** Clicar **Adicionar Medicamento**. Preencher nome (ex.: "Medicamento Demo Banca"), categoria, quantidade em estoque. Clicar **Cadastrar**. Alternativa: clicar em um card existente → **Editar medicamento** no modal de detalhes → salvar.
- **Fala:** "Demonstramos a manutenção do estoque em tempo real, algo relevante para transparência na rede pública."

**Cena 19 — Indisponível e parceira**

- **Tela:** **Medicamentos** — card com status indisponível ou estoque zero.
- **Ação:** Clicar no card. No modal de detalhes, apontar link/mensagem para unidades parceiras. Opcional: voltar, menu **Unidades parceiras**, clicar em outra unidade para ver medicamentos **somente leitura** (sem editar).
- **Fala:** "Quando o item não está disponível aqui, a unidade pode orientar a busca em parceiras — sem quebrar o isolamento de edição entre unidades."

**Cena 20 — Passagem**

- **Tela:** Qualquer tela autenticada do admin.
- **Ação:** Olhar para Matheus. [APOIO] Fazer logout do admin (menu ou limpar sessão) **ou** trocar para aba já autenticada como enfermeiro.
- **Fala:** "Com a camada de gestão demonstrada, o Matheus assume o perfil de enfermagem e a operação de triagem."

---

### Matheus Chagas (2 minutos e 30 segundos)

**Cena 1 — Login enfermeiro**

- **Tela:** **Tela de login** (`/`) — ou aba já autenticada como enfermeiro.
- **Ação:** Efetuar login com o perfil de enfermagem, se necessário.
- **Fala:** "Assumo o perfil de enfermagem, *na tela de login*, para mostrar a operação de triagem na unidade."

**Cena 2 — Dashboard e fila**

- **Tela:** **Dashboard do enfermeiro** (`/auth/dashboard`) — card da fila de triagem.
- **Ação:** Apontar pacientes em `Aguardando triagem`. Citar botão único **Iniciar triagem** (não há ação por linha). Opcional rápido: apontar botão **Presencial** ("cadastrar paciente sem celular").
- **Fala:** "A fila mostra casos da mesma unidade ainda sem enfermeiro atribuído. O botão *Iniciar triagem* faz o claim atômico: evita que dois profissionais peguem o mesmo paciente."

**Cena 3 — Claim e abertura da triagem**

- **Tela:** **Dashboard do enfermeiro**.
- **Ação:** Clicar **Iniciar triagem**. Aguardar redirecionamento para `/auth/triage/:attendanceId`.
- **Fala:** "Ao iniciar, o sistema atribui o caso a mim e abre o detalhe da triagem."

**Cena 4 — Revisar pré-atendimento**

- **Tela:** **Detalhe da triagem** — seção de queixa, sintomas, dor, dados declarados pelo paciente.
- **Ação:** Rolar devagar. Apontar queixa principal e tags de sintomas.
- **Fala:** "A enfermagem recebe o que o paciente já informou no pré-atendimento, reduzindo repetição de perguntas na recepção."

**Cena 5 — Sinais vitais e risco**

- **Tela:** **Detalhe da triagem** — cards de sinais vitais editáveis e seletor de classificação de risco.
- **Ação:** Preencher ou ajustar: temperatura, pressão arterial, frequência cardíaca, saturação, escala de dor. Selecionar nível de risco (ex.: Urgente). Preencher observação breve se houver campo.
- **Fala:** "Registramos sinais vitais estruturados e a classificação de risco, padronizando a passagem para o médico."

**Cena 6 — Concluir triagem**

- **Tela:** **Detalhe da triagem** — botão **Concluir triagem** no topo.
- **Ação:** Clicar **Concluir triagem**. No modal de confirmação, revisar resumo. Clicar **Confirmar e concluir triagem**. Aguardar sucesso.
- **Fala:** "Ao concluir, o status vai para aguardando atendimento médico — o caso entra na fila do médico da mesma unidade."

**Cena 7 — Histórico de triagens**

- **Tela:** Menu lateral → **Histórico de triagens** (`/auth/triages`).
- **Ação:** Mostrar lista com data "Triado em". Clicar em uma linha se quiser reabrir detalhe em leitura.
- **Fala:** "O enfermeiro acompanha o histórico das triagens que realizou, com rastreabilidade."

**Cena 8 — Configurações**

- **Tela:** **Configurações** na sidebar — ConfigModal.
- **Ação:** Abrir e mostrar campo de local de trabalho / dados profissionais. Fechar.
- **Fala:** "O perfil também mantém local de triagem, usado depois para avisar o paciente onde se dirigir."

**Cena 9 — Passagem**

- **Tela:** Dashboard ou menu.
- **Ação:** [APOIO] Trocar para aba do médico ou logout/login com perfil médico.
- **Fala:** "Triagem concluída. O Rafael Silva assume a consulta médica."

---

### Rafael Silva (2 minutos e 30 segundos)

**Cena 1 — Login médico**

- **Tela:** **Tela de login** ou sessão médico.
- **Ação:** Efetuar login com o perfil médico.
- **Fala:** "No perfil médico, *na tela de login*, continuamos o mesmo episódio que acabou de sair da triagem."

**Cena 2 — Fila médica**

- **Tela:** **Dashboard do médico** (`/auth/dashboard`).
- **Ação:** Apontar fila **Aguardando atendimento**. Clicar **Iniciar atendimento**.
- **Fala:** "Mesma lógica de claim: um médico por caso, atribuição atômica na fila."

**Cena 3 — Detalhe do atendimento — contexto**

- **Tela:** **Detalhe do atendimento** (`/auth/attendance/:attendanceId`).
- **Ação:** Mostrar dados da triagem: vitais, risco, sintomas, queixa.
- **Fala:** "O médico recebe continuidade clínica — não recomeça do zero."

**Cena 4 — Sugestões por regras**

- **Tela:** **Detalhe do atendimento** — coluna lateral **Condições sugeridas**.
- **Ação:** Aguardar carregar cards com nome da doença e percentual de compatibilidade. Clicar em uma condição para abrir modal **Detalhes da Sugestão**.
- **Fala:** "As sugestões são *IA simbólica*: pesos de sintomas na base curada, compatibilidade em percentual. Não é modelo generativo e **não é diagnóstico automático**."

**Cena 5 — Detalhe da sugestão**

- **Tela:** Modal **Detalhes da Sugestão**.
- **Ação:** Apontar sintomas de referência, medicamentos e exames sugeridos na base. Fechar modal.
- **Fala:** "O médico usa isso como apoio à decisão, com transparência sobre o que foi considerado."

**Cena 6 — Finalizar atendimento**

- **Tela:** **Detalhe do atendimento** — botão **Finalizar atendimento**.
- **Ação:** Clicar **Finalizar atendimento**. No modal: selecionar diagnóstico da lista (diagnosisKey da base). Preencher texto de diagnóstico se opcional. Definir destino do paciente. Adicionar prescrição de medicamento e/ou exame se o modal permitir. Confirmar envio. Aguardar sucesso.
- **Fala:** "A conclusão exige diagnóstico alinhado ao catálogo de doenças — amarrando regra de negócio e registro clínico estruturado."

**Cena 7 — Resumo concluído**

- **Tela:** **Detalhe do atendimento** — seção **Resumo do atendimento** (status concluído).
- **Ação:** Apontar diagnóstico, prescrições, exames, data de conclusão.
- **Fala:** "O episódio fica fechado com rastreabilidade para histórico e indicadores."

**Cena 8 — Histórico**

- **Tela:** Menu → **Histórico de atendimentos** (`/auth/attendances`).
- **Ação:** Mostrar lista. Opcional: reabrir um atendimento concluído.
- **Fala:** "O médico consulta atendimentos anteriores pelos quais foi responsável."

**Cena 9 — Configurações e passagem**

- **Tela:** **Configurações** — mostrar `workLocationLabel` (consultório).
- **Ação:** Fechar. [APOIO] Trocar para aba do paciente ou logout/login com perfil paciente (sem atendimento ativo pendente).
- **Fala:** "Encerro o bloco clínico. O Victor mostra a jornada do paciente — onde o fluxo começa de fato."

---

### Victor Campos (3 minutos e 45 segundos)

**Cena 1 — Login paciente**

- **Tela:** **Tela de login**.
- **Ação:** Efetuar login com o perfil paciente. Confirmar que **não** há atendimento ativo pendente no dashboard antes de criar novo.
- **Fala:** "Fechamos com o paciente, *na tela de login* — o ponto onde a jornada costuma começar fora da unidade."

**Cena 2 — Cadastro público (opcional, 30 s)**

- **Tela:** Fazer logout. Abrir `/sign-up` pelo link **Cadastrar-se**.
- **Ação:** Percorrer campos principais (unidade, dados pessoais). Pode **não** submeter se o tempo apertar.
- **Fala:** "Qualquer pessoa pode criar conta de paciente em *Cadastrar-se*, vinculando-se a uma unidade da rede."

**Cena 3 — Login paciente novamente**

- **Tela:** **Tela de login**.
- **Ação:** Entrar com a conta de demonstração já vinculada à unidade.
- **Fala:** "Uso uma conta de demonstração já vinculada à unidade para o pré-atendimento ao vivo."

**Cena 4 — Pré-cadastro**

- **Tela:** Menu ou atalho → **Pré-Cadastro** (`/auth/pre-registration`).
- **Ação:** Preencher queixa principal (ex.: "Febre e dor de garganta há dois dias"). Data de início dos sintomas. Nível de dor (ex.: 6). Selecionar sintomas nas tags (febre, dor de garganta, etc.). Preencher observação se desejar. Clicar **Finalizar pré-cadastro**.
- **Fala:** "O paciente registra o pedido de atendimento antes de chegar fisicamente, com sintomas estruturados para a triagem."

**Cena 5 — Confirmação no modal**

- **Tela:** Modal **Confirmação de consulta**.
- **Ação:** Revisar resumo. Clicar **Confirmar consulta**. Aguardar redirecionamento ao dashboard com mensagem de sucesso.
- **Fala:** "O status inicial é *a caminho* — o paciente ainda não entrou na fila da enfermagem."

**Cena 6 — Dashboard paciente — chegada**

- **Tela:** **Dashboard do paciente** (`/auth/dashboard`) — card do atendimento ativo.
- **Ação:** Apontar status "A caminho". Clicar **Confirmar chegada ao hospital**. Aguardar atualização para aguardando triagem.
- **Fala:** "Ao confirmar a chegada, *na tela do dashboard do paciente*, o caso entra na fila operacional da unidade — conectando o que vimos no admin, na enfermagem e no médico."

**Cena 7 — Acompanhamento**

- **Tela:** **Dashboard do paciente** — mensagem de jornada / aviso de local se já houver claim posterior (mencionar que atualiza quando profissional assume).
- **Ação:** Mostrar status atual. Opcional: abrir **Editar pré-atendimento** se disponível no card.
- **Fala:** "O paciente acompanha o andamento sem repetir dados já informados — menos fricção na porta da unidade."

**Cena 8 — Configurações do paciente**

- **Tela:** **Configurações** — ConfigModal.
- **Ação:** Mostrar dados de saúde (alergias, condições). Fechar.
- **Fala:** "O paciente também atualiza seus dados de perfil de forma autônoma."

**Cena 9 — Encerramento final**

- **Tela:** Slide de encerramento ou dashboard paciente.
- **Ação:** Toda a equipe pode se posicionar junto. Olhar para a banca.
- **Fala:** "Concluímos a demonstração do **MedIT** em vinte minutos: contexto e arquitetura nos slides; na prática, gestão por unidade, cadastro de equipe, triagem estruturada, consulta com apoio por regras, medicamentos e a jornada do paciente de ponta a ponta. O sistema não substitui o profissional de saúde — organiza o fluxo e apoia a decisão. Agradecemos a atenção da banca e ficamos à disposição para perguntas."

- **[APOIO]** Fim da apresentação. Equipe preparada para demo de backup em perguntas (reabrir um atendimento concluído no histórico médico, se solicitado).