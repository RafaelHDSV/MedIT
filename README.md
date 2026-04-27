![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![GitHub language count](https://img.shields.io/github/languages/count/RafaelHDSV/MedIT?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/RafaelHDSV/MedIT?style=for-the-badge)

# MedIT

Plataforma web de apoio a triagem e organizacao do fluxo hospitalar, com sugestoes clinicas baseadas em regras.

> Este README traz uma visao rapida para uso do projeto.  
> Para documentacao completa de produto, arquitetura, fluxos e regras de negocio, consulte o [`context.md`](./context.md).

## Visao geral

O **MedIT** foi desenvolvido no contexto de TCC para apoiar unidades de saude em:

- organizar filas e fluxo de atendimento;
- registrar triagem e historico de atendimentos;
- acompanhar indicadores em dashboard;
- consultar disponibilidade de medicamentos por unidade;
- oferecer sugestoes por regras (IA simbolica) como apoio ao profissional.

O sistema **nao substitui profissionais de saude** e **nao realiza diagnostico automatico**.

## Principais modulos

- **Paciente:** pre-atendimento, acompanhamento da jornada e consulta de informacoes do atendimento.
- **Enfermagem:** triagem, sinais vitais, classificacao de risco e encaminhamento para atendimento medico.
- **Medico:** atendimento clinico, consulta de historico, sugestoes e conclusao do caso.
- **Administrador de unidade:** dashboard operacional, gestao de usuarios e medicamentos da propria unidade.

## Stack tecnica

- **Frontend:** React 19, Vite 7, TypeScript, Ant Design, Sass, React Router, Axios.
- **Backend:** Node.js, Express 5, TypeScript.
- **Banco de dados:** MongoDB com Mongoose.
- **Seguranca:** JWT (access/refresh) e bcrypt.

## Estrutura do repositorio

```text
medit/
  backend/
  frontend/
  context.md
  README.md
```

## Pre-requisitos

- Node.js 18+
- Yarn
- MongoDB

## Como executar

Comandos na raiz do projeto:

```bash
yarn
yarn dev
```

Esse fluxo sobe frontend e backend em paralelo.

### Execucao separada (opcional)

Backend:

```bash
cd backend
yarn
yarn dev
```

Frontend (em outro terminal):

```bash
cd frontend
yarn
yarn dev
```

## Variaveis de ambiente

1. Crie os arquivos `.env` no `backend` e no `frontend` com base nos respectivos `.env.example`.
2. Ajuste principalmente:
   - backend: conexao MongoDB e segredos JWT;
   - frontend: URL da API (`VITE_BACKEND_URL`).

## Scripts uteis

Na raiz:

- `yarn dev`: instala dependencias base e sobe frontend + backend;
- `yarn test`: validacao de tipos nos pacotes;
- `yarn format`: formatacao com Prettier;
- `yarn scripts`: abre o runner de scripts do backend (seeds e utilitarios).

Para detalhes de cada seed/fluxo, use o [`context.md`](./context.md) e a pasta `backend/src/scripts/`.

## Limites e escopo

- projeto academico/prototipo funcional;
- dados de demonstracao em parte do fluxo;
- sem integracao oficial com sistemas SUS;
- foco em apoio a decisao e organizacao operacional.

## Contribuicao e conduta

- Guia de contribuicao: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Codigo de conduta: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)

## Licenca

Este projeto esta sob licenca MIT.

## Autores

- Jonatas Lima - [github.com/jonataslimaads-byte](https://github.com/jonataslimaads-byte)
- Matheus Chagas - [github.com/MatheusTakenaka](https://github.com/MatheusTakenaka)
- Rafael Silva - [github.com/Rafasouza03](https://github.com/Rafasouza03)
- Rafael Vieira - [github.com/RafaelHDSV](https://github.com/RafaelHDSV)
- Victor Campos - [github.com/Gil015](https://github.com/Gil015)
