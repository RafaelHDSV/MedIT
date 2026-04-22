export interface ISymptomOption {
  key: string
  label: string
}

export interface IDiseaseOption {
  key: string
  label: string
}

export interface ISuggestedDiseases {
  disease: string
  compatibility: number
}

export interface ISuggestedDiseasesPayload {
  suggestions: ISuggestedDiseases[]
  normalizedSymptomKeys: string[]
  reportedSymptoms: string[]
}

export interface ISuggestionDetails extends ISuggestedDiseases {
  reportedSymptomKeys: string[]
  referenceSymptomKeys: string[]
  matchedReferenceCount: number
  referenceSymptomCount: number
  medications: string[]
  exams: string[]
}

export const DISEASES_CHIPS: readonly { key: string; label: string }[] = [
  { key: 'Sinusitis', label: 'Sinusite' },
  { key: 'Heart Failure', label: 'Insuficiência cardíaca' },
  { key: 'Hepatitis A', label: 'Hepatite A' },
  { key: 'Ulcerative Colitis', label: 'Colite ulcerativa' },
  { key: 'Migraine', label: 'Migra' },
  { key: "Alzheimer's Disease", label: 'Doença de Alzheimer' },
  { key: 'Urinary Tract Infection (UTI)', label: 'Infeção urinária' },
  {
    key: 'Systemic Lupus Erythematosus',
    label: 'Síndrome da Lupus eritematoso sistêmico'
  },
  { key: 'Toxoplasmosis', label: 'Toxoplasmose' },
  { key: 'Atopic Dermatitis (Eczema)', label: 'Eczema atópico' },
  { key: 'Ankle Sprain', label: 'Espraiamento de tornozelo' },
  {
    key: 'Head Injury/Traumatic Brain Injury',
    label: 'Lesão craniana traumática'
  },
  { key: 'Influenza', label: 'Gripe' },
  { key: 'COVID-19', label: 'COVID-19' },
  { key: 'Pneumonia', label: 'Pneumonia' },
  { key: 'Acute Bronchitis', label: 'Bronquite aguda' },
  { key: 'Chronic Bronchitis (COPD)', label: 'Bronquite crônica' },
  { key: 'Tuberculosis', label: 'Tuberculose' },
  { key: 'Hypertension', label: 'Hipertensão' },
  { key: 'Deep Vein Thrombosis', label: 'Trombose venosa profunda' },
  { key: 'Peptic Ulcer', label: 'Úlcera peptica' },
  { key: 'Hepatitis B', label: 'Hepatite B' },
  { key: 'Hypothyroidism', label: 'Hipotireoidismo' },
  { key: 'Hyperthyroidism', label: 'Hipertireoidismo' },
  { key: 'Typhoid Fever', label: 'Febre tifóide' },
  { key: 'Sepsis', label: 'Sepsis' },
  { key: 'Conjunctivitis', label: 'Conjuntivite' },
  {
    key: 'Polycystic Ovary Syndrome (PCOS)',
    label: 'Síndrome da ovário policístico'
  },
  { key: 'Preeclampsia', label: 'Pré-eclâmpsia' },
  { key: 'Bone Fracture', label: 'Fratura de ossos' },
  { key: 'Asthma', label: 'Asma' },
  { key: 'Gastroenteritis', label: 'Gastroenterite' },
  { key: 'Pyelonephritis', label: 'Nefrite pielonefrítica' },
  { key: 'Fibromyalgia', label: 'Fibromialgia' },
  { key: 'Shingles (Herpes Zoster)', label: 'Herpes zoster' },
  { key: 'Erysipelas', label: 'Erispela' },
  { key: 'Anaphylaxis', label: 'Anafilaxia' },
  { key: 'Food Poisoning', label: 'Intoxicação alimentar' },
  { key: 'Acute Myocardial Infarction', label: 'Infarto agudo do miocárdio' },
  { key: 'Pulmonary Embolism', label: 'Embolia pulmonar' },
  { key: "Crohn's Disease", label: 'Doença de Crohn' },
  { key: 'Cholecystitis (Gallstones)', label: 'Cistite biliar' },
  { key: 'Meningitis', label: 'Meningite' },
  { key: 'Epilepsy', label: 'Epilepsia' },
  { key: 'Vertigo (Labyrinthitis)', label: 'Vertigem (Laringite)' },
  { key: 'Type 1 Diabetes 2', label: 'Diabetes tipo 1' },
  { key: 'Malaria', label: 'Malária' },
  { key: 'Leptospirosis', label: 'Leptospirose' },
  { key: 'Chikungunya', label: 'Chikungunya' },
  { key: 'Measles', label: 'Sarampo' },
  { key: 'Sickle Cell Anemia (crisis)', label: 'Anemia falciforme (crise)' },
  {
    key: 'Hemophilia (bleeding episode)',
    label: 'Hemofilia (episódio de sangramento)'
  },
  {
    key: "Adrenal Insufficiency (Addison's Disease)",
    label: 'Insuficiência adrenal (Doença de Addison)'
  },
  { key: 'Cardiac Arrhythmia', label: 'Arritmia cardíaca' },
  { key: 'Appendicitis', label: 'Appendicite' },
  { key: 'Gout', label: 'Gota' },
  { key: 'Osteoarthritis', label: 'Osteoartrite' },
  { key: 'Dengue Fever', label: 'Febre do dengue' },
  { key: 'Chickenpox (Varicella)', label: 'Varicela' },
  { key: 'Psoriasis', label: 'Psoríase' },
  { key: 'Leukemia (acute phase)', label: 'Leucemia (fase aguda)' },
  { key: 'Glaucoma', label: 'Glaucoma' },
  { key: 'Endometriosis', label: 'Endometriose' },
  { key: 'Heatstroke (Coup de Chaleur)', label: 'Câimbra (febre) aguda' },
  { key: 'Kidney Stones (Nephrolithiasis)', label: 'Cálculo renal' },
  { key: 'Rheumatoid Arthritis', label: 'Artrite reumatóide' },
  { key: 'Tendinitis', label: 'Tendinite' },
  { key: 'Urticaria', label: 'Urticária' },
  { key: 'Infectious Cellulitis', label: 'Celulite infecciosa' },
  { key: 'Lymphoma', label: 'Linfoma' },
  { key: 'Panic Disorder', label: 'Distúrbio de ansiedade' },
  { key: 'Allergic Rhinitis', label: 'Rinite alérgica' },
  { key: "Cushing's Syndrome", label: 'Síndrome de Cushing' },
  {
    key: 'Stroke (Cerebrovascular Accident)',
    label: 'Acidente vascular cerebral'
  },
  { key: 'Liver Cirrhosis', label: 'Cirrose hepática' },
  { key: "Parkinson's Disease", label: 'Doença de Parkinson' },
  { key: 'Zika Virus', label: 'Vírus Zika' },
  { key: 'Mumps', label: 'Sarampo' },
  { key: 'Otitis Media', label: 'Otitite' },
  { key: 'Severe Dehydration', label: 'Desidratação severa' },
  { key: 'Common Cold', label: 'Resfriado comum' },
  { key: 'Pharyngitis', label: 'Faringite' },
  { key: 'Pericarditis', label: 'Pericardite' },
  { key: 'Pancreatitis', label: 'Pancreatite' },
  { key: 'Multiple Sclerosis', label: 'Esclerose múltipla' },
  { key: 'Chronic Kidney Failure', label: 'Insuficiência renal crônica' },
  { key: 'Herniated Disc', label: 'Disco herniado' },
  { key: 'HIV/AIDS (acute phase)', label: 'HIV/AIDS (fase aguda)' },
  { key: 'Mononucleosis', label: 'Mononucleose' },
  {
    key: 'Anxiety Disorder Generalized',
    label: 'Distúrbio de ansiedade generalizado'
  },
  { key: 'Tonsillitis', label: 'Tonsilitite' },
  { key: 'Iron Deficiency Anemia', label: 'Anemia ferropénica' }
]
