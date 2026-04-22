const DISEASE_LABELS_PT: Record<string, string> = {
  Sinusitis: 'Sinusite',
  'Heart Failure': 'Insuficiência cardíaca',
  'Hepatitis A': 'Hepatite A',
  'Ulcerative Colitis': 'Colite ulcerativa',
  Migraine: 'Enxaqueca',
  "Alzheimer's Disease": 'Doença de Alzheimer',
  'Urinary Tract Infection (UTI)': 'Infecção urinária',
  'Systemic Lupus Erythematosus': 'Lúpus eritematoso sistêmico',
  Toxoplasmosis: 'Toxoplasmose',
  'Atopic Dermatitis (Eczema)': 'Eczema atópico',
  'Ankle Sprain': 'Entorse de tornozelo',
  'Head Injury/Traumatic Brain Injury': 'Lesão craniana traumática',
  Influenza: 'Gripe',
  'COVID-19': 'COVID-19',
  Pneumonia: 'Pneumonia',
  'Acute Bronchitis': 'Bronquite aguda',
  'Chronic Bronchitis (COPD)': 'Bronquite crônica',
  Tuberculosis: 'Tuberculose',
  Hypertension: 'Hipertensão',
  'Deep Vein Thrombosis': 'Trombose venosa profunda',
  'Peptic Ulcer': 'Úlcera péptica',
  'Hepatitis B': 'Hepatite B',
  Hypothyroidism: 'Hipotireoidismo',
  Hyperthyroidism: 'Hipertireoidismo',
  'Typhoid Fever': 'Febre tifoide',
  Sepsis: 'Sepse',
  Conjunctivitis: 'Conjuntivite',
  'Polycystic Ovary Syndrome (PCOS)': 'Síndrome do ovário policístico',
  Preeclampsia: 'Pré-eclâmpsia',
  'Bone Fracture': 'Fratura óssea',
  Asthma: 'Asma',
  Gastroenteritis: 'Gastroenterite',
  Pyelonephritis: 'Pielonefrite',
  Fibromyalgia: 'Fibromialgia',
  'Shingles (Herpes Zoster)': 'Herpes zoster',
  Erysipelas: 'Erisipela',
  Anaphylaxis: 'Anafilaxia',
  'Food Poisoning': 'Intoxicação alimentar',
  'Acute Myocardial Infarction': 'Infarto agudo do miocárdio',
  'Pulmonary Embolism': 'Embolia pulmonar',
  "Crohn's Disease": 'Doença de Crohn',
  'Cholecystitis (Gallstones)': 'Colecistite',
  Meningitis: 'Meningite',
  Epilepsy: 'Epilepsia',
  'Vertigo (Labyrinthitis)': 'Vertigem (labirintite)',
  'Type 1 Diabetes 2': 'Diabetes tipo 1',
  Malaria: 'Malária',
  Leptospirosis: 'Leptospirose',
  Chikungunya: 'Chikungunya',
  Measles: 'Sarampo',
  'Sickle Cell Anemia (crisis)': 'Anemia falciforme (crise)',
  'Hemophilia (bleeding episode)': 'Hemofilia (episódio de sangramento)',
  "Adrenal Insufficiency (Addison's Disease)":
    'Insuficiência adrenal (Doença de Addison)',
  'Cardiac Arrhythmia': 'Arritmia cardíaca',
  Appendicitis: 'Apendicite',
  Gout: 'Gota',
  Osteoarthritis: 'Osteoartrite',
  'Dengue Fever': 'Dengue',
  'Chickenpox (Varicella)': 'Varicela',
  Psoriasis: 'Psoríase',
  'Leukemia (acute phase)': 'Leucemia (fase aguda)',
  Glaucoma: 'Glaucoma',
  Endometriosis: 'Endometriose',
  'Heatstroke (Coup de Chaleur)': 'Insolação',
  'Kidney Stones (Nephrolithiasis)': 'Cálculo renal',
  'Rheumatoid Arthritis': 'Artrite reumatoide',
  Tendinitis: 'Tendinite',
  Urticaria: 'Urticária',
  'Infectious Cellulitis': 'Celulite infecciosa',
  Lymphoma: 'Linfoma',
  'Panic Disorder': 'Transtorno de pânico',
  'Allergic Rhinitis': 'Rinite alérgica',
  "Cushing's Syndrome": 'Síndrome de Cushing',
  'Stroke (Cerebrovascular Accident)': 'Acidente vascular cerebral',
  'Liver Cirrhosis': 'Cirrose hepática',
  "Parkinson's Disease": 'Doença de Parkinson',
  'Zika Virus': 'Vírus Zika',
  Mumps: 'Caxumba',
  'Otitis Media': 'Otite média',
  'Severe Dehydration': 'Desidratação grave',
  'Common Cold': 'Resfriado comum',
  Pharyngitis: 'Faringite',
  Pericarditis: 'Pericardite',
  Pancreatitis: 'Pancreatite',
  'Multiple Sclerosis': 'Esclerose múltipla',
  'Chronic Kidney Failure': 'Insuficiência renal crônica',
  'Herniated Disc': 'Hérnia de disco',
  'HIV/AIDS (acute phase)': 'HIV/AIDS (fase aguda)',
  Mononucleosis: 'Mononucleose',
  'Anxiety Disorder Generalized': 'Transtorno de ansiedade generalizada',
  Tonsillitis: 'Amigdalite',
  'Iron Deficiency Anemia': 'Anemia ferropriva'
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const PT_TO_EN_NORMALIZED: Record<string, string> = Object.entries(
  DISEASE_LABELS_PT
).reduce(
  (acc, [en, pt]) => {
    acc[normalize(pt)] = en
    return acc
  },
  {} as Record<string, string>
)

export function toDiseaseLabelPt(value: string): string {
  return DISEASE_LABELS_PT[value] ?? value
}

export function toCanonicalDiseaseKey(value: string): string {
  const normalized = normalize(value)
  if (PT_TO_EN_NORMALIZED[normalized]) return PT_TO_EN_NORMALIZED[normalized]

  const fromEn = Object.keys(DISEASE_LABELS_PT).find(
    (k) => normalize(k) === normalized
  )
  if (fromEn) return fromEn

  return normalized
}

