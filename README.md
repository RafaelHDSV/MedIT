# 🏥 MedIT

Plataforma Digital de Apoio à Triagem e Organização do Fluxo Hospitalar com Mecanismo Inteligente Baseado em Regras.

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![GitHub language count](https://img.shields.io/github/languages/count/RafaelHDSV/MedIT?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/RafaelHDSV/MedIT?style=for-the-badge)

---

# 📌 Sobre o Projeto

O **MedIT** é uma plataforma web desenvolvida como Trabalho de Conclusão de Curso (TCC) com o objetivo de **apoiar a organização do fluxo hospitalar e auxiliar o processo de triagem clínica** em unidades de saúde.

A proposta do sistema é oferecer **uma solução digital para melhorar a organização do atendimento**, reduzir gargalos operacionais e fornecer **suporte informacional aos profissionais de saúde**.

O sistema **não substitui profissionais da saúde**, nem realiza diagnóstico automatizado. Ele atua apenas como **ferramenta de apoio à decisão**, utilizando um mecanismo de inferência baseado em regras para sugerir possíveis associações entre sintomas e condições clínicas.

---

# 🎯 Objetivo

Desenvolver uma plataforma digital que permita:

* Organização do fluxo de atendimento hospitalar
* Registro estruturado de triagem clínica
* Histórico digital de pacientes
* Consulta de medicamentos disponíveis
* Dashboard gerencial com indicadores operacionais
* Sistema de apoio inteligente baseado em regras

---

# 🧠 Funcionamento do Mecanismo Inteligente

O sistema utiliza **Inteligência Artificial simbólica baseada em regras determinísticas**.

Fluxo de funcionamento:

1. O paciente informa sintomas durante a triagem.
2. O sistema consulta uma base estruturada de sintomas e doenças.
3. Um algoritmo calcula a compatibilidade entre os sintomas informados.
4. O sistema retorna as condições com maior correspondência.

⚠️ Importante:

* Não existe aprendizado de máquina.
* Não há diagnóstico automático.
* As sugestões servem apenas como **apoio informativo ao profissional de saúde**.

---

# 👥 Perfis de Usuário

O sistema possui diferentes níveis de acesso:

### Paciente

* Cadastro de dados
* Consulta de atendimento
* Acesso a orientações médicas

### Enfermeira (Triagem)

* Registro de sintomas
* Inserção de sinais vitais
* Classificação de risco

### Médico

* Acesso ao histórico do paciente
* Registro de diagnóstico
* Emissão de orientações e receitas

### Administrador / Gerente

* Gestão do sistema
* Controle de estoque de medicamentos
* Dashboard estatístico

---

# 🏗 Arquitetura do Sistema

O sistema foi desenvolvido utilizando **arquitetura em camadas**:

```
Frontend (Interface do Usuário)
        │
        ▼
Backend (API e Regras de Negócio)
        │
        ▼
Banco de Dados (Persistência)
```

Camadas principais:

* **Apresentação** → Interface web
* **Aplicação** → Regras de negócio
* **Persistência** → Banco de dados
* **Segurança** → Autenticação e autorização
* **Mecanismo de Inferência** → Associação sintoma-doença

---

# 🧩 Tecnologias Utilizadas

## Frontend

* React
* TypeScript
* Vite
* Ant Design
* React Router
* Axios
* Sass

## Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose
* JWT (autenticação)
* Bcrypt (criptografia de senha)

---

# 📂 Estrutura do Projeto

```
medit
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── types
│   │   ├── utils
│   │   └── server
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── contexts
│   │   ├── hooks
│   │   ├── interfaces
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   ├── styles
│   │   └── utils
│
└── README.md
```

---

# ⚙️ Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js 18+
* Yarn
* MongoDB
* Git

---

# 🚀 Como Executar o Projeto

## 1️⃣ Clonar o repositório

```
git clone https://github.com/RafaelHDSV/MedIT.git
```

```
cd medit
```

---

# 🔧 Configuração do Backend

## Acessar a pasta do backend

```
cd backend
```

## Instalar dependências

```
yarn
```

## Criar arquivo de ambiente

Copie o arquivo `.env.example`:

```
cp .env.example .env
```

## Executar o servidor

```
yarn dev
```

O backend será iniciado em:

```
http://localhost:3693
```

---

# 💻 Configuração do Frontend

Abra um novo terminal.

## Acessar pasta do frontend

```
cd frontend
```

## Instalar dependências

```
yarn
```

## Criar arquivo de ambiente

Copie o exemplo:

```
cp .env.example .env
```

## Executar aplicação

```
yarn dev
```

A aplicação será executada em:

```
http://localhost:3333
```

---

# 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação.

Fluxo:

1. Usuário realiza login
2. Backend gera um token JWT
3. Token é enviado ao frontend
4. Token é utilizado para acessar rotas protegidas

---

# 📊 Funcionalidades Implementadas

✔ Cadastro de usuários
✔ Autenticação com JWT
✔ Proteção de rotas
✔ Estrutura de layout administrativo
✔ Sistema de contexto de autenticação
✔ Organização modular de rotas
✔ Integração frontend com API

---

# 🔒 Segurança

O projeto aplica algumas práticas básicas de segurança:

* Hash de senhas com bcrypt
* Autenticação via JWT
* Validação de dados no backend
* Uso de variáveis de ambiente
* Separação de responsabilidades na arquitetura

---

# 📚 Contexto Acadêmico

Este projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** no curso de **Análise e Desenvolvimento de Sistemas**.

O objetivo acadêmico é demonstrar a aplicação prática de conceitos de:

* Engenharia de Software
* Arquitetura de Sistemas
* Segurança da Informação
* Modelagem de Banco de Dados
* Inteligência Artificial baseada em regras
* Desenvolvimento Web Full Stack

---

# ⚠️ Limitações do Projeto

* O sistema utiliza **dados simulados**
* Não possui integração com o SUS
* Não substitui diagnóstico médico
* Desenvolvido apenas para fins acadêmicos

---

# 📜 Licença

Este projeto está sob a licença MIT.

---

# 👨‍💻 Autor

- Jonatas Lima - https://github.com/jonataslimaads-byte
- Matheus Chagas - https://github.com/MatheusTakenaka
- Rafael Silva - https://github.com/Rafasouza03
- Rafael Vieira - https://github.com/RafaelHDSV
- Victor Campos - https://github.com/Gil015
