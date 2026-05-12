# MedIT — Good to know

Guia **curto** de funcionalidades, padrões técnicos e dicas para quem desenvolve, opera ou avalia o sistema. Não substitui o [`context.md`](./context.md) (visão de produto, requisitos e mapa detalhado) nem o [`README.md`](../README.md) na raiz (como subir o projeto).

---

## O que é o MedIT (em uma frase)

Plataforma **web** para organizar fluxo, **triagem**, **atendimento**, **dashboard** e **medicamentos por unidade**, com **sugestões por regras** (IA simbólica). **Não** substitui decisão clínica nem diagnostica automaticamente.

---

## Stack e onde mexer

| Área | Onde | Notas |
|------|------|--------|
| UI | `frontend/src/pages`, `frontend/src/components` | React 19, Vite 7, Ant Design 6, Sass |
| Rotas e menu | `frontend/src/routes/` (`constants.ts`, `routes.ts`, `AppRoutes.tsx`) | Prefixo autenticado: `/auth` |
| API cliente | `frontend/src/repositories/` | Estendem `Repository`; Axios em `frontend/src/api/api.ts` |
| API servidor | `backend/src/routes`, `controllers`, `services` | Express 5; prefixo HTTP `/auth` |
| Dados | `backend/src/models`, `schema`, `interfaces` | Mongoose 9 |
| Seeds / scripts | `backend/src/scripts/scripts/*.script.ts` | Menu: `yarn scripts` (raiz ou backend) |

---

## Comandos que todo mundo usa

- **`yarn dev` (raiz)** — instala/atualiza dependências base e sobe **frontend + backend** em paralelo.
- **`yarn test` (raiz)** — `tsc` nos pacotes `frontend` e `backend`.
- **`yarn format` (raiz)** — Prettier em ambos.
- **`yarn scripts` (raiz)** — delega ao backend: menu interativo de scripts (seeds, migrações, etc.).

---

## Variáveis de ambiente (mínimo útil)

- **Frontend:** `VITE_BACKEND_URL` — URL base da API (ex.: `http://localhost:3000`). Usada em `frontend/src/api/api.ts`.
- **Backend:** `MONGO_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT` — ver `backend/src/globals/Config.ts` e `.env` de exemplo no backend, se existir.

Sem `VITE_BACKEND_URL` correta, o cliente pode chamar rotas relativas erradas. Sem Mongo/JWT válidos, a API não sobe de forma útil.

---

## Autenticação e níveis

- **JWT** access + **refresh**; interceptor no Axios renova token em `401` e refaz a requisição (ver `frontend/src/api/api.ts`).
- Perfis principais: **paciente**, **enfermeiro**, **médico**, **administrador de unidade**, **MedIT** (`UserLevels` no código). Regras de menu e de API divergem por nível (ex.: MedIT não segue o fluxo de medicamentos como unidade operacional — ver `MedicationsPageGate` e `context.md` §5.7).

---

## Rotas no front: “duas entradas, um destino” (de propósito)

É **intencional** ter constantes diferentes em `ROUTES` com o **mesmo path** ou a **mesma página** em URLs distintas, para variar **título, descrição, visibilidade no menu e níveis** sem duplicar implementação.

- Exemplo **mesmo path:** `UNITS` e `PARTNERS_UNITS` → `/auth/units`.
- Exemplo **paths diferentes, mesma tela:** `ATTENDANCE_DETAILS` e `TRIAGES_DETAILS` → mesma página `AttendanceDetails`.

Detalhe: [`context.md` §6.1.1](./context.md#611-rotas-no-cliente-mesmo-path-ou-mesma-página-com-metadados-distintos).

---

## Filas, claim e release (resumo)

- **Claim** ao **iniciar** triagem ou atendimento a partir da **fila do dashboard** (antes de abrir o detalhe), reduzindo disputa por dupla captura.
- **Release** ao **sair** do detalhe com caso ainda “em posse”, com confirmação na UI quando aplicável.

Narrativa completa e notas de API: [`context.md` §5.9](./context.md#59-jornada-do-paciente-pré-atendimento-remoto-chegada-e-filas) e §12 (estado de implementação).

---

## Dashboard, período e fuso

- Filtros de **período** e **data de referência** no dashboard; agregações e filas (conforme perfil) usam regras documentadas em **`context.md` §5.6**.
- “Hoje” e janelas civis alinhadas a **`America/Sao_Paulo`** onde o código explicita esse fuso (ex.: gráficos e seeds).

---

## Dados clínicos e seeds

- Base **sintoma–doença** na coleção **`SymptomsDisease`**; script de carga: `backend/src/scripts/scripts/createSymptomsDiseases.script.ts`.
- Seeds de atendimentos e regras de volume: ver **[`createAttendances.md`](./createAttendances.md)** (pasta `docs/`) e **`context.md` §5.10**.
- Modelo de entidades no banco: **[`modelagem-banco-de-dados.md`](./modelagem-banco-de-dados.md)**.

---

## Boas práticas para contribuir

- Manter **alinhamento** entre enum/status no **backend** e **frontend** (`interfaces` espelhadas).
- Erros de API: padrão tratado em **`frontend/src/helpers/handleApiError.ts`** (mensagens ao utilizador).
- Issues e propostas locais: pasta **`.issues/`** no repositório (alguns espelhos em **`.issues/github/`**).

---

## Onde aprofundar

| Documento | Conteúdo |
|-----------|-----------|
| [`context.md`](./context.md) | Visão do produto, fluxos, API, arquitetura, estado de implementação |
| [`modelagem-banco-de-dados.md`](./modelagem-banco-de-dados.md) | Tabelas/coleções e campos |
| [`createAttendances.md`](./createAttendances.md) | Especificação do seed de atendimentos |
| [`README.md`](../README.md) | Como instalar e executar |

---

*Última revisão orientada ao repositório atual; evolua este ficheiro quando surgirem convenções novas que valham para toda a equipa.*
