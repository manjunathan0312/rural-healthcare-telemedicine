/**
 * Rural Healthcare Telemedicine Platform - Application Logic
 * ABDM & NHM Aligned Field Triage & Specialist Teleconsultation System
 */

(function () {
    'use strict';

    // Application State
    const state = {
        currentView: 'asha', // 'asha' | 'doctor'
        isOnline: false,     // Simulated network state
        activeSubCenterId: 'SC-101',
        triageQueue: [...INITIAL_TRIAGE_QUEUE],
        offlineQueue: [],
        selectedPatientId: 'TRG-2026-001',
        activePrescriptionItems: [],
        isVoiceRecording: false
    };

    // DOM Elements Cache
    const el = {
        // View Switcher
        btnToggleAsha: document.getElementById('toggle-asha-view'),
        btnToggleDoctor: document.getElementById('toggle-doctor-view'),
        viewAsha: document.getElementById('view-asha-worker'),
        viewDoctor: document.getElementById('view-specialist-doctor'),

        // Network Simulation
        btnSimNetwork: document.getElementById('sim-network-toggle-btn'),
        globalStatusDot: document.getElementById('global-status-dot'),
        globalStatusText: document.getElementById('global-status-text'),
        ashaNetworkBadge: document.getElementById('asha-network-badge'),
        ashaNetworkLabel: document.getElementById('asha-network-label'),
        ashaNetworkSub: document.getElementById('asha-network-sub'),

        // ASHA Form Elements
        ashaSubcenterSelect: document.getElementById('asha-subcenter-select'),
        pendingSyncCounter: document.getElementById('pending-sync-counter'),
        ashaAbhaInput: document.getElementById('asha-abha-input'),
        btnVerifyAbha: document.getElementById('btn-verify-abha'),
        patientVerifiedCard: document.getElementById('patient-verified-card'),
        prevPatientName: document.getElementById('prev-patient-name'),
        prevPatientDemog: document.getElementById('prev-patient-demog'),
        prevPatientVillage: document.getElementById('prev-patient-village'),
        prevPatientAllergies: document.getElementById('prev-patient-allergies'),
        vitalBp: document.getElementById('vital-bp'),
        vitalPulse: document.getElementById('vital-pulse'),
        vitalSpo2: document.getElementById('vital-spo2'),
        vitalTemp: document.getElementById('vital-temp'),
        vitalSugar: document.getElementById('vital-sugar'),
        ashaSymptomsInput: document.getElementById('asha-symptoms-input'),
        voiceLangSelect: document.getElementById('voice-lang-select'),
        btnVoiceMic: document.getElementById('btn-voice-mic'),
        voiceStatusBanner: document.getElementById('voice-status-banner'),
        voiceStatusText: document.getElementById('voice-status-text'),
        triageSeveritySelect: document.getElementById('triage-severity-select'),
        triagePillBtns: document.querySelectorAll('.triage-pill-btn'),
        btnSaveOfflineQueue: document.getElementById('btn-save-offline-queue'),
        btnForceSyncNow: document.getElementById('btn-force-sync-now'),
        offlineRecordsContainer: document.getElementById('offline-records-container'),
        sampleAbhaChips: document.querySelectorAll('.sample-abha-chip'),

        // Doctor View Elements
        sidebarQueueBadge: document.getElementById('sidebar-queue-badge'),
        kpiTotalTriaged: document.getElementById('kpi-total-triaged'),
        kpiEmergencyCount: document.getElementById('kpi-emergency-count'),
        queueCountTag: document.getElementById('queue-count-tag'),
        queueSearchInput: document.getElementById('queue-search-input'),
        queuePriorityFilter: document.getElementById('queue-priority-filter'),
        triageTableBody: document.getElementById('triage-table-body'),

        // Patient Details in Doctor Workstation
        docPatientName: document.getElementById('doc-patient-name'),
        docPatientAbha: document.getElementById('doc-patient-abha'),
        docPriorityBadge: document.getElementById('doc-priority-badge'),
        docPatientDemog: document.getElementById('doc-patient-demog'),
        docPatientLocation: document.getElementById('doc-patient-location'),
        docPatientAsha: document.getElementById('doc-patient-asha'),
        docVitalBp: document.getElementById('doc-vital-bp'),
        docVitalPulse: document.getElementById('doc-vital-pulse'),
        docVitalSpo2: document.getElementById('doc-vital-spo2'),
        docVitalTemp: document.getElementById('doc-vital-temp'),
        docSymptomsContent: document.getElementById('doc-symptoms-content'),
        docHistoryContent: document.getElementById('doc-history-content'),

        // Digital Prescription Pad
        rxDiagnosisInput: document.getElementById('rx-diagnosis-input'),
        rxDrugSelect: document.getElementById('rx-drug-select'),
        subcenterStockBadge: document.getElementById('subcenter-stock-badge'),
        rxDosageInput: document.getElementById('rx-dosage-input'),
        rxDurationInput: document.getElementById('rx-duration-input'),
        btnAddDrugItem: document.getElementById('btn-add-drug-item'),
        rxPrescribedItemsList: document.getElementById('rx-prescribed-items-list'),
        rxDietaryInstructions: document.getElementById('rx-dietary-instructions'),
        btnEsignDispatch: document.getElementById('btn-esign-dispatch'),
        btnStartVideoConsult: document.getElementById('btn-start-video-consult'),

        // Modals
        modalPrescriptionSlip: document.getElementById('modal-prescription-slip'),
        btnCloseRxModal: document.getElementById('btn-close-rx-modal'),
        btnPrintRx: document.getElementById('btn-print-rx'),
        btnConfirmRxDone: document.getElementById('btn-confirm-rx-done'),
        modalPatientName: document.getElementById('modal-patient-name'),
        modalPatientAbha: document.getElementById('modal-patient-abha'),
        modalSubcenterName: document.getElementById('modal-subcenter-name'),
        modalDiagnosisText: document.getElementById('modal-diagnosis-text'),
        modalMedicinesTable: document.getElementById('modal-medicines-table'),
        modalPharmacyNote: document.getElementById('modal-pharmacy-note'),
        modalRxUid: document.getElementById('modal-rx-uid'),
        modalRxDate: document.getElementById('modal-rx-date'),

        modalTeleconsultVideo: document.getElementById('modal-teleconsult-video'),
        btnCloseVideoModal: document.getElementById('btn-close-video-modal'),
        btnEndVideoCall: document.getElementById('btn-end-video-call'),
        videoPatientName: document.getElementById('video-patient-name'),

        toastContainer: document.getElementById('toast-container'),
        currentClock: document.getElementById('current-clock')
    };

    /**
     * INITIALIZATION
     */
    function init() {
        loadPersistedData();
        setupClock();
        bindEvents();
        renderDrugDropdown();
        renderOfflineQueue();
        renderTriageQueueTable();
        loadSelectedPatientDetail(state.selectedPatientId);
        updateNetworkUI();
    }

    /**
     * LOCAL STORAGE PERSISTENCE
     */
    function loadPersistedData() {
        const savedQueue = localStorage.getItem('nhm_tele_triage_queue');
        if (savedQueue) {
            try {
                state.triageQueue = JSON.parse(savedQueue);
            } catch (e) {
                console.error('Error parsing queue data', e);
            }
        }

        const savedOffline = localStorage.getItem('nhm_tele_offline_queue');
        if (savedOffline) {
            try {
                state.offlineQueue = JSON.parse(savedOffline);
            } catch (e) {
                console.error('Error parsing offline queue', e);
            }
        }
    }

    function persistData() {
        localStorage.setItem('nhm_tele_triage_queue', JSON.stringify(state.triageQueue));
        localStorage.setItem('nhm_tele_offline_queue', JSON.stringify(state.offlineQueue));
    }

    /**
     * CLOCK TICKER
     */
    function setupClock() {
        const update = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            if (el.currentClock) el.currentClock.textContent = `${timeStr} IST`;
        };
        update();
        setInterval(update, 1000);
    }

    /**
     * EVENT LISTENERS BINDING
     */
    function bindEvents() {
        // Master View Switcher
        el.btnToggleAsha.addEventListener('click', () => switchView('asha'));
        el.btnToggleDoctor.addEventListener('click', () => switchView('doctor'));

        // Network State Toggle Simulation
        el.btnSimNetwork.addEventListener('click', toggleNetworkSimulation);

        // ASHA Sub-center selection
        el.ashaSubcenterSelect.addEventListener('click', (e) => {
            state.activeSubCenterId = e.target.value;
            updateDrugStockBadge();
        });
        el.ashaSubcenterSelect.addEventListener('change', (e) => {
            state.activeSubCenterId = e.target.value;
            updateDrugStockBadge();
        });

        // ABHA Lookup & Verification
        el.btnVerifyAbha.addEventListener('click', verifyAbhaId);
        el.ashaAbhaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyAbhaId();
        });

        // Quick sample ABHA chips
        el.sampleAbhaChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const abha = chip.getAttribute('data-abha');
                el.ashaAbhaInput.value = abha;
                verifyAbhaId();
            });
        });

        // Voice-to-Text Microphone Simulator
        el.btnVoiceMic.addEventListener('click', toggleVoiceRecording);

        // Triage Severity Pills
        el.triagePillBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                el.triagePillBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const severity = btn.getAttribute('data-severity');
                el.triageSeveritySelect.value = severity;
            });
        });

        // Save Data & Queue for Sync (ASHA View)
        el.btnSaveOfflineQueue.addEventListener('click', handleSaveDataAndQueue);
        el.btnForceSyncNow.addEventListener('click', syncOfflineQueueToCloud);

        // Doctor Search & Filters
        el.queueSearchInput.addEventListener('input', renderTriageQueueTable);
        el.queuePriorityFilter.addEventListener('change', renderTriageQueueTable);

        // Prescription Drug Selection Change (Updates Local Pharmacy Stock Badge)
        el.rxDrugSelect.addEventListener('change', handleDrugSelectionChange);
        el.btnAddDrugItem.addEventListener('click', handleAddPrescriptionItem);

        // Prescription E-Sign & Teleconsult Modals
        el.btnEsignDispatch.addEventListener('click', openPrescriptionModal);
        el.btnCloseRxModal.addEventListener('click', () => el.modalPrescriptionSlip.classList.remove('show'));
        el.btnConfirmRxDone.addEventListener('click', completeConsultationFlow);
        el.btnPrintRx.addEventListener('click', handlePrintPrescription);

        el.btnStartVideoConsult.addEventListener('click', openVideoConsultModal);
        el.btnCloseVideoModal.addEventListener('click', () => el.modalTeleconsultVideo.classList.remove('show'));
        el.btnEndVideoCall.addEventListener('click', () => el.modalTeleconsultVideo.classList.remove('show'));
    }

    /**
     * VIEW SWITCHER
     */
    function switchView(viewName) {
        state.currentView = viewName;

        if (viewName === 'asha') {
            el.btnToggleAsha.classList.add('active');
            el.btnToggleAsha.setAttribute('aria-selected', 'true');
            el.btnToggleDoctor.classList.remove('active');
            el.btnToggleDoctor.setAttribute('aria-selected', 'false');

            el.viewAsha.classList.add('active');
            el.viewDoctor.classList.remove('active');
            showToast('Switched to ASHA Worker View (Offline Field Tablet)');
        } else {
            el.btnToggleDoctor.classList.add('active');
            el.btnToggleDoctor.setAttribute('aria-selected', 'true');
            el.btnToggleAsha.classList.remove('active');
            el.btnToggleAsha.setAttribute('aria-selected', 'false');

            el.viewDoctor.classList.add('active');
            el.viewAsha.classList.remove('active');
            renderTriageQueueTable();
            showToast('Switched to Specialist Doctor View (Desktop Workstation)');
        }
    }

    /**
     * NETWORK STATUS TOGGLE & SYNC SIMULATOR
     */
    function toggleNetworkSimulation() {
        state.isOnline = !state.isOnline;
        updateNetworkUI();

        if (state.isOnline) {
            showToast('Network Connected: Cloud Sync Active');
            if (state.offlineQueue.length > 0) {
                setTimeout(syncOfflineQueueToCloud, 800);
            }
        } else {
            showToast('Network OFFLINE: Operating in Local SQLite / Cache Mode');
        }
    }

    function updateNetworkUI() {
        if (state.isOnline) {
            el.globalStatusDot.className = 'status-dot';
            el.globalStatusText.textContent = 'Mode: 4G/Cloud Connected';

            el.ashaNetworkBadge.className = 'network-badge-box';
            el.ashaNetworkBadge.style.background = 'var(--gov-blue-800)';
            el.ashaNetworkBadge.style.borderColor = 'var(--gov-blue-600)';
            el.ashaNetworkLabel.textContent = 'Network Status: ONLINE - Cloud Synchronized';
            el.ashaNetworkSub.textContent = 'Direct ABDM telemetry stream &bull; Real-time push';
        } else {
            el.globalStatusDot.className = 'status-dot offline';
            el.globalStatusText.textContent = 'Mode: Offline Local Cache';

            el.ashaNetworkBadge.className = 'network-badge-box offline';
            el.ashaNetworkBadge.style.background = 'var(--slate-800)';
            el.ashaNetworkBadge.style.borderColor = 'var(--slate-600)';
            el.ashaNetworkLabel.textContent = 'Network Status: OFFLINE - Saving Locally';
            el.ashaNetworkSub.textContent = 'Zero Internet required &bull; Auto-stores to device cache';
        }
    }

    /**
     * ABHA ID VERIFICATION (FIELD TABLET)
     */
    function verifyAbhaId() {
        const inputVal = el.ashaAbhaInput.value.trim();
        const record = PRELOADED_ABHA_REGISTRY[inputVal];

        if (record) {
            el.patientVerifiedCard.classList.add('show');
            el.prevPatientName.textContent = record.name;
            el.prevPatientDemog.textContent = `${record.age} Yrs • ${record.gender}`;
            el.prevPatientVillage.textContent = record.village;
            el.prevPatientAllergies.textContent = record.allergies || 'None';

            if (record.lastVitals) {
                if (record.lastVitals.bp) el.vitalBp.value = record.lastVitals.bp.replace(' mmHg', '');
                if (record.lastVitals.pulse) el.vitalPulse.value = record.lastVitals.pulse.replace(' bpm', '');
                if (record.lastVitals.spo2) el.vitalSpo2.value = record.lastVitals.spo2;
                if (record.lastVitals.temp) el.vitalTemp.value = record.lastVitals.temp.replace(' °F', '');
                if (record.lastVitals.sugar) el.vitalSugar.value = record.lastVitals.sugar.replace(' mg/dL', '');
            }

            if (record.subCenterId) {
                el.ashaSubcenterSelect.value = record.subCenterId;
                state.activeSubCenterId = record.subCenterId;
            }

            showToast(`ABHA Verified: ${record.name} (${record.abhaAddress})`);
        } else {
            el.patientVerifiedCard.classList.add('show');
            el.prevPatientName.textContent = 'Citizen Registered (New Record)';
            el.prevPatientDemog.textContent = 'Adult • Rural Resident';
            el.prevPatientVillage.textContent = 'Sub-Center Jurisdiction';
            el.prevPatientAllergies.textContent = 'Not recorded in field';
            showToast('New ABHA generated for offline field intake');
        }
    }

    /**
     * REGIONAL SPEECH-TO-TEXT SIMULATOR
     */
    function toggleVoiceRecording() {
        if (state.isVoiceRecording) {
            // Stop recording
            state.isVoiceRecording = false;
            el.btnVoiceMic.classList.remove('recording');
            el.voiceStatusBanner.classList.remove('active');
        } else {
            // Start recording
            state.isVoiceRecording = true;
            el.btnVoiceMic.classList.add('recording');
            el.voiceStatusBanner.classList.add('active');

            const selectedLangIdx = parseInt(el.voiceLangSelect.value, 10) || 0;
            const sampleSpeech = SAMPLE_REGIONAL_SPEECHES[selectedLangIdx];

            el.voiceStatusText.textContent = `Listening in ${sampleSpeech.lang}... Transcribing voice stream`;

            // Simulate real-time dictation after 1.8 seconds
            setTimeout(() => {
                if (state.isVoiceRecording) {
                    el.ashaSymptomsInput.value = `${sampleSpeech.spokenText}\n\n[Clinical Translation]: ${sampleSpeech.translatedText}`;
                    state.isVoiceRecording = false;
                    el.btnVoiceMic.classList.remove('recording');
                    el.voiceStatusBanner.classList.remove('active');
                    showToast(`Dictated & Translated via regional speech engine (${sampleSpeech.lang})`);
                }
            }, 1800);
        }
    }

    /**
     * SAVE DATA & QUEUE FOR SYNC (ASHA ACTION)
     */
    function handleSaveDataAndQueue() {
        const abhaId = el.ashaAbhaInput.value.trim() || '91-4458-1290-7712';
        const patientData = PRELOADED_ABHA_REGISTRY[abhaId] || {
            name: 'Citizen Patient',
            age: 45,
            gender: 'Adult',
            village: 'Ramnagar Ward 4',
            history: 'Routine field checkup',
            allergies: 'None'
        };

        const subCenterObj = INITIAL_SUB_CENTERS.find(sc => sc.id === state.activeSubCenterId) || INITIAL_SUB_CENTERS[0];
        const severity = el.triageSeveritySelect.value;
        const symptoms = el.ashaSymptomsInput.value.trim() || 'General physical weakness and malaise noted during field visit.';

        const newRecord = {
            id: `TRG-2026-${String(state.triageQueue.length + state.offlineQueue.length + 1).padStart(3, '0')}`,
            abhaId: abhaId,
            name: patientData.name,
            age: patientData.age,
            gender: patientData.gender,
            subCenterId: state.activeSubCenterId,
            subCenterName: subCenterObj.name,
            ashaWorkerName: 'Smt. Sunita Devi (ASH-104)',
            priority: severity,
            priorityReason: `Field triage tagged as ${severity}. Vitals logged.`,
            symptoms: symptoms,
            vitals: {
                bp: el.vitalBp.value || '120/80',
                pulse: el.vitalPulse.value || '78',
                spo2: el.vitalSpo2.value || '98%',
                temp: el.vitalTemp.value || '98.4°F',
                sugar: el.vitalSugar.value || '115'
            },
            timestamp: 'Just now',
            syncStatus: state.isOnline ? 'SYNCED' : 'QUEUED',
            isOfflineQueued: !state.isOnline,
            consultStatus: 'PENDING_REVIEW',
            prescriptions: []
        };

        if (state.isOnline) {
            state.triageQueue.unshift(newRecord);
            showToast(`Patient data uploaded & queued for Specialist Doctor review (${newRecord.id})`);
        } else {
            state.offlineQueue.unshift(newRecord);
            state.triageQueue.unshift(newRecord); // Also visible in doctor queue for testability
            showToast(`Saved to Local Offline Storage (${newRecord.id}). Queued for Cloud Sync.`);
        }

        persistData();
        renderOfflineQueue();
        renderTriageQueueTable();
        updateKpis();
    }

    /**
     * SYNC OFFLINE QUEUE TO CLOUD
     */
    function syncOfflineQueueToCloud() {
        if (state.offlineQueue.length === 0) {
            showToast('All field records are currently synchronized with cloud');
            return;
        }

        const count = state.offlineQueue.length;
        state.offlineQueue.forEach(item => {
            item.syncStatus = 'SYNCED';
            item.isOfflineQueued = false;
        });

        state.offlineQueue = [];
        persistData();
        renderOfflineQueue();
        renderTriageQueueTable();
        showToast(`Successfully synchronized ${count} offline field records with ABDM Central Cloud`);
    }

    /**
     * RENDER OFFLINE QUEUE (TABLET VIEW TRAY)
     */
    function renderOfflineQueue() {
        const queueCount = state.offlineQueue.length;
        el.pendingSyncCounter.textContent = `${queueCount} queued for sync`;

        const displayItems = state.triageQueue.slice(0, 4);

        if (displayItems.length === 0) {
            el.offlineRecordsContainer.innerHTML = '<div style="font-size:0.75rem; color:var(--slate-500); padding:6px 0;">No records stored yet.</div>';
            return;
        }

        el.offlineRecordsContainer.innerHTML = displayItems.map(item => `
            <div class="offline-record-card">
                <div class="offline-record-meta">
                    <strong>${item.name} &bull; ${item.priority}</strong>
                    <p>ABHA: ${item.abhaId} &bull; ${item.subCenterName}</p>
                </div>
                <div>
                    <span class="sync-status-tag ${item.syncStatus === 'QUEUED' ? 'queued' : 'synced'}">
                        ${item.syncStatus === 'QUEUED' ? '&#8644; Queued' : '&check; Synced'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    /**
     * RENDER SMART TRIAGE QUEUE TABLE (DOCTOR VIEW)
     */
    function renderTriageQueueTable() {
        const query = (el.queueSearchInput.value || '').toLowerCase().trim();
        const filterPriority = el.queuePriorityFilter.value;

        const filtered = state.triageQueue.filter(item => {
            const matchesQuery = item.name.toLowerCase().includes(query) ||
                item.abhaId.includes(query) ||
                item.subCenterName.toLowerCase().includes(query) ||
                item.symptoms.toLowerCase().includes(query);

            const matchesPriority = filterPriority === 'ALL' || item.priority.toLowerCase() === filterPriority.toLowerCase();

            return matchesQuery && matchesPriority;
        });

        el.queueCountTag.textContent = `${filtered.length} Active Records`;
        el.sidebarQueueBadge.textContent = String(filtered.length);

        if (filtered.length === 0) {
            el.triageTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 24px; color: var(--slate-500);">
                        No patients matching search or filter criteria.
                    </td>
                </tr>
            `;
            return;
        }

        el.triageTableBody.innerHTML = filtered.map(patient => {
            const isSelected = patient.id === state.selectedPatientId;
            const priorityClass = patient.priority.toLowerCase().replace(' ', '-');

            return `
                <tr class="triage-row ${isSelected ? 'selected' : ''}" data-id="${patient.id}">
                    <td class="patient-id-cell">
                        <strong>${patient.name}</strong>
                        <code>${patient.abhaId}</code>
                    </td>
                    <td>
                        <strong style="color: var(--slate-800);">${patient.subCenterName}</strong>
                        <span class="subcenter-label">${patient.age} Y / ${patient.gender}</span>
                    </td>
                    <td>
                        <div class="symptom-snippet" title="${patient.symptoms}">
                            ${patient.symptoms}
                        </div>
                    </td>
                    <td>
                        <span class="priority-pill ${priorityClass}">${patient.priority}</span>
                    </td>
                    <td>
                        <span style="font-size: 0.72rem; font-weight: 700; color: ${patient.consultStatus === 'COMPLETED' ? 'var(--gov-blue-700)' : 'var(--slate-600)'};">
                            ${patient.consultStatus === 'COMPLETED' ? 'Prescribed' : 'Pending Review'}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach click listeners to rows
        el.triageTableBody.querySelectorAll('.triage-row').forEach(row => {
            row.addEventListener('click', () => {
                const patientId = row.getAttribute('data-id');
                loadSelectedPatientDetail(patientId);
            });
        });

        updateKpis();
    }

    /**
     * LOAD PATIENT DETAIL INTO SPECIALIST WORKSPACE
     */
    function loadSelectedPatientDetail(patientId) {
        state.selectedPatientId = patientId;
        const patient = state.triageQueue.find(p => p.id === patientId) || state.triageQueue[0];
        if (!patient) return;

        // Update highlight in table
        document.querySelectorAll('.triage-row').forEach(r => {
            r.classList.toggle('selected', r.getAttribute('data-id') === patientId);
        });

        // Fill Demographic & Vitals
        el.docPatientName.textContent = patient.name;
        el.docPatientAbha.textContent = `ABHA: ${patient.abhaId}`;
        el.docPatientDemog.textContent = `${patient.age} Y / ${patient.gender}`;
        el.docPatientLocation.textContent = patient.subCenterName;
        el.docPatientAsha.textContent = patient.ashaWorkerName;

        const priorityClass = patient.priority.toLowerCase().replace(' ', '-');
        el.docPriorityBadge.className = `priority-pill ${priorityClass}`;
        el.docPriorityBadge.textContent = patient.priority.toUpperCase();

        el.docVitalBp.textContent = patient.vitals.bp || '120/80';
        el.docVitalPulse.textContent = `${patient.vitals.pulse || 76} bpm`;
        el.docVitalSpo2.textContent = patient.vitals.spo2 || '98%';
        el.docVitalTemp.textContent = `${patient.vitals.temp || 98.4} °F`;

        el.docSymptomsContent.textContent = patient.symptoms;

        const abhaRecord = PRELOADED_ABHA_REGISTRY[patient.abhaId];
        if (abhaRecord) {
            el.docHistoryContent.textContent = `${abhaRecord.history} Allergies: ${abhaRecord.allergies}`;
        } else {
            el.docHistoryContent.textContent = 'No prior hospital admissions recorded. Normal baseline reported by ASHA.';
        }

        // Set Diagnosis Default based on Priority/Symptoms
        if (patient.priority === 'Emergency') {
            el.rxDiagnosisInput.value = 'J44.1 - COPD / Acute Lower Respiratory Tract Exacerbation';
            el.rxDosageInput.value = '2 puffs SOS during acute breathlessness';
            el.rxDurationInput.value = '7 days';
        } else if (patient.priority === 'Routine') {
            el.rxDiagnosisInput.value = 'I10 - Essential Primary Hypertension (Grade 2)';
            el.rxDosageInput.value = '1 tab once daily in morning';
            el.rxDurationInput.value = '30 days';
        } else {
            el.rxDiagnosisInput.value = 'Z34.8 - Antenatal Care Supervision (Trimester 3)';
            el.rxDosageInput.value = '1 tab daily after food';
            el.rxDurationInput.value = '30 days';
        }

        // Load existing or default prescription items
        state.activePrescriptionItems = patient.prescriptions && patient.prescriptions.length > 0
            ? [...patient.prescriptions]
            : [];

        renderPrescribedItemsList();
        updateDrugStockBadge();
    }

    /**
     * RENDER DRUG DROPDOWN & INNOVATIVE LOCAL SUB-CENTER STOCK BADGE
     */
    function renderDrugDropdown() {
        el.rxDrugSelect.innerHTML = INITIAL_MEDICINES.map(med => `
            <option value="${med.id}">${med.name} (${med.category})</option>
        `).join('');

        handleDrugSelectionChange();
    }

    function handleDrugSelectionChange() {
        const drugId = el.rxDrugSelect.value;
        const medicine = INITIAL_MEDICINES.find(m => m.id === drugId);
        if (!medicine) return;

        // Auto-fill suggested dosage
        if (medicine.standardDosage) {
            el.rxDosageInput.value = medicine.standardDosage;
        }

        updateDrugStockBadge();
    }

    /**
     * INNOVATIVE FEATURE: Evaluate & Display Sub-Center Pharmacy Stock Badge
     */
    function updateDrugStockBadge() {
        const selectedPatient = state.triageQueue.find(p => p.id === state.selectedPatientId);
        const subCenterId = selectedPatient ? selectedPatient.subCenterId : state.activeSubCenterId;
        const subCenterObj = INITIAL_SUB_CENTERS.find(sc => sc.id === subCenterId) || INITIAL_SUB_CENTERS[0];

        const drugId = el.rxDrugSelect.value;
        const medicine = INITIAL_MEDICINES.find(m => m.id === drugId) || INITIAL_MEDICINES[0];

        const stockInfo = medicine.stock[subCenterId] || { qty: 0, status: 'OUT_OF_STOCK', unit: 'units' };

        if (stockInfo.status === 'IN_STOCK') {
            el.subcenterStockBadge.className = 'subcenter-inventory-badge in-stock';
            el.subcenterStockBadge.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                In Stock at ${subCenterObj.name} (${stockInfo.qty} ${stockInfo.unit})
            `;
        } else if (stockInfo.status === 'LOW_STOCK') {
            el.subcenterStockBadge.className = 'subcenter-inventory-badge low-stock';
            el.subcenterStockBadge.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                </svg>
                Low Stock at ${subCenterObj.name} (${stockInfo.qty} ${stockInfo.unit} remaining)
            `;
        } else {
            el.subcenterStockBadge.className = 'subcenter-inventory-badge out-of-stock';
            el.subcenterStockBadge.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
                Out of Stock at ${subCenterObj.name} &bull; Route to PHC/District Hospital
            `;
        }
    }

    /**
     * PRESCRIPTION ITEMS MANAGEMENT
     */
    function handleAddPrescriptionItem() {
        const drugId = el.rxDrugSelect.value;
        const medicine = INITIAL_MEDICINES.find(m => m.id === drugId);
        if (!medicine) return;

        const dosage = el.rxDosageInput.value.trim() || medicine.standardDosage;
        const duration = el.rxDurationInput.value.trim() || '7 days';

        const selectedPatient = state.triageQueue.find(p => p.id === state.selectedPatientId);
        const subCenterId = selectedPatient ? selectedPatient.subCenterId : 'SC-101';
        const stockInfo = medicine.stock[subCenterId] || { qty: 0, status: 'OUT_OF_STOCK' };

        state.activePrescriptionItems.push({
            drugId: medicine.id,
            drugName: medicine.name,
            dosage: dosage,
            duration: duration,
            stockStatus: stockInfo.status,
            stockQty: stockInfo.qty
        });

        renderPrescribedItemsList();
        showToast(`Added ${medicine.name} to digital prescription`);
    }

    function renderPrescribedItemsList() {
        if (state.activePrescriptionItems.length === 0) {
            el.rxPrescribedItemsList.innerHTML = '<div style="font-size:0.75rem; color:var(--slate-500); padding: 4px 0;">No drugs added yet. Select a drug above and click "+ Add to Rx".</div>';
            return;
        }

        el.rxPrescribedItemsList.innerHTML = state.activePrescriptionItems.map((item, index) => `
            <div class="rx-item-card">
                <div class="rx-item-info">
                    <strong>${item.drugName}</strong>
                    <p>${item.dosage} &bull; Duration: ${item.duration} &bull; <em>Local Status: ${item.stockStatus === 'IN_STOCK' ? 'Available' : 'Order Required'}</em></p>
                </div>
                <button type="button" class="btn-remove-rx-item" data-index="${index}" title="Remove drug">&times;</button>
            </div>
        `).join('');

        el.rxPrescribedItemsList.querySelectorAll('.btn-remove-rx-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                state.activePrescriptionItems.splice(idx, 1);
                renderPrescribedItemsList();
            });
        });
    }

    /**
     * PRESCRIPTION MODAL (GOVERNMENT ABDM SLIP)
     */
    function openPrescriptionModal() {
        const patient = state.triageQueue.find(p => p.id === state.selectedPatientId);
        if (!patient) return;

        if (state.activePrescriptionItems.length === 0) {
            // Auto add default medicine if none added
            const med = INITIAL_MEDICINES[0];
            state.activePrescriptionItems.push({
                drugId: med.id,
                drugName: med.name,
                dosage: el.rxDosageInput.value || med.standardDosage,
                duration: el.rxDurationInput.value || '5 days',
                stockStatus: 'IN_STOCK'
            });
            renderPrescribedItemsList();
        }

        el.modalPatientName.textContent = patient.name;
        el.modalPatientAbha.textContent = patient.abhaId;
        el.modalSubcenterName.textContent = patient.subCenterName;
        el.modalDiagnosisText.textContent = el.rxDiagnosisInput.value || 'Clinical Evaluation Completed';

        // Render medicines in official slip table
        el.modalMedicinesTable.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; font-size: 0.76rem; border: 1px solid var(--slate-300);">
                <thead style="background: var(--slate-100);">
                    <tr>
                        <th style="padding: 6px 8px; border-bottom: 1px solid var(--slate-300); text-align: left;">Rx Medication</th>
                        <th style="padding: 6px 8px; border-bottom: 1px solid var(--slate-300); text-align: left;">Dosage & Frequency</th>
                        <th style="padding: 6px 8px; border-bottom: 1px solid var(--slate-300); text-align: left;">Duration</th>
                        <th style="padding: 6px 8px; border-bottom: 1px solid var(--slate-300); text-align: left;">Local Sub-Center Dispensation</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.activePrescriptionItems.map(item => `
                        <tr>
                            <td style="padding: 6px 8px; border-bottom: 1px solid var(--slate-200); font-weight: 700;">${item.drugName}</td>
                            <td style="padding: 6px 8px; border-bottom: 1px solid var(--slate-200);">${item.dosage}</td>
                            <td style="padding: 6px 8px; border-bottom: 1px solid var(--slate-200);">${item.duration}</td>
                            <td style="padding: 6px 8px; border-bottom: 1px solid var(--slate-200); color: var(--gov-blue-800); font-weight: 600;">
                                ${item.stockStatus === 'IN_STOCK' ? '&check; In Stock at Sub-Center' : 'Transfer from PHC Depot'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        el.modalPharmacyNote.textContent = `All prescribed items mapped to ${patient.subCenterName} inventory. ASHA worker Smt. Sunita Devi notified via SMS gateway for immediate dispensation.`;

        const randomCode = Math.floor(1000 + Math.random() * 9000);
        el.modalRxUid.textContent = `RX-2026-${randomCode}-NDHM`;
        el.modalPrescriptionSlip.classList.add('show');
    }

    function completeConsultationFlow() {
        const patient = state.triageQueue.find(p => p.id === state.selectedPatientId);
        if (patient) {
            patient.consultStatus = 'COMPLETED';
            patient.prescriptions = [...state.activePrescriptionItems];
            persistData();
            renderTriageQueueTable();
        }

        el.modalPrescriptionSlip.classList.remove('show');
        showToast('Prescription Signed & Dispatched to Frontline ASHA Tablet');
    }

    function handlePrintPrescription() {
        window.print();
    }

    /**
     * VIDEO TELECONSULT MODAL
     */
    function openVideoConsultModal() {
        const patient = state.triageQueue.find(p => p.id === state.selectedPatientId);
        if (patient) {
            el.videoPatientName.textContent = `${patient.name} (${patient.age}Y/${patient.gender}) • ${patient.subCenterName}`;
        }
        el.modalTeleconsultVideo.classList.add('show');
        showToast('Connecting low-bandwidth WebRTC video stream with ASHA tablet...');
    }

    /**
     * KPIS UPDATE
     */
    function updateKpis() {
        const total = state.triageQueue.length;
        const emergencyCount = state.triageQueue.filter(p => p.priority === 'Emergency').length;

        if (el.kpiTotalTriaged) el.kpiTotalTriaged.textContent = String(28 + total - 3);
        if (el.kpiEmergencyCount) el.kpiEmergencyCount.textContent = String(emergencyCount).padStart(2, '0');
    }

    /**
     * NOTIFICATION TOAST UTILITY
     */
    function showToast(message) {
        if (!el.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'gov-toast';
        toast.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>${message}</span>
        `;

        el.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Launch Application
    document.addEventListener('DOMContentLoaded', init);

})();
