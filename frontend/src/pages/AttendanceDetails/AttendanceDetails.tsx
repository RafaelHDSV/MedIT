import { AttendanceRisk } from "@/interfaces/IAttendance";
import { UserLevels } from "@/interfaces/IUser";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import AuthLayoutHeader from "@/components/AuthLayoutHeader/AuthLayoutHeader";
import Button from "@/components/Button/Button";
import DetailsLine from "@/components/DetailsLine/DetailsLine";
import RiskTag from "@/components/RiskTag/RiskTag";
import SymptomTag from "@/components/SymptomTag/SymptomTag";
import styles from "./AttendanceDetails.module.scss";

function VitalCard({ value, label, suffix, onChange }: {
  value: string | number;
  label: string;
  suffix?: string;
  onChange?: (value: string) => void;
}) {
  const { user } = useAuth();
  const isNurse = user?.level === UserLevels.NURSE;
  const [inputValue, setInputValue] = useState(String(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className={styles.vitalCard}>
      {isNurse ? (
        <input
          className={styles.vitalInput}
          value={inputValue}
          onChange={handleChange}
          placeholder="0"
        />
      ) : (
        <span className={styles.vitalValue}>{value}{suffix}</span>
      )}
      <span className={styles.vitalLabel}>{label}</span>
    </div>
  );
}

function CondicaoCard({ nome, compatibilidade }: { nome: string; compatibilidade: number }) {
  return (
    <div className={styles.condicaoItem}>
      <p className={styles.condicaoNome}>{nome}</p>
      <div className={styles.barBg}>
        <div className={styles.barFill} style={{ width: `${compatibilidade}%` }} />
      </div>
      <span className={styles.barPct}>{compatibilidade}% compatibilidade</span>
    </div>
  );
}

function AttendanceDetails() {
  const { user } = useAuth();
  const isNurse = user?.level === UserLevels.NURSE;

  const patient = {
    name: "Rafael Silva",
    age: 20,
    gender: "Masculino",
    allergies: "Dipirona",
    mainComplaint: "Náusea",
    arrivalTime: "23:41",
    risk: AttendanceRisk.URGENT,
    conditions: "Hipertensão",
  };

  const vitalSigns = {
    temperature: 37.8,
    bloodPressure: "130/85",
    respiratoryRate: 18,
    heartRate: 88,
    oxygenSaturation: 96,
    painScale: 7,
  };

  const symptoms = ["Febre", "Dor de cabeça", "Dor no corpo", "Fadiga", "Calafrios"];
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleToggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const suggestedConditions = [
    { name: "Dengue", compatibility: 87 },
    { name: "Gripe (Influenza)", compatibility: 72 },
    { name: "COVID-19", compatibility: 58 },
    { name: "Chikungunya", compatibility: 41 },
    { name: "Catapora", compatibility: 21 },
    { name: "Caxumba", compatibility: 11 },
  ];

  return (
    <>
      <AuthLayoutHeader
        actionComponent={
          <Button>Finalizar atendimento</Button>
        }
      />

      <div className={styles.page}>

        <div className={styles.left}>
          <section>
            <div className={styles.card}>
              <div className={styles.infoGrid}>
                <div className={styles.infoColLeft}>
                  <div className={styles.detailsLineWrapper}>
                    <DetailsLine label="Nome" value={patient.name} />
                  </div>
                  <div className={styles.detailsLineWrapper}>
                    <DetailsLine label="Idade" value={`${patient.age} anos`} />
                  </div>
                  <div className={styles.detailsLineWrapper}>
                    <DetailsLine label="Sexo" value={patient.gender} />
                  </div>
                  <div className={`${styles.detailsLineWrapper} ${styles.last}`}>
                    <DetailsLine label="Alergias" value={patient.allergies} />
                  </div>
                </div>
                <div className={styles.infoColRight}>
                  <div className={styles.detailsLineWrapper}>
                    <DetailsLine label="Queixa principal" value={patient.mainComplaint} />
                  </div>
                  <div className={styles.detailsLineWrapper}>
                    <DetailsLine label="Chegada" value={patient.arrivalTime} />
                  </div>
                  <div className={styles.detailsLineWrapper}>
                    <DetailsLine label="Risco" value={<RiskTag risk={patient.risk} />} />
                  </div>
                  <div className={`${styles.detailsLineWrapper} ${styles.last}`}>
                    <DetailsLine label="Condições" value={patient.conditions} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className={styles.sectionTitle}>Sinais Vitais</p>
            <div className={styles.vitaisGrid}>
              <VitalCard label="Temperatura" value={vitalSigns.temperature} suffix="°" />
              <VitalCard label="Pressão Arterial" value={vitalSigns.bloodPressure} />
              <VitalCard label="Freq. Respiratória" value={vitalSigns.respiratoryRate} suffix=" irpm" />
              <VitalCard label="Fre. Cardíaca" value={vitalSigns.heartRate} suffix=" bpm" />
              <VitalCard label="Saturação O2" value={vitalSigns.oxygenSaturation} suffix="%" />
              <VitalCard label="Escala de Dor" value={vitalSigns.painScale} suffix="/10" />
            </div>
          </section>

          <section>
            <p className={styles.sectionTitle}>Sintomas Relatados</p>
            <div className={styles.sintomas}>
              {symptoms.map((symptom) => (
                <SymptomTag
                  key={symptom}
                  symptom={symptom}
                  clickable={isNurse}
                  selected={selectedSymptoms.includes(symptom)}
                  onClick={() => handleToggleSymptom(symptom)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className={styles.sidebar}>
          <p className={styles.sidebarTitle}>Condições sugeridas</p>
          {suggestedConditions.map((condition) => (
            <CondicaoCard key={condition.name} nome={condition.name} compatibilidade={condition.compatibility} />
          ))}
        </div>

      </div>
    </>
  );
}

export default AttendanceDetails;