import './ModalConfiguracoes.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    nome: string;
    cpf: string;
    sexo: string;
    nascimento: string;
  };
}

export const ModalConfiguracoes = ({ isOpen, onClose, userData }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Configurações</h3>
        
        <div className="info-section">
          <p><strong>Informações básicas</strong></p>
          <div className="info-field"><span>Nome</span> <span>{userData.nome}</span></div>
          <div className="info-field"><span>CPF</span> <span>{userData.cpf}</span></div>
          <div className="info-field"><span>Sexo</span> <span>{userData.sexo}</span></div>
          <div className="info-field"><span>Data de Nascimento</span> <span>{userData.nascimento}</span></div>
        </div>

        <button className="btn-delete" onClick={() => console.log("Ação de deletar")}>
          Deletar conta
        </button>
      </div>
    </div>
  );
};