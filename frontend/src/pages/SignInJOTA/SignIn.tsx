import React from 'react';
import './SignIn.scss';

interface SignInProps {
  onLoginSuccess?: () => void;
}

const SignIn: React.FC<SignInProps> = () => {
  // const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Apenas loga no console, não muda de tela
    console.log("Tentativa de login processada.");
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // navigate('/signup');
  };

  return (
    <div className="signin-container">
      <section className="form-side">
        <div className="content-wrapper">
          <header>
            <h1 className="logo">Med<span>Flow</span></h1>
          </header>

          <main>
            <h2>Bem-vindo de volta</h2>
            <p>Acesse sua conta para continuar</p> 

            <form onSubmit={handleSubmit}>
              <div className="input-block">
                <label htmlFor="user">CPF ou Email</label>
                <input type="text" id="user" required />
              </div>

              <div className="input-block">
                <label htmlFor="password">Senha</label>
                <input type="password" id="password" required />
              </div>

              <button type="submit" className="login-button">
                Entrar
              </button>
            </form>
          </main>

          <footer>
            <p>
              Ainda não possui uma conta?{' '}
              <a href="/signup" onClick={handleSignUpClick}>
                Cadastrar-se
              </a>
            </p>
          </footer>
        </div>
      </section>

      <section className="visual-side">
        <div className="visual-content">
          <img src="/SignIn.png" alt="Ilustração MedFlow" />
          <h3>Plataforma de Apoio à Triagem e Fluxo Hospitalar</h3>
        </div>
      </section>
    </div>
  );
};

export default SignIn;