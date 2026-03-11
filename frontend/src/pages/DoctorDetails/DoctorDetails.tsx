interface Doctor {
  nome: string
  idade: number
  genero: string
  status: string

  cpf: string
  crm: string
  especialidade: string
  telefone: string
  dataNascimento: string
}

const doctor: Doctor = {
  nome: 'Fernando Luís',
  idade: 58,
  genero: 'Masculino',
  status: 'Em plantão',

  cpf: '328.189.110-10',
  crm: '117101',
  especialidade: 'Pediatria',
  telefone: '(15) 99999-1234',
  dataNascimento: '15/09/1968'
}

function DoctorDetails() {
  return (
    <main>
      <header>
        <h2>Médico</h2>
        <section>
          <h3>Dados Pessoais</h3>

          <div>
            <span>CPF</span>
            <span>{doctor.cpf}</span>
          </div>

          <div>
            <span>CRM</span>
            <span>{doctor.crm}</span>
          </div>

          <div>
            <span>Especialidade</span>
            <span>{doctor.especialidade}</span>
          </div>

          <div>
            <span>Telefone</span>
            <span>{doctor.telefone}</span>
          </div>

          <div>
            <span>Data de Nascimento</span>
            <span>{doctor.dataNascimento}</span>
          </div>
        </section>
      </header>
    </main>
  )
}

export default DoctorDetails
