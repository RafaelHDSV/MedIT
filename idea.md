# MedIT — Plataforma digital de apoio à triagem e organização do fluxo hospitalar

Documento de visão do produto e do trabalho acadêmico, alinhado ao repositório **MedIT** (monorepo `frontend` + `backend`). Detalhes de execução, scripts e pré-requisitos estão no [`README.md`](README.md).

## Sumário

- [MedIT neste repositório](#medit-neste-repositório)
- [1. Introdução](#1-introdução)
- [2. Justificativa](#2-justificativa)
- [3. Objetivo geral](#3-objetivo-geral)
- [4. Objetivos específicos](#4-objetivos-específicos)
- [5. Descrição do sistema](#5-descrição-do-sistema)
- [6. Arquitetura e stack](#6-arquitetura-e-stack)
- [7. Modelo de atendimento no código](#7-modelo-de-atendimento-no-código)
- [8. Mecanismo inteligente (regras)](#8-mecanismo-inteligente-regras)
- [9. Requisitos funcionais](#9-requisitos-funcionais)
- [10. Requisitos não funcionais](#10-requisitos-não-funcionais)
- [11. Delimitação do projeto](#11-delimitação-do-projeto)
- [12. Estado de implementação no repositório](#12-estado-de-implementação-no-repositório)
- [13. Contribuição esperada](#13-contribuição-esperada)
- [14. Considerações finais](#14-considerações-finais)
- [Contexto acadêmico e autoria](#contexto-acadêmico-e-autoria)

---

## MedIT neste repositório

**MedIT** é a implementação web da proposta: apoio à **organização do fluxo** em unidade, **triagem estruturada**, **histórico** e **consulta de medicamentos**, com **sugestões por regras** (IA simbólica) — sempre como apoio ao profissional, sem diagnóstico automático.

| Camada | Pasta / tecnologia |
|--------|---------------------|
| Apresentação | `frontend/` — React (Vite), TypeScript, Ant Design, Sass, React Router |
| Aplicação e API | `backend/` — Node.js, Express, TypeScript |
| Persistência | MongoDB via Mongoose; modelos em `backend/src/models` e schemas em `backend/src/schema` |
| Segurança | JWT, bcrypt; rotas sob prefixo `/auth/...` |
| Dados sintoma–doença | Coleção `SymptomsDisease`; carga via script em `backend/src/scripts/scripts/createSymptomsDiaseases.script.ts` |

Monorepo na raiz: scripts `yarn dev` (frontend e backend em paralelo), conforme `package.json` da raiz.

---

## 1. Introdução

A rede pública de saúde enfrenta desafios recorrentes relacionados à superlotação, tempo elevado de espera, falta de organização no fluxo de atendimento e dificuldade de acesso a informações sobre disponibilidade de medicamentos. Esses fatores impactam diretamente a qualidade do atendimento e a experiência do paciente.

Com o avanço da transformação digital e a ampliação do acesso à internet e a dispositivos móveis, torna-se possível desenvolver soluções tecnológicas que auxiliem na organização hospitalar, na triagem inicial e na transparência das informações.

Diante desse cenário, propõe-se o desenvolvimento de uma **plataforma digital de apoio à triagem e organização do fluxo hospitalar**, integrada a um **mecanismo inteligente baseado em regras** para sugestão de possíveis condições clínicas, atuando como **ferramenta de apoio à decisão** médica.

O sistema **não substitui** profissionais da saúde; oferece suporte informativo, organizacional e estatístico para melhoria da gestão e do atendimento.

---

## 2. Justificativa

A superlotação nas unidades públicas de saúde é um problema estrutural. Muitos atendimentos poderiam ser melhor organizados se houvesse:

- Digitalização do cadastro e da triagem inicial;
- Organização estruturada do fluxo interno;
- Histórico digital acessível aos profissionais;
- Transparência sobre disponibilidade de medicamentos;
- Apoio inteligente à classificação preliminar de sintomas.

Relevância acadêmica por integrar conceitos de:

- Engenharia de software e arquitetura em camadas;
- Modelagem de banco de dados (documentos relacionais por referência);
- Segurança da informação e controle de acesso;
- IA **simbólica** baseada em regras (sem aprendizado autônomo no escopo);
- Desenvolvimento web full stack;
- LGPD e proteção de dados (como diretriz de desenho; conformidade plena exige processos institucionais fora do escopo de um protótipo).

---

## 3. Objetivo geral

Desenvolver uma plataforma digital web para organização do fluxo hospitalar e apoio à triagem clínica, integrada a um mecanismo inteligente baseado em regras para sugestão de possíveis condições associadas aos sintomas informados.

---

## 4. Objetivos específicos

- Implementar sistema de cadastro digital de pacientes e de usuários por perfil.
- Estruturar organização interna de atendimento hospitalar (unidades, filas, estados do atendimento).
- Permitir acompanhamento do atendimento dentro da unidade.
- Desenvolver módulo de triagem com registro clínico e sinais vitais.
- Implementar mecanismo inteligente de associação sintoma–doença com pontuação determinística.
- Disponibilizar consulta de medicamentos por unidade e gestão de estoque (perfil administrativo).
- Criar dashboard administrativo para indicadores operacionais.
- Garantir autenticação, autorização por nível e boas práticas de segurança em API e cliente.

---

## 5. Descrição do sistema

### 5.1 Visão geral

A plataforma é um **sistema web responsivo** acessível por navegador, com módulos e rotas condicionadas ao **nível de acesso**:

- **Paciente** — cadastro e jornada de pré-atendimento / acompanhamento.
- **Enfermeiro(a) (triagem)** — sintomas, sinais vitais, classificação de risco, observações.
- **Médico(a)** — histórico, análise de sugestões, diagnóstico, prescrições e orientações (conforme evolução do produto).
- **Administrador(a) / gerência** — unidades, medicamentos, dashboard.

O fluxo conceitual prevê **cadastro presencial na unidade** (por exemplo, validação via QR Code) antes de inserção definitiva no fluxo interno; no protótipo, a jornada pode ser exercida com **dados simulados** ou cadastros de teste.

### 5.2 Módulo de cadastro

- Identificação e dados demográficos de contato;
- Alergias e medicamentos em uso (quando aplicável ao modelo de paciente);
- Persistência para reutilização em atendimentos futuros.

### 5.3 Módulo de triagem

A triagem complementa dados clínicos, registra **sinais vitais** (pressão, frequência cardíaca, temperatura, saturação de O₂, etc., conforme modelo), observações e **classificação de risco**.

No repositório, a classificação segue **cinco níveis** compatíveis com uma triagem estruturada (por exemplo, emergência, muito urgente, urgente, pouco urgente, não urgente) — ver [§7](#7-modelo-de-atendimento-no-código).

### 5.4 Módulo clínico (médico)

- Visualização de histórico e do episódio corrente;
- Análise das sugestões do mecanismo de regras;
- Registro de diagnóstico, receita/orientações e solicitação de exames (evolução do escopo funcional).

### 5.5 Consulta de medicamentos

- Disponibilidade por unidade;
- Atualização de estoque pelo painel administrativo;
- Consulta informativa conforme permissões.

### 5.6 Dashboard gerencial

Indicadores como tempo de permanência/fila, volume por classificação de risco, estatísticas agregadas e métricas operacionais (detalhes dependem dos endpoints em `dashboard` e dos componentes em `frontend/src/pages/Dashboard`).

---

## 6. Arquitetura e stack

Arquitetura em **camadas** e responsabilidades separadas:

```text
Navegador (React + Ant Design)
        │  HTTPS / JSON
        ▼
API REST (Express + TypeScript)
        │
        ▼
MongoDB (Mongoose)
```

- **Apresentação** — `frontend/`: rotas em `src/routes`, páginas em `src/pages`, layout autenticado, integração HTTP (Axios).
- **Aplicação** — `backend/src/controllers`, `middlewares`, `repositories`.
- **Persistência** — schemas e models Mongoose; dados de sintomas/doenças carregados por scripts.
- **Segurança** — JWT nas requisições autenticadas; hash de senha com bcrypt.
- **Inteligência (regras)** — base estruturada `disease` + mapa `symptoms` (pesos 0/1); cálculo de compatibilidade previsto no desenho (integração ponta a ponta com todas as telas em evolução — ver [§12](#12-estado-de-implementação-no-repositório)).

---

## 7. Modelo de atendimento no código

O modelo de **atendimento** (`IAttendance` / `AttendanceSchema`) centraliza o fluxo na unidade:

- **Relacionamentos**: paciente, unidade, enfermeiro(a), médico(a), medicamentos vinculados, referência opcional a condição sugerida pela IA (`iaConditionId`).
- **Sinais vitais** embutidos como subdocumento.
- **Histórico de mudanças de status** em `changesHistory`.

**Status possíveis** (ordem lógica do fluxo): a caminho → aguardando triagem → em triagem → triagem concluída → aguardando atendimento → em atendimento → atendimento concluído / concluído / cancelado (valores exatos nos enums em `backend/src/interfaces/IAttendance.ts`).

Fluxo simplificado:

```mermaid
flowchart LR
  A[Entrada / pré-cadastro] --> B[Aguardando triagem]
  B --> C[Triagem]
  C --> D[Aguardando médico]
  D --> E[Atendimento médico]
  E --> F[Concluído]
```

---

## 8. Mecanismo inteligente (regras)

1. O paciente (ou o fluxo de triagem) informa **sintomas** estruturados.
2. O sistema consulta a **base sintoma–doença** (documentos com mapa de sintomas e pesos).
3. Um algoritmo **determinístico** calcula compatibilidade (ex.: pontuação por sobreposição com vetor de sintomas da doença).
4. Retorna as condições com **maior correspondência**, ordenadas para apoio à leitura clínica.

**Não há** aprendizado de máquina nem **diagnóstico automatizado**. Trata-se de **IA simbólica baseada em regras** e dados curados (script de seed no backend).

---

## 9. Requisitos funcionais

1. Cadastro digital de pacientes e gestão de usuários por perfil.
2. Inclusão do paciente no fluxo após validação (presencial no cenário real; simulado no TCC).
3. Registro de sintomas e dados de triagem.
4. Classificação de risco em níveis definidos pelo sistema.
5. Mecanismo de associação sintoma–doença baseado em regras e pontuação.
6. Armazenamento de histórico clínico e de episódios de atendimento.
7. Emissão ou registro de orientações e receitas (escopo de produto; implementação progressiva).
8. Consulta e gestão de medicamentos por unidade.
9. Dashboard administrativo.
10. Controle de acesso por nível de permissão (admin, médico, enfermeiro, paciente).

---

## 10. Requisitos não funcionais

- Interface web responsiva.
- Tempo de resposta da API adequado ao uso em unidade (meta do projeto: ordem de até ~2 s em operações típicas).
- Disponibilidade dependente de implantação; o desenho visa serviço contínuo.
- Proteção de credenciais e dados sensíveis (HTTPS em produção, segredos em variáveis de ambiente, hash de senhas).
- **Backup** e continuidade: responsabilidade da infraestrutura onde o MongoDB for hospedado (não automatizado apenas pelo código do protótipo).
- Autenticação e autorização consistentes.
- Tratamento de dados pessoais e de saúde alinhado à **LGPD** como requisito de produto; documentação legal e DPIA cabem ao contexto institucional real.
- Arquitetura **modular** (rotas, models, páginas) para evolução e testes.

---

## 11. Delimitação do projeto

- Desenvolvimento como **protótipo funcional** com **dados simulados** ou de demonstração, para fins acadêmicos.
- **Sem integração** com bases reais do SUS ou sistemas legados hospitalares.
- **Não substitui** profissionais da saúde.
- **Não realiza** diagnóstico automatizado; exibe **sugestões** com transparência metodológica limitada ao modelo de regras.

---

## 12. Estado de implementação no repositório

Esta secção amarra a visão do documento ao que já existe no código (ponto em abril de 2026; evolui com o repositório).

**Já presente de forma substantiva**

- API Express com rotas de autenticação, usuários, médicos, enfermeiros, pacientes, unidades, medicamentos e dashboard.
- Frontend com áreas: autenticação, dashboard, pacientes, enfermeiros, médicos, unidades, medicamentos, atendimentos, triagens, pré-cadastro (`PreRegistration`), detalhes de atendimento.
- Modelos Mongoose alinhados ao domínio (atendimento com status, risco, vitais, vínculos).
- Base extensa de **doenças × sintomas** para experimentação do mecanismo de regras (seed no backend).

**Em evolução / parcial**

- Algumas telas ainda exibem **dados estáticos** ou mocks enquanto a integração completa com a API é finalizada (ex.: sugestões de condições na UI de detalhes do atendimento podem não refletir ainda o cálculo em tempo real no backend).
- Campos adicionais da triagem (escala de dor, frequência respiratória, etc.) podem ser expandidos além do subdocumento mínimo atual de sinais vitais.

Para lista resumida do que o README declara como implementado, ver seção “Funcionalidades” em [`README.md`](README.md).

---

## 13. Contribuição esperada

- Digitalização conceitual do fluxo hospitalar e fila de atendimento.
- Melhoria organizacional e redução de retrabalho na coleta de informações.
- Transparência sobre medicamentos por unidade.
- Demonstração de **IA simbólica** aplicada à saúde, com limites éticos explícitos.
- Evidência de viabilidade técnica de soluções web para a rede pública (como estudo de caso).

---

## 14. Considerações finais

A proposta integra engenharia de software e inteligência artificial aplicada de forma **responsável**: solução estruturada para apoio à organização e à triagem, com ênfase em segurança, usabilidade e **apoio à decisão**, respeitando limites legais e éticos do uso de tecnologia em saúde.

---

## Contexto acadêmico e autoria

Projeto desenvolvido no contexto de **Trabalho de Conclusão de Curso (TCC)** em **Análise e Desenvolvimento de Sistemas**, conforme descrito no [`README.md`](README.md).

Autores listados no repositório: Jonatas Lima, Matheus Chagas, Rafael Silva, Rafael Vieira, Victor Campos (links no README).

Licença do repositório: **MIT**.
