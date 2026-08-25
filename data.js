/**
 * Rural Healthcare Telemedicine Platform - Data Model & Initial Mock Store
 * Features: ABHA Database, Sub-Center Drug Inventories, Patient Records, and Sync State
 */

const INITIAL_SUB_CENTERS = [
    { id: 'SC-101', name: 'Sub-Center Ramnagar', district: 'Varanasi', pin: '221008', phc: 'PHC Chiraigaon' },
    { id: 'SC-102', name: 'Sub-Center Bheldi', district: 'Saran', pin: '841402', phc: 'PHC Marhaura' },
    { id: 'SC-103', name: 'Sub-Center Devipura', district: 'Udaipur', pin: '313001', phc: 'PHC Mavli' }
];

const INITIAL_MEDICINES = [
    {
        id: 'MED-01',
        name: 'Paracetamol 500mg Tablets',
        category: 'Antipyretic / Analgesic',
        form: 'Tablet',
        stock: {
            'SC-101': { qty: 450, status: 'IN_STOCK', unit: 'tabs' },
            'SC-102': { qty: 200, status: 'IN_STOCK', unit: 'tabs' },
            'SC-103': { qty: 0, status: 'OUT_OF_STOCK', unit: 'tabs' }
        },
        standardDosage: '1 tab every 6-8 hrs after meals'
    },
    {
        id: 'MED-02',
        name: 'Amoxicillin + Clavulanic Acid 625mg',
        category: 'Antibiotic',
        form: 'Tablet',
        stock: {
            'SC-101': { qty: 85, status: 'IN_STOCK', unit: 'tabs' },
            'SC-102': { qty: 10, status: 'LOW_STOCK', unit: 'tabs' },
            'SC-103': { qty: 60, status: 'IN_STOCK', unit: 'tabs' }
        },
        standardDosage: '1 tab twice daily for 5 days'
    },
    {
        id: 'MED-03',
        name: 'Amlodipine 5mg Tablets',
        category: 'Antihypertensive',
        form: 'Tablet',
        stock: {
            'SC-101': { qty: 320, status: 'IN_STOCK', unit: 'tabs' },
            'SC-102': { qty: 150, status: 'IN_STOCK', unit: 'tabs' },
            'SC-103': { qty: 280, status: 'IN_STOCK', unit: 'tabs' }
        },
        standardDosage: '1 tab once daily in morning'
    },
    {
        id: 'MED-04',
        name: 'Metformin Hydrochloride 500mg (SR)',
        category: 'Antidiabetic',
        form: 'Tablet',
        stock: {
            'SC-101': { qty: 210, status: 'IN_STOCK', unit: 'tabs' },
            'SC-102': { qty: 0, status: 'OUT_OF_STOCK', unit: 'tabs' },
            'SC-103': { qty: 190, status: 'IN_STOCK', unit: 'tabs' }
        },
        standardDosage: '1 tab with evening meal'
    },
    {
        id: 'MED-05',
        name: 'ORS (Oral Rehydration Salts) Sachets',
        category: 'Electrolytes',
        form: 'Powder',
        stock: {
            'SC-101': { qty: 180, status: 'IN_STOCK', unit: 'sachets' },
            'SC-102': { qty: 95, status: 'IN_STOCK', unit: 'sachets' },
            'SC-103': { qty: 140, status: 'IN_STOCK', unit: 'sachets' }
        },
        standardDosage: 'Dissolve 1 packet in 1L clean water, sip frequently'
    },
    {
        id: 'MED-06',
        name: 'Salbutamol Inhaler 100mcg',
        category: 'Bronchodilator',
        form: 'Inhaler',
        stock: {
            'SC-101': { qty: 12, status: 'IN_STOCK', unit: 'canisters' },
            'SC-102': { qty: 3, status: 'LOW_STOCK', unit: 'canisters' },
            'SC-103': { qty: 0, status: 'OUT_OF_STOCK', unit: 'canisters' }
        },
        standardDosage: '2 puffs SOS during acute breathlessness'
    },
    {
        id: 'MED-07',
        name: 'Iron & Folic Acid (IFA) Red Tablets',
        category: 'Maternal Nutrition',
        form: 'Tablet',
        stock: {
            'SC-101': { qty: 600, status: 'IN_STOCK', unit: 'tabs' },
            'SC-102': { qty: 450, status: 'IN_STOCK', unit: 'tabs' },
            'SC-103': { qty: 520, status: 'IN_STOCK', unit: 'tabs' }
        },
        standardDosage: '1 tab daily after meal (with water)'
    },
    {
        id: 'MED-08',
        name: 'Cetirizine 10mg Tablets',
        category: 'Antihistamine',
        form: 'Tablet',
        stock: {
            'SC-101': { qty: 0, status: 'OUT_OF_STOCK', unit: 'tabs' },
            'SC-102': { qty: 120, status: 'IN_STOCK', unit: 'tabs' },
            'SC-103': { qty: 85, status: 'IN_STOCK', unit: 'tabs' }
        },
        standardDosage: '1 tab at night for 5 days'
    }
];

const PRELOADED_ABHA_REGISTRY = {
    '91-4458-1290-7712': {
        abhaId: '91-4458-1290-7712',
        abhaAddress: 'ramesh.yadav@abdm',
        name: 'Rameshwar Yadav',
        age: 58,
        gender: 'Male',
        phone: '+91 98321-44109',
        village: 'Ramnagar (Ward 4)',
        subCenterId: 'SC-101',
        history: 'Known Hypertension (4 yrs), Mild Chronic Kidney Disease Stage 2. Non-smoker.',
        allergies: 'Penicillin (mild rash)',
        lastVitals: { bp: '158/96 mmHg', pulse: '88 bpm', spo2: '96%', temp: '98.6 °F', sugar: '142 mg/dL' }
    },
    '91-8831-9042-3321': {
        abhaId: '91-8831-9042-3321',
        abhaAddress: 'kamla.devi@abdm',
        name: 'Kamla Devi',
        age: 46,
        gender: 'Female',
        phone: '+91 97412-88320',
        village: 'Ramnagar (Panchayat Ghar)',
        subCenterId: 'SC-101',
        history: 'Type 2 Diabetes Mellitus (6 yrs), Osteoarthritis bilateral knees.',
        allergies: 'None reported',
        lastVitals: { bp: '130/84 mmHg', pulse: '76 bpm', spo2: '98%', temp: '98.4 °F', sugar: '210 mg/dL' }
    },
    '91-1204-7749-6510': {
        abhaId: '91-1204-7749-6510',
        abhaAddress: 'priya.kumari@abdm',
        name: 'Priya Kumari',
        age: 24,
        gender: 'Female (Gravida 2, Para 1)',
        phone: '+91 94109-12290',
        village: 'Bheldi (East Tola)',
        subCenterId: 'SC-102',
        history: 'Ante-natal care (ANC 28 weeks), Mild Iron Deficiency Anemia.',
        allergies: 'Sulfa drugs',
        lastVitals: { bp: '110/70 mmHg', pulse: '82 bpm', spo2: '99%', temp: '99.1 °F', hb: '9.4 g/dL' }
    },
    '91-6650-3118-9944': {
        abhaId: '91-6650-3118-9944',
        abhaAddress: 'manoj.sharma@abdm',
        name: 'Manoj Kumar Sharma',
        age: 62,
        gender: 'Male',
        phone: '+91 91288-55412',
        village: 'Devipura (Ghat Block)',
        subCenterId: 'SC-103',
        history: 'COPD (Chronic Obstructive Pulmonary Disease), Seasonal Exacerbation.',
        allergies: 'Aspirin/NSAIDs',
        lastVitals: { bp: '138/88 mmHg', pulse: '104 bpm', spo2: '91%', temp: '101.2 °F' }
    }
};

const INITIAL_TRIAGE_QUEUE = [
    {
        id: 'TRG-2026-001',
        abhaId: '91-6650-3118-9944',
        name: 'Manoj Kumar Sharma',
        age: 62,
        gender: 'Male',
        subCenterId: 'SC-103',
        subCenterName: 'Sub-Center Devipura',
        ashaWorkerName: 'Smt. Kavita Sharma (ASHA ID: ASH-309)',
        priority: 'Emergency',
        priorityReason: 'Low SpO2 (91%), High Fever (101.2°F), Severe Respiratory Distress with wheezing',
        symptoms: 'Patient experiencing acute shortness of breath since 2 AM. Heavy chest tightness, audible wheezing, persistent productive cough with yellowish sputum. Unable to complete sentences in one breath.',
        vitals: { bp: '138/88', pulse: '104', spo2: '91%', temp: '101.2°F', sugar: '130' },
        timestamp: '10 mins ago',
        syncStatus: 'SYNCED',
        isOfflineQueued: false,
        consultStatus: 'PENDING_REVIEW',
        prescriptions: []
    },
    {
        id: 'TRG-2026-002',
        abhaId: '91-4458-1290-7712',
        name: 'Rameshwar Yadav',
        age: 58,
        gender: 'Male',
        subCenterId: 'SC-101',
        subCenterName: 'Sub-Center Ramnagar',
        ashaWorkerName: 'Smt. Sunita Devi (ASHA ID: ASH-104)',
        priority: 'Routine',
        priorityReason: 'Elevated BP reading (158/96), Mild occipital headache',
        symptoms: 'Reporting intermittent morning dizziness, bilateral occipital heaviness for 3 days. Checked BP on field tablet, systolic > 150 consistently. Needs medication dose adjustment.',
        vitals: { bp: '158/96', pulse: '88', spo2: '96%', temp: '98.6°F', sugar: '142' },
        timestamp: '28 mins ago',
        syncStatus: 'SYNCED',
        isOfflineQueued: false,
        consultStatus: 'PENDING_REVIEW',
        prescriptions: []
    },
    {
        id: 'TRG-2026-003',
        abhaId: '91-1204-7749-6510',
        name: 'Priya Kumari',
        age: 24,
        gender: 'Female',
        subCenterId: 'SC-102',
        subCenterName: 'Sub-Center Bheldi',
        ashaWorkerName: 'Smt. Anjali Roy (ASHA ID: ASH-218)',
        priority: 'Follow-up',
        priorityReason: 'ANC 28-Week Checkup, Routine Hemoglobin & Nutrition review',
        symptoms: 'Routine antenatal trimester 3 screening. Reports mild fatigue and pale conjunctiva. Fetal movements reported active and normal. No edema or spotting noted by ASHA.',
        vitals: { bp: '110/70', pulse: '82', spo2: '99%', temp: '99.1°F', sugar: '98' },
        timestamp: '1 hr ago',
        syncStatus: 'SYNCED',
        isOfflineQueued: false,
        consultStatus: 'COMPLETED',
        prescriptions: [
            {
                drugId: 'MED-07',
                drugName: 'Iron & Folic Acid (IFA) Red Tablets',
                dosage: '1 tab daily after food',
                duration: '30 days',
                stockStatus: 'IN_STOCK'
            }
        ]
    }
];

// Regional Speech Simulator Sentences
const SAMPLE_REGIONAL_SPEECHES = [
    {
        code: 'hi-IN',
        lang: 'Hindi (हिंदी)',
        spokenText: 'मरीज को पिछले 3 दिनों से तेज बुखार और छाती में जकड़न है। सांस लेने में काफी तकलीफ हो रही है और रात में खांसी बहुत बढ़ जाती है।',
        translatedText: 'Patient has high fever and chest tightness for the past 3 days. Experiencing severe shortness of breath with nocturnal cough exacerbation.'
    },
    {
        code: 'ta-IN',
        lang: 'Tamil (தமிழ்)',
        spokenText: 'நோயாளிக்கு கடந்த 2 நாட்களாக கடுமையான தலைவலி மற்றும் தலைச்சுற்றல் உள்ளது. இரத்த அழுத்தம் அதிகமாக பதிவாகியுள்ளது.',
        translatedText: 'Patient reports acute throbbing headache and vertigo for past 2 days. Field BP reading is significantly elevated above baseline.'
    },
    {
        code: 'te-IN',
        lang: 'Telugu (తెలుగు)',
        spokenText: 'రోగికి కడుపునొప్పి, తీవ్రమైన నీరసం మరియు వాంతులు అవుతున్నాయి. డీహైడ్రేషన్ లక్షణాలు కనిపిస్తున్నాయి.',
        translatedText: 'Patient presents with severe abdominal cramps, extreme weakness, and 3 episodes of vomiting. Signs of mild dehydration observed.'
    },
    {
        code: 'bn-IN',
        lang: 'Bengali (বাংলা)',
        spokenText: 'রোগীর পায়ে ফোলাভাব এবং প্রস্রাবের পরিমাণ কমে গেছে। ডায়াবেটিসের ওষুধ নিয়মিত খাচ্ছেন না।',
        translatedText: 'Patient exhibits bilateral pedal edema with decreased urine output. Irregular compliance with prescribed oral hypoglycemic agents.'
    },
    {
        code: 'en-IN',
        lang: 'English (Clinical)',
        spokenText: 'Patient presents with acute epigastric burning radiating to back after meals, accompanied by mild palpitation and sweating.',
        translatedText: 'Patient presents with acute epigastric burning radiating to back after meals, accompanied by mild palpitation and sweating.'
    }
];

/**
 * ABDM ABHA Generator Utility
 * Generates official format: 91-XXXX-XXXX-XXXX and citizen.name@abdm
 */
function generateRealisticAbhaId() {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(1000 + Math.random() * 9000);
    return `91-${part1}-${part2}-${part3}`;
}

function generateAbdmAddress(name) {
    if (!name) return 'citizen.' + Math.floor(100 + Math.random() * 900) + '@abdm';
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
    return `${clean}@abdm`;
}

/**
 * Patient Registry Storage Helpers
 */
const PATIENT_REGISTRY_KEY = 'nhm_tele_patient_registry';

function getStoredPatientRegistry() {
    try {
        const stored = localStorage.getItem(PATIENT_REGISTRY_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge preloaded to make sure defaults are always present
            return { ...PRELOADED_ABHA_REGISTRY, ...parsed };
        }
    } catch (e) {
        console.error('Error loading patient registry from storage:', e);
    }
    return { ...PRELOADED_ABHA_REGISTRY };
}

function saveStoredPatientRegistry(registry) {
    try {
        localStorage.setItem(PATIENT_REGISTRY_KEY, JSON.stringify(registry));
    } catch (e) {
        console.error('Error saving patient registry to storage:', e);
    }
}

