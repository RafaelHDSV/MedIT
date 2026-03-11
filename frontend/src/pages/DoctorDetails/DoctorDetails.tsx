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
        <div>
          <div>
            <span>FL</span>
          </div>

          <div>
            <h3>{doctor.nome}</h3>
            <p>
              {doctor.idade} anos | {doctor.genero}
            </p>
          </div>
          <div>
            <span>{doctor.status}</span>
          </div>
        </div>
        <div>
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
          <section>
            <section>
              <h3>Último Atendimento</h3>

              <div>
                <span>Queixa do Paciente</span>
                <span>Febre e dores</span>
              </div>
              <div>
                <span>Sugestão IA</span>
                <span>Dengue (87%)</span>
              </div>
              <div>
                <span>Definição Médica</span>
                <span>Dengue</span>
              </div>
              <div>
                <span>Tempo de atendimento</span>
                <span>20 min</span>
              </div>
              <div>
                <span>Data</span>
                <span>12/01/2025</span>
              </div>
            </section>
          </section>
        </div>
      </header>
    </main>
  )
}

export default DoctorDetails
