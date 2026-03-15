import './DoctorDetails.scss'
import { CalendarDots } from '@phosphor-icons/react'
import { ChartBar } from '@phosphor-icons/react'
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
interface Atendimento {
  data: string
  tipo: string
  descricao: string
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
  const historico: Atendimento[] = [
    { data: '12/01/2025', tipo: 'Consulta', descricao: 'Gripe' },
    { data: '08/11/2024', tipo: 'Emergência', descricao: 'Entorse' },
    { data: '15/06/2024', tipo: 'Rotina', descricao: 'Check-up' },
    { data: '22/03/2024', tipo: 'Consulta', descricao: 'Alergia' }
  ]

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
            <p className='doctor-info'>
              <span className='idade'>{doctor.idade} anos</span>
              <span className='separador'>|</span>
              <span className='genero'>{doctor.genero}</span>
            </p>
          </div>

          <div className='status'>
            <span>{doctor.status}</span>
          </div>
        </div>
      </header>

      <div className='cards'>
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
          <h3>
            <CalendarDots size={25} />
            Último Atendimento
          </h3>

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
            <span>Dengue✅</span>
          </div>

          <div>
            <span>Tempo de Atendimento</span>
            <span>20 min</span>
          </div>

          <div>
            <span>Data</span>
            <span>12/01/2025</span>
          </div>
        </section>

        <section className='historicoDeAtendimentos'>
          <h3>
            <ChartBar size={25} />
            Histórico de Atendimentos
          </h3>
          <ul>
            {historico.map((item, index) => (
              <li key={index}>
                <span>{item.data}</span>
                <span>
                  {item.tipo} - {item.descricao}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default DoctorDetails
