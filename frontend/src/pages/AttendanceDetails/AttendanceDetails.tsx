import React from "react";
import styles from "./AttendanceDetails.module.scss";
import Button from "@/components/Button/Button";

function BadgeRisco({ risco }: { risco: string }) {
  const mod = risco === "Baixo" ? styles.baixo : risco === "Alto" ? styles.alto : styles.medio;
  return <span className={`${styles.badgeRisco} ${mod}`}>{risco}</span>;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{children}</span>
    </div>
  );
}

function VitalCard({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.vitalCard}>
      <span className={styles.vitalValue}>{value}</span>
      <span className={styles.vitalLabel}>{label}</span>
    </div>
  );
}

function BarCompatibilidade({ pct }: { pct: number }) {
  return (
    <div>
      <div className={styles.barBg}>
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.barPct}>{pct}% compatibilidade</span>
    </div>
  );
}

function AttendanceDetails() {
  const paciente = {
    nome: "Rafael Silva", idade: 20, sexo: "Masculino", alergias: "Dipirona",
    queixaPrincipal: "Náusea", chegada: "23:41", risco: "Médio", condicoes: "Hipertensão",
  };
  const sinaisVitais = {
    temperatura: "37.8°", pressaoArterial: "130/85", freqRespiratoria: "18 irpm",
    freqCardiaca: "88 bpm", saturacaoO2: "96%", escalaDor: "7/10",
  };
  const sintomas = ["Febre", "Dor de cabeça", "Dor no corpo", "Fadiga", "Calafrios"];
  const condicoesSugeridas = [
    { nome: "Dengue", compatibilidade: 87 },
    { nome: "Gripe (Influenza)", compatibilidade: 72 },
    { nome: "COVID-19", compatibilidade: 58 },
    { nome: "Chikungunya", compatibilidade: 41 },
    { nome: "Catapora", compatibilidade: 21 },
    { nome: "Caxumba", compatibilidade: 11 },
  ];

  return (
  <div className={styles.page}>

    <div className={styles.header}>
      <h1 className={styles.title}>Atendimento</h1>
      <Button className={styles.btnFinalizar}>Finalizar atendimento</Button>
    </div>

    <div className={styles.left}>
      <section>
        <p className={styles.sectionTitle}>Informações do Paciente</p>
        <div className={styles.card}>
          <div className={styles.infoGrid}>
            <div className={styles.infoColLeft}>
              <InfoRow label="Nome">{paciente.nome}</InfoRow>
              <InfoRow label="Idade">{paciente.idade} anos</InfoRow>
              <InfoRow label="Sexo">{paciente.sexo}</InfoRow>
              <InfoRow label="Alergias">{paciente.alergias}</InfoRow>
            </div>
            <div className={styles.infoColRight}>
              <InfoRow label="Queixa principal">{paciente.queixaPrincipal}</InfoRow>
              <InfoRow label="Chegada">{paciente.chegada}</InfoRow>
              <InfoRow label="Risco"><BadgeRisco risco={paciente.risco} /></InfoRow>
              <InfoRow label="Condições">{paciente.condicoes}</InfoRow>
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className={styles.sectionTitle}>Sinais Vitais</p>
        <div className={styles.vitaisGrid}>
          <VitalCard value={sinaisVitais.temperatura} label="Temperatura" />
          <VitalCard value={sinaisVitais.pressaoArterial} label="Pressão Arterial" />
          <VitalCard value={sinaisVitais.freqRespiratoria} label="Freq. Respiratória" />
          <VitalCard value={sinaisVitais.freqCardiaca} label="Fre. Cardíaca" />
          <VitalCard value={sinaisVitais.saturacaoO2} label="Saturação O2" />
          <VitalCard value={sinaisVitais.escalaDor} label="Escala de Dor" />
        </div>
      </section>

      <section>
        <p className={styles.sectionTitle}>Sintomas Relatados</p>
        <div className={styles.sintomas}>
          {sintomas.map((s) => (
            <span key={s} className={styles.sintomaTag}>{s}</span>
          ))}
        </div>
      </section>
    </div>

    <div className={styles.sidebar}>
      <p className={styles.sidebarTitle}>Condições sugeridas</p>
      {condicoesSugeridas.map((c) => (
        <div key={c.nome} className={styles.condicaoItem}>
          <p className={styles.condicaoNome}>{c.nome}</p>
          <BarCompatibilidade pct={c.compatibilidade} />
        </div>
      ))}
    </div>

  </div>
  );
}

export default AttendanceDetails
