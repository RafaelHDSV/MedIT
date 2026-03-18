import React, { useState } from 'react';
import './SignUp.scss'; // Use o mesmo arquivo de estilo do SignIn

const SignUp: React.FC = () => {
  // const navigate = useNavigate();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados de cadastro:", formData);
    // Aqui você chamaria sua API de cadastro
  };

  return (
    <div className="signin-container">
      <section className="form-side">
        <div className="content-wrapper">
          <h1 className="logo">Med<span>Flow</span></h1>
          <h2>Crie sua conta</h2>
          <p>Cadastre-se para começar a usar o sistema</p>

          <form onSubmit={handleRegister}>
            <div className="input-block">
              <label htmlFor="nome">Nome completo</label>
              <input type="text" id="nome" value={formData.nome} onChange={handleInputChange} required />
            </div>

            <div className="input-block">
              <label htmlFor="cpf">CPF</label>
              <input type="text" id="cpf" value={formData.cpf} onChange={handleInputChange} required />
            </div>

            <div className="input-block">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="input-block">
              <label htmlFor="senha">Senha</label>
              <input type="password" id="senha" value={formData.senha} onChange={handleInputChange} required />
            </div>

            <button type="submit" className="login-button">Cadastrar</button>
          </form>

          <footer>
            <p>Já possui uma conta? <a onClick={() => 
              // navigate('/')
              {}
              }>Entre</a></p>
          </footer>
        </div>
      </section>

      {/* Lado Direito Visual */}
      <section className="visual-side">
        <div className="visual-content">
          <img src="/SignIn.png" alt="Ilustração MedFlow" />
          <h3>Plataforma de Apoio à Triagem e Fluxo Hospitalar</h3>
        </div>
      </section>
    </div>
  );
};

export default SignUp;