# Divisão — Apresentação TCC MedIT

## Cronograma

| Tempo | Integrante | Bloco | Duração |
|-------|------------|-------|---------|
| 00:00–02:00 | Brenda Silva | Slides 1–4 | 2:00 |
| 02:00–03:30 | Victor Campos | Slides 5–6 | 1:30 |
| 03:30–05:30 | Évellin Simões | Slides 7–9 | 2:00 |
| 05:30–11:30 | Rafael Vieira | Demo Administrador | 6:00 |
| 11:30–14:15 | Jonatas Lima | Demo Paciente | 2:45 |
| 14:15–16:45 | Matheus Chagas | Demo Enfermeiro | 2:30 |
| 16:45–20:00 | Rafael Silva | Demo Médico + Encerramento | 3:15 |

**Total: 20:00** (~5:30 slides + ~14:30 demo)

---

## Brenda Silva — 00:00 a 02:00 — Slides 1 a 4

**[Capa]** "Boa noite, professores e professoras. Somos a equipe do TCC em Análise e Desenvolvimento de Sistemas e apresentamos o MedIT — uma plataforma web de apoio à triagem e à organização do fluxo hospitalar."

**[apresentação pessoal]** "Eu sou a Brenda Silva, atuei no levantamento de requisitos e na documentação do TCC — e abro a apresentação com o problema que motivou o MedIT."

**[Problema]** "O problema é real nas unidades públicas: superlotação e filas difíceis de prever, triagem e cadastro feitos à mão com retrabalho e risco de erro, histórico espalhado e pouca visibilidade sobre tempo de espera e medicamentos."

**[Objetivo/Impacto]** "Nosso objetivo foi organizar todo o atendimento — cadastro digital, pré-atendimento remoto, fila automática e histórico em um só lugar — com controle por perfil e sugestões por regras, como apoio e nunca substituição do profissional. Passo para a arquitetura."

---

## Victor Campos — 02:00 a 03:30 — Slides 5 e 6

**[apresentação pessoal]** "Eu sou o Victor Campos, contribuí com o desenvolvimento no front-end e no back-end — e apresento a arquitetura e os perfis do sistema."

**[Arquitetura]** "O MedIT é um mono repositório. Front-end em React com Vite e Sass; back-end em Node.js e Express com TypeScript; banco de dados em MongoDB com Mongoose; comunicação por API REST. Login com JWT, access e refresh token, e senhas criptografadas com bcrypt."

**[Módulos/Perfis]** "São quatro perfis, cada um com acesso limitado à sua unidade: administrador, paciente, enfermeiro e médico. Na demo, percorremos nessa ordem. Antes, o fluxo de etapas e as regras."

---

## Évellin Simões — 03:30 a 05:30 — Slides 7 a 9

**[apresentação pessoal]** "Eu sou a Évellin Simões, trabalhei na organização do fluxo de atendimento e na documentação do TCC — e explico o fluxo, a segurança e as sugestões por regras."

**[Fluxo]** "O atendimento passa por seis etapas — Em Rota, Aguardando Triagem, Em Triagem, Aguardando Atendimento, Em Atendimento e Atendimento Concluído. Cada mudança fica registrada no histórico de alterações, para consulta posterior e controle do que foi feito."

**[Segurança]** "A segurança funciona em três níveis: perfil de acesso, unidade de saúde e dono do atendimento — um médico não abre o caso de outro."

**[IA]** "As sugestões usam regras com pesos de sintomas, em percentual de compatibilidade, com resultado que dá para entender. Não é IA generativa, não faz diagnóstico automático e não integra o SUS — quem decide é o médico. Vamos ao sistema, pelo administrador."

---

## Rafael Vieira — 05:30 a 11:30 — Demo Administrador

*(bloco mais longo — login, painel e cadastros ao vivo em várias telas)*

**[apresentação pessoal]** "Eu sou o Rafael Vieira, atuei no desenvolvimento no front-end e no back-end e na revisão de código do projeto — e demonstro o sistema pelo perfil de administrador."

"Começo pela tela de login — agora entro como administrador; o cadastro público na tela de sign-up a gente detalha depois, na jornada do paciente. O administrador cuida de uma unidade. No painel, indicadores da própria unidade: entradas, em atendimento, atendidos e ocupação, com filtro por período; aqui o gráfico e a fila administrativa. Em Médicos, atenção: é a lista da unidade do administrador logado, não de todos. Cadastro um médico ao vivo, edito um campo e abro o detalhe. A mesma lógica em Enfermeiros: cadastro e edito. Em Pacientes, o administrador consulta e edita quem já está ligado à unidade — o cadastro inicial é feito pelo próprio paciente, na tela pública. Em Medicamentos, o estoque da unidade com status de disponibilidade: cadastro um item ao vivo, edito um campo e abro o detalhe. Em Unidades parceiras vejo a rede — quando falta um item, o sistema orienta a busca nas parceiras, sem misturar dados de uma unidade com outra. Por fim, abro Configurações do usuário logado — o mesmo modal em todos os níveis; cada perfil atualiza ali seus dados de conta, de acordo com o perfil. Passo para a jornada do paciente."

---

## Jonatas Lima — 11:30 a 14:15 — Demo Paciente

**[apresentação pessoal]** "Eu sou o Jonatas Lima, atuei no front-end, no cadastro público e no pré-atendimento do paciente — e mostro essa jornada ao vivo."

"A jornada começa no paciente, fora da unidade. Começo pelo sign-up na tela pública: cadastro um paciente ao vivo com nome, CPF, unidade de saúde, e-mail e senha — já ligado ao ponto de atendimento. No pré-cadastro, informa queixa, início dos sintomas, nível de dor e seleciona os sintomas — tudo organizado para a triagem. O status inicial é 'Em Rota': ainda não está na fila. Ao confirmar chegada, o caso entra na fila — e a enfermagem e o médico continuam o mesmo atendimento, sem repetir dados. Passo para a enfermagem."

---

## Matheus Chagas — 14:15 a 16:45 — Demo Enfermeiro

**[apresentação pessoal]** "Eu sou o Matheus Chagas, atuei no front-end, no fluxo de triagem e na interface do enfermeiro — e assumo essa etapa na demonstração."

"Na fila de triagem, os pacientes da unidade ainda sem enfermeiro. Clico em Iniciar triagem — o sistema reserva o caso para o enfermeiro logado e abre o detalhe. Recebo o que o paciente informou no pré-atendimento — queixa e sintomas —, sem precisar perguntar de novo. Registro os sinais vitais — temperatura, pressão, frequência, saturação — e a classificação de risco. Ao concluir, o status vai para Aguardando atendimento médico e entra na fila do médico da unidade. No histórico, acompanho as triagens que realizei, com registro do que foi feito. Passo para o médico."

---

## Rafael Silva — 16:45 a 20:00 — Demo Médico + Encerramento

**[apresentação pessoal]** "Eu sou o Rafael Silva, atuei no front-end, no atendimento médico e nas sugestões por regras — e encerro a apresentação pelo perfil do médico."

"No perfil médico, continuamos o mesmo atendimento que saiu da triagem. Na fila, Iniciar atendimento — mesma reserva: um médico por caso. O médico já vê vitais, risco e sintomas, sem recomeçar. Na lateral, as Condições sugeridas com o percentual de compatibilidade; abrindo o detalhe, vejo os sintomas de referência e o que a base sugere, de forma clara. Para finalizar, seleciono o diagnóstico do catálogo, registro prescrição e exames e defino o destino do paciente. O atendimento fecha, com resumo e registro para histórico e indicadores."

**[Slide 10 — Encerramento]** "Concluímos o MedIT: nos slides, contexto e arquitetura; na prática, gestão por unidade, cadastro de equipe, jornada do paciente, triagem organizada e atendimento com apoio por regras — do início ao fim. O sistema organiza o fluxo e apoia a decisão, sem substituir o profissional de saúde. Agradecemos a atenção da banca e ficamos à disposição para perguntas."
