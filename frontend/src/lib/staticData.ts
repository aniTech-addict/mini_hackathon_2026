// Comprehensive, realistic static clinical dataset for Meditech Recovery Workspace

export interface StaticCalendarTask {
  id: string;
  task_id: string;
  title: string;
  description: string;
  category: 'MEDICATION' | 'EXERCISE' | 'WOUND_CARE' | 'CHECK_IN';
  schedule_times: string[];
  duration_minutes?: number;
  status: 'completed' | 'pending';
  completed: boolean;
}

export interface StaticCalendarDay {
  date: string;
  day: number;
  recovery_day: number;
  plan_id: string;
  plan_status: string;
  status: 'completed' | 'partial' | 'pending';
  review?: {
    scale: number;
    recovery_score: number;
    pain_level: number;
    note: string;
  };
  tasks: StaticCalendarTask[];
}

// Generate full September 2026 protocol days
export const STATIC_CALENDAR_DAYS: Record<string, StaticCalendarDay> = {};

const defaultTasksForDay = (day: number): StaticCalendarTask[] => [
  {
    id: `task-med-${day}`,
    task_id: `task-med-${day}`,
    title: 'Take prescribed medication & anti-inflammatory',
    description: 'Oral analgesics and thromboprophylaxis with food.',
    category: 'MEDICATION',
    schedule_times: ['08:00 AM', '08:00 PM'],
    duration_minutes: 5,
    status: day <= 11 ? 'completed' : 'pending',
    completed: day <= 11,
  },
  {
    id: `task-ex1-${day}`,
    task_id: `task-ex1-${day}`,
    title: 'Complete knee flexion & extension mobility exercises',
    description: 'Perform 3 sets of 10 repetitions with supported heel slides.',
    category: 'EXERCISE',
    schedule_times: ['10:30 AM'],
    duration_minutes: 20,
    status: day <= 10 || day === 11 ? 'completed' : 'pending',
    completed: day <= 10 || day === 11,
  },
  {
    id: `task-ex2-${day}`,
    task_id: `task-ex2-${day}`,
    title: 'Assisted 15-minute ambulation / walking session',
    description: 'Walk on flat, level ground using single crutch or cane as needed.',
    category: 'EXERCISE',
    schedule_times: ['04:00 PM'],
    duration_minutes: 15,
    status: day < 10 ? 'completed' : day === 10 ? 'pending' : day === 11 ? 'completed' : 'pending',
    completed: day < 10 || day === 11,
  },
  {
    id: `task-wound-${day}`,
    task_id: `task-wound-${day}`,
    title: 'Inspect surgical dressing & incisional wound care',
    description: 'Check for erythema, excess exudate, or swelling around knee.',
    category: 'WOUND_CARE',
    schedule_times: ['06:30 PM'],
    duration_minutes: 10,
    status: day <= 11 ? 'completed' : 'pending',
    completed: day <= 11,
  },
];

const reviewsByDay: Record<number, { scale: number; pain: number; note: string }> = {
  1: { scale: 3.5, pain: 8, note: 'Discharged from hospital, mild pain controlled by medication.' },
  2: { scale: 4.0, pain: 7, note: 'Initial home rest, ankle pumps performed every hour.' },
  3: { scale: 4.5, pain: 7, note: 'Swelling noticeable around joint, applied cold pack.' },
  4: { scale: 5.0, pain: 6, note: 'Quad sets completed with assistance, sleeping improved.' },
  5: { scale: 5.5, pain: 6, note: 'Good flexion to 65 degrees, dressing clean and dry.' },
  6: { scale: 6.0, pain: 5, note: 'Morning stiffness subsided after gentle stretches.' },
  7: { scale: 6.5, pain: 5, note: 'Walked 15 minutes outdoors with support, knee feels stable.' },
  8: { scale: 7.0, pain: 4, note: 'Achieved 80 degrees flexion in physiotherapy.' },
  9: { scale: 7.5, pain: 4, note: 'Comfortable bearing partial weight, no pain spikes.' },
  10: { scale: 8.0, pain: 3, note: 'Mobility steady, completed all home exercises smoothly.' },
  11: { scale: 8.5, pain: 3, note: 'Feeling great today! Knee flexion reached 90 degrees with zero sharp pain.' },
};

for (let d = 1; d <= 30; d++) {
  const dateStr = `2026-09-${String(d).padStart(2, '0')}`;
  const dayReview = reviewsByDay[d];
  let status: 'completed' | 'partial' | 'pending' = 'pending';
  if (d <= 9) status = 'completed';
  else if (d === 10) status = 'partial';
  else if (d === 11) status = 'completed';

  STATIC_CALENDAR_DAYS[dateStr] = {
    date: dateStr,
    day: d,
    recovery_day: d,
    plan_id: '30000000-0000-0000-0000-000000000101',
    plan_status: 'active',
    status,
    review: dayReview
      ? {
          scale: dayReview.scale,
          recovery_score: dayReview.scale,
          pain_level: dayReview.pain,
          note: dayReview.note,
        }
      : undefined,
    tasks: defaultTasksForDay(d),
  };
}

export const STATIC_PATIENT_PROFILE = {
  id: '20000000-0000-0000-0000-000000000101',
  patient_id: '20000000-0000-0000-0000-000000000101',
  name: 'Rahul Sharma',
  full_name: 'Rahul Sharma',
  username: 'rahul_sharma',
  age: 58,
  sex: 'Male',
  date_of_birth: '1968-04-12',
  blood_group: 'B+',
  phone_number: '+91 92000 00001',
  email: 'rahul.sharma@example.com',
  address: '12 Lake View Road, Pune, Maharashtra',
  procedure: 'Total Knee Replacement (TKA)',
  surgery_type: 'Total Knee Arthroplasty (Left Knee)',
  surgery_date: '2026-09-01',
  doctor_name: 'Dr. Ananya Rao',
  doctor_dept: 'Orthopedic Surgery & Joint Reconstruction',
  hospital: 'St. Jude Orthopaedic & Trauma Centre',
  allergies: ['Penicillin', 'Sulfa drugs'],
  medical_history: 'Primary osteoarthritis of the left knee. Prior arthroscopy in 2021. Managed hypertension.',
  recovery_progress: 78,
  recovery_day: 11,
};

export const STATIC_RECOVERY_PLAN = {
  id: '30000000-0000-0000-0000-000000000101',
  title: 'Total Knee Arthroplasty (TKA) Post-Op Protocol',
  status: 'active',
  start_date: '2026-09-01',
  end_date: '2026-09-30',
  current_day: 11,
  total_days: 30,
  adherence_rate: 89,
  doctor_name: 'Dr. Ananya Rao',
  description:
    'Structured 30-day clinical recovery protocol focusing on joint mobilization, pain management, and functional independence.',
  tasks: defaultTasksForDay(11),
};

export const STATIC_RECOVERY_PROGRESS = {
  plan_id: '30000000-0000-0000-0000-000000000101',
  title: 'Total Knee Arthroplasty (TKA) Post-Op Protocol',
  status: 'active',
  start_date: '2026-09-01',
  end_date: '2026-09-30',
  recovery_day: 11,
  total_days: 30,
  total_tasks: 44,
  completed_tasks: 39,
  adherence_rate: 89,
};

export const STATIC_ASSIGNED_PATIENTS = [
  {
    patient_id: '20000000-0000-0000-0000-000000000101',
    name: 'Rahul Sharma',
    full_name: 'Rahul Sharma',
    user_id: 'patient.rahul',
    username: 'rahul_sharma',
    age: 58,
    sex: 'male',
    procedure: 'Total Knee Replacement',
    surgery_date: '2026-09-01',
    recovery_day: 11,
    adherence_rate: 92,
    latest_review: 8.5,
    status: 'on_track',
    phone_number: '+91 92000 00001',
    email: 'rahul.sharma@example.com',
  },
  {
    patient_id: '20000000-0000-0000-0000-000000000102',
    name: 'Priya Patel',
    full_name: 'Priya Patel',
    user_id: 'patient.priya',
    username: 'priya_nair',
    age: 46,
    sex: 'female',
    procedure: 'ACL Reconstruction',
    surgery_date: '2026-09-03',
    recovery_day: 9,
    adherence_rate: 88,
    latest_review: 7.8,
    status: 'on_track',
    phone_number: '+91 92000 00002',
    email: 'priya.nair@example.com',
  },
  {
    patient_id: '20000000-0000-0000-0000-000000000105',
    name: 'Omkar Joshi',
    full_name: 'Omkar Joshi',
    user_id: 'patient.omkar',
    username: 'omkar_joshi',
    age: 51,
    sex: 'male',
    procedure: 'Shoulder Arthroscopy',
    surgery_date: '2026-09-05',
    recovery_day: 7,
    adherence_rate: 74,
    latest_review: 6.2,
    status: 'attention_needed',
    phone_number: '+91 92000 00005',
    email: 'omkar.joshi@example.com',
  },
  {
    patient_id: '20000000-0000-0000-0000-000000000103',
    name: 'Vikram Singh',
    full_name: 'Vikram Singh',
    user_id: 'patient.vikram',
    username: 'vikram_patel',
    age: 62,
    sex: 'male',
    procedure: 'Inguinal Hernia Repair',
    surgery_date: '2026-08-28',
    recovery_day: 15,
    adherence_rate: 95,
    latest_review: 9.0,
    status: 'on_track',
    phone_number: '+91 92000 00003',
    email: 'vikram.patel@example.com',
  },
  {
    patient_id: '20000000-0000-0000-0000-000000000104',
    name: 'Meera Iyer',
    full_name: 'Meera Iyer',
    user_id: 'patient.meera',
    username: 'meera_iyer',
    age: 35,
    sex: 'female',
    procedure: 'Laparoscopic Cholecystectomy',
    surgery_date: '2026-09-02',
    recovery_day: 10,
    adherence_rate: 85,
    latest_review: 8.0,
    status: 'on_track',
    phone_number: '+91 92000 00004',
    email: 'meera.iyer@example.com',
  },
  {
    patient_id: '20000000-0000-0000-0000-000000000106',
    name: 'Fatima Sheikh',
    full_name: 'Fatima Sheikh',
    user_id: 'patient.fatima',
    username: 'fatima_khan',
    age: 29,
    sex: 'female',
    procedure: 'Appendectomy',
    surgery_date: '2026-09-07',
    recovery_day: 5,
    adherence_rate: 90,
    latest_review: 8.2,
    status: 'on_track',
    phone_number: '+91 92000 00006',
    email: 'fatima.khan@example.com',
  },
];

export const STATIC_DOCTOR_ALERTS = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    patient_id: '20000000-0000-0000-0000-000000000101',
    patient_name: 'Rahul Sharma',
    type: 'DAILY_REVIEW_FLAGGED',
    severity: 'high',
    title: 'Increased Post-Operative Pain',
    message: 'Patient reported increased pain level (7/10) following aggressive walking protocol.',
    created_at: '2026-09-10T14:30:00Z',
    is_read: false,
    status: 'unread',
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    patient_id: '20000000-0000-0000-0000-000000000105',
    patient_name: 'Omkar Joshi',
    type: 'MISSED_TASK_FLAG',
    severity: 'medium',
    title: 'Missed Rehabilitation Exercises',
    message: 'Omkar has not logged prescribed pendulum exercises for 2 consecutive days.',
    created_at: '2026-09-11T09:15:00Z',
    is_read: false,
    status: 'unread',
  },
];

export const STATIC_PATIENT_ALERTS = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    title: 'Upcoming Orthopedic Follow-up',
    message: 'Clinical appointment with Dr. Ananya Rao scheduled for Day 14 (Sep 14) at 10:30 AM.',
    severity: 'medium',
    created_at: '2026-09-11T08:00:00Z',
    is_read: false,
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    title: 'Physiotherapy Milestones Achieved',
    message: 'Great progress reaching 90 degrees flexion! Keep up the daily heel slide exercises.',
    severity: 'low',
    created_at: '2026-09-10T18:00:00Z',
    is_read: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. STATIC MEDICAL REPORTS & OCR EXTRACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export interface StaticReportItem {
  id: string;
  file_name: string;
  report_type: 'discharge_summary' | 'operative_note' | 'imaging_report' | 'pathology_report';
  patient_id: string;
  patient_name: string;
  file_size: string;
  uploaded_at: string;
  ocr_status: 'COMPLETED' | 'PROCESSING' | 'PENDING';
  confidence_score: number;
}

export const STATIC_REPORTS_LIST: StaticReportItem[] = [
  {
    id: 'rep-seed-1',
    file_name: 'Rahul_Sharma_Total_Knee_Arthroplasty_Discharge_Summary.pdf',
    report_type: 'discharge_summary',
    patient_id: '20000000-0000-0000-0000-000000000101',
    patient_name: 'Rahul Sharma',
    file_size: '2.4 MB',
    uploaded_at: '2026-09-02T10:30:00Z',
    ocr_status: 'COMPLETED',
    confidence_score: 99.2,
  },
  {
    id: 'rep-seed-2',
    file_name: 'Rahul_Sharma_PostOp_Knee_AP_Lateral_Radiology.pdf',
    report_type: 'imaging_report',
    patient_id: '20000000-0000-0000-0000-000000000101',
    patient_name: 'Rahul Sharma',
    file_size: '8.1 MB',
    uploaded_at: '2026-09-04T14:15:00Z',
    ocr_status: 'COMPLETED',
    confidence_score: 98.4,
  },
  {
    id: 'rep-seed-3',
    file_name: 'Priya_Patel_ACL_Reconstruction_Operative_Protocol.pdf',
    report_type: 'operative_note',
    patient_id: '20000000-0000-0000-0000-000000000102',
    patient_name: 'Priya Patel',
    file_size: '3.2 MB',
    uploaded_at: '2026-09-04T16:00:00Z',
    ocr_status: 'COMPLETED',
    confidence_score: 97.8,
  },
  {
    id: 'rep-seed-4',
    file_name: 'Omkar_Joshi_Shoulder_Arthroscopy_Discharge_Report.pdf',
    report_type: 'discharge_summary',
    patient_id: '20000000-0000-0000-0000-000000000105',
    patient_name: 'Omkar Joshi',
    file_size: '1.9 MB',
    uploaded_at: '2026-09-06T11:20:00Z',
    ocr_status: 'COMPLETED',
    confidence_score: 98.9,
  },
  {
    id: 'rep-seed-5',
    file_name: 'Vikram_Singh_Inguinal_Hernia_Repair_Clinical_Summary.pdf',
    report_type: 'discharge_summary',
    patient_id: '20000000-0000-0000-0000-000000000103',
    patient_name: 'Vikram Singh',
    file_size: '2.1 MB',
    uploaded_at: '2026-08-29T09:40:00Z',
    ocr_status: 'COMPLETED',
    confidence_score: 99.4,
  },
  {
    id: 'rep-seed-6',
    file_name: 'Meera_Iyer_Laparoscopic_Cholecystectomy_Pathology.pdf',
    report_type: 'pathology_report',
    patient_id: '20000000-0000-0000-0000-000000000104',
    patient_name: 'Meera Iyer',
    file_size: '1.5 MB',
    uploaded_at: '2026-09-03T13:10:00Z',
    ocr_status: 'COMPLETED',
    confidence_score: 98.1,
  },
];

export const STATIC_PATIENT_REPORTS = STATIC_REPORTS_LIST.slice(0, 3);
export const STATIC_DOCTOR_REPORTS = STATIC_REPORTS_LIST;

export interface ExtractedClinicalReport {
  report_id: string;
  file_name: string;
  procedure: {
    name: string;
    surgeon: string;
    date: string;
    discharge_date?: string;
    anesthesia: string;
    hospital: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    schedule: string[];
  }>;
  exercises: Array<{
    title: string;
    frequency: string;
    duration: string;
    description: string;
    target_phase: string;
  }>;
  precautions: string[];
  warning_signs: string[];
  raw_ocr_text: string;
}

export const STATIC_OCR_EXTRACTION_MAP: Record<string, ExtractedClinicalReport> = {
  'rep-seed-1': {
    report_id: 'rep-seed-1',
    file_name: 'Rahul_Sharma_Total_Knee_Arthroplasty_Discharge_Summary.pdf',
    procedure: {
      name: 'Left Total Knee Arthroplasty (TKA)',
      surgeon: 'Dr. Ananya Rao, MS Ortho',
      date: '2026-09-01',
      discharge_date: '2026-09-02',
      anesthesia: 'Combined spinal-epidural anesthesia with femoral nerve block',
      hospital: 'St. Jude Orthopaedic & Trauma Centre',
    },
    medications: [
      {
        name: 'Cefuroxime Axetil',
        dosage: '500mg PO',
        frequency: 'Twice daily with meals',
        duration: '5 days',
        instructions: 'Complete entire course to prevent prosthetic joint infection.',
        schedule: ['08:00 AM', '08:00 PM'],
      },
      {
        name: 'Tramadol + Acetaminophen',
        dosage: '37.5mg / 325mg',
        frequency: 'Every 8 hours as needed',
        duration: '7 days',
        instructions: 'Take only for breakthrough postoperative pain. Do not exceed 4 tabs/day.',
        schedule: ['02:00 PM', '10:00 PM'],
      },
      {
        name: 'Enoxaparin Sodium (Lovenox)',
        dosage: '40mg subQ',
        frequency: 'Once daily in evening',
        duration: '14 days',
        instructions: 'Administer deep subcutaneously in abdominal tissue for DVT prophylaxis.',
        schedule: ['09:00 PM'],
      },
      {
        name: 'Pantoprazole Gastro-resistant',
        dosage: '40mg PO',
        frequency: 'Once daily before breakfast',
        duration: '14 days',
        instructions: 'Gastric mucosal protection during anti-inflammatory regimen.',
        schedule: ['07:30 AM'],
      },
    ],
    exercises: [
      {
        title: 'Quadriceps Isometric Contractions (Quad Sets)',
        frequency: '10 repetitions, 3 times daily',
        duration: '10 minutes',
        description: 'Tighten thigh muscles, push back of knee down firmly into bed, hold for 5 seconds.',
        target_phase: 'Phase 1: Early Activation',
      },
      {
        title: 'Ankle Pumps & Circulatory Stretches',
        frequency: '20 repetitions every hour while awake',
        duration: '5 minutes',
        description: 'Point toes toward head and away rhythmically to stimulate lower extremity venous return.',
        target_phase: 'Phase 1: Thromboprophylaxis',
      },
      {
        title: 'Active-Assisted Heel Slides',
        frequency: '10 repetitions, 2 times daily',
        duration: '15 minutes',
        description: 'Slide heel toward buttocks bending knee smoothly up to 90 degrees of flexion.',
        target_phase: 'Phase 1: ROM Restoration',
      },
      {
        title: 'Straight Leg Raises with Knee in Extension',
        frequency: '10 repetitions, 2 times daily',
        duration: '10 minutes',
        description: 'Lock knee completely straight, lift extremity 6-8 inches off surface, hold for 3 seconds.',
        target_phase: 'Phase 1: Extensor Mechanism',
      },
    ],
    precautions: [
      'Strict weight bearing as tolerated with front-wheeled walker or bilateral crutches.',
      'Aquacel surgical dressing to remain intact and dry until postoperative clinical day 12.',
      'Elevate operative lower extremity above heart level during afternoon rest intervals.',
      'Avoid placing pillows directly beneath the popliteal fossa (prevents knee flexion contractures).',
      'No deep squats, cross-legged sitting, or sudden pivoting on the operative knee.',
    ],
    warning_signs: [
      'Progressive calf swelling, warmth, or sharp pain on dorsiflexion (DVT alert - contact clinic immediately).',
      'Fever greater than 101.0°F (38.3°C) or severe shaking chills.',
      'Persistent erythema extending >2cm from surgical incision margins or purulent discharge.',
      'Acute sudden dyspnea, tachypnea, or pleuritic chest pain (PE protocol - dial emergency services).',
    ],
    raw_ocr_text: `ST. JUDE ORTHOPAEDIC MEDICAL CENTRE — DISCHARGE SUMMARY
PATIENT: SHARMA, RAHUL | MRN: ORT-2026-0984 | AGE: 58 | SEX: M
ADMISSION DATE: 01/09/2026 | DISCHARGE DATE: 02/09/2026
ATTENDING SURGEON: DR. ANANYA RAO, MS (ORTHO), DNB

OPERATIVE PROCEDURE:
Left Total Knee Arthroplasty (Triathlon Posterior Stabilized Prosthesis, Stryker).
Cemented fixation: Femur, Tibia, and 3-peg Patella component.

POSTOPERATIVE DIAGNOSIS:
End-stage Tricompartmental Osteoarthritis, Left Knee (Ahlbäck Grade IV).

INTRACLINICAL COURSE:
Patient tolerated surgery well under spinal anesthesia with femoral nerve catheter block.
Intraoperative blood loss: 120ml. Estimated Hb at discharge: 12.8 g/dL.
Post-op day 1: Ambulated 25 meters with walker under physical therapy supervision.
Wound inspected: Incision closed with staples, Aquacel Ag dressing applied under sterile conditions.

DISCHARGE MEDICATIONS:
1. Tab Cefuroxime 500mg PO BD x 5 days
2. Tab Tramadol 37.5mg + Paracetamol 325mg PO TID PRN x 7 days
3. Inj Enoxaparin 40mg SC OD at bedtime x 14 days
4. Tab Pantoprazole 40mg PO OD before breakfast x 14 days

REHABILITATION & PRECAUTIONS:
- WBAT with walker. Heel slides, quad sets, ankle pumps TID.
- Suture/staple removal scheduled for 14/09/2026 at Ortho OPD Clinic.`,
  },

  'rep-seed-2': {
    report_id: 'rep-seed-2',
    file_name: 'Rahul_Sharma_PostOp_Knee_AP_Lateral_Radiology.pdf',
    procedure: {
      name: 'Post-Op Digital Radiography (Left Knee AP & Lateral)',
      surgeon: 'Dr. Ananya Rao, MS Ortho',
      date: '2026-09-04',
      anesthesia: 'N/A (Diagnostic Imaging)',
      hospital: 'St. Jude Imaging Institute',
    },
    medications: [
      {
        name: 'Continue current analgesic regimen',
        dosage: 'As prescribed',
        frequency: 'Per clinical protocol',
        duration: '10 days',
        instructions: 'No alterations required based on stable radiologic evaluation.',
        schedule: ['08:00 AM', '08:00 PM'],
      },
    ],
    exercises: [
      {
        title: 'Full Weight-Bearing Progression',
        frequency: 'Daily walks up to 20 mins',
        duration: '20 minutes',
        description: 'Implant components securely positioned. Safe to proceed with active weight-bearing.',
        target_phase: 'Phase 2 Progression',
      },
    ],
    precautions: [
      'Maintain stable footwear with non-slip rubber soles.',
      'Continue avoidance of twisting rotational torque.',
    ],
    warning_signs: [
      'New onset clicking accompanied by acute pain or joint lockup.',
    ],
    raw_ocr_text: `ST. JUDE RADIOLOGY REPORT — DIGITAL SKELETAL RADIOGRAPHY
EXAMINATION: Left Knee (Weight-bearing AP, Lateral & Merchant views)
PATIENT: Rahul Sharma | DATE OF EXAM: 04/09/2026

FINDINGS:
Prosthetic total knee components in anatomic alignment.
Femoral component: Well-seated in 5° valgus alignment with flush anterior flange.
Tibial tray: Perpendicular to mechanical axis with uniform 2mm cement mantle.
Patellar button: Centered in femoral trochlear groove without tilt or subluxation.
No peri-prosthetic fracture, hardware loosening, or soft tissue gas collections seen.

IMPRESSION:
Normal, satisfactory early postoperative appearance of left total knee arthroplasty.`,
  },

  'rep-seed-3': {
    report_id: 'rep-seed-3',
    file_name: 'Priya_Patel_ACL_Reconstruction_Operative_Protocol.pdf',
    procedure: {
      name: 'Right Knee Arthroscopic ACL Reconstruction (Hamstring Autograft)',
      surgeon: 'Dr. Ananya Rao, MS Ortho',
      date: '2026-09-04',
      anesthesia: 'General anesthesia with adductor canal block',
      hospital: 'St. Jude Sports Medicine Pavilion',
    },
    medications: [
      {
        name: 'Etoricoxib',
        dosage: '90mg PO',
        frequency: 'Once daily after meals',
        duration: '7 days',
        instructions: 'Selective COX-2 anti-inflammatory for soft tissue swelling.',
        schedule: ['09:00 AM'],
      },
      {
        name: 'Acetaminophen (Paracetamol)',
        dosage: '1000mg PO',
        frequency: 'Every 8 hours as needed',
        duration: '5 days',
        instructions: 'Baseline analgesic coverage.',
        schedule: ['08:00 AM', '04:00 PM', '10:00 PM'],
      },
    ],
    exercises: [
      {
        title: 'Prone Knee Hangs for Full Extension',
        frequency: '5 minutes, 4 times daily',
        duration: '5 minutes',
        description: 'Lie face down with lower leg off edge of bed to achieve 0 degrees terminal extension.',
        target_phase: 'Phase 1: Hyperextension Protection',
      },
      {
        title: 'Isometric Hamstring Curls (0 to 45 degrees)',
        frequency: '10 reps, 3 times daily',
        duration: '10 minutes',
        description: 'Gentle submaximal co-contraction without dynamic resistance.',
        target_phase: 'Phase 1: Graft Conditioning',
      },
    ],
    precautions: [
      'Hinged knee brace locked in 0° extension during ambulation and sleep for 2 weeks.',
      'Partial weight-bearing with bilateral crutches (50% body weight limit).',
      'No open kinetic chain quadriceps extensions between 0° and 45° for 6 weeks.',
    ],
    warning_signs: [
      'Inability to achieve passive full extension by postoperative day 7.',
      'Excessive hemarthrosis or persistent intra-articular pressure.',
    ],
    raw_ocr_text: `ST. JUDE SPORTS MEDICINE — OPERATIVE SUMMARY
PATIENT: Priya Patel | AGE: 46 | DATE: 04/09/2026
PROCEDURE: Arthroscopic-assisted Right Anterior Cruciate Ligament Reconstruction.
GRAFT: Quadrupled Semitendinosus-Gracilis autograft (diameter 8.5mm).
FIXATION: Endobutton CL femoral cortical suspension, Biosure PK interference screw tibial.
STATUS: Graft tensioned at 20 lbs with complete impingement-free extension.`,
  },

  'rep-seed-4': {
    report_id: 'rep-seed-4',
    file_name: 'Omkar_Joshi_Shoulder_Arthroscopy_Discharge_Report.pdf',
    procedure: {
      name: 'Right Shoulder Arthroscopy & Rotator Cuff Tendon Repair',
      surgeon: 'Dr. Ananya Rao, MS Ortho',
      date: '2026-09-05',
      discharge_date: '2026-09-06',
      anesthesia: 'Interscalene nerve block with light endotracheal anesthesia',
      hospital: 'St. Jude Orthopaedic & Trauma Centre',
    },
    medications: [
      {
        name: 'Aceclofenac + Paracetamol',
        dosage: '100mg / 325mg PO',
        frequency: 'Twice daily after meals',
        duration: '7 days',
        instructions: 'Analgesic and anti-inflammatory coverage for subacromial decompression.',
        schedule: ['09:00 AM', '09:00 PM'],
      },
      {
        name: 'Thiocolchicoside',
        dosage: '4mg PO',
        frequency: 'Twice daily',
        duration: '5 days',
        instructions: 'Centrally-acting muscle relaxant to prevent trapezius spasm.',
        schedule: ['09:00 AM', '09:00 PM'],
      },
      {
        name: 'Pantoprazole Gastro-resistant',
        dosage: '40mg PO',
        frequency: 'Once daily before breakfast',
        duration: '10 days',
        instructions: 'Gastroprotection during NSAID therapy.',
        schedule: ['08:00 AM'],
      },
    ],
    exercises: [
      {
        title: 'Codman Pendulum Exercises',
        frequency: '5 minutes, 3 times daily',
        duration: '5 minutes',
        description: 'Lean forward supporting unaffected arm, let operative arm dangle passively; make gentle clock/counter-clockwise circles.',
        target_phase: 'Phase 1: Passive Gravitational Mobilization',
      },
      {
        title: 'Scapular Retraction & Pinch Sets',
        frequency: '10 repetitions, 3 times daily',
        duration: '5 minutes',
        description: 'Pull shoulder blades back and down together without shrugging, hold for 5 seconds.',
        target_phase: 'Phase 1: Periscapular Stabilization',
      },
      {
        title: 'Distal Extremity Pumps (Elbow, Wrist & Hand)',
        frequency: '15 repetitions every waking hour',
        duration: '5 minutes',
        description: 'Squeeze stress ball and perform wrist flexion/extension to mitigate dependent forearm edema.',
        target_phase: 'Phase 1: Edema Prevention',
      },
    ],
    precautions: [
      'Ultrasling abduction brace must be worn continuously for 4 weeks (removed only for hygiene and pendulums).',
      'Strictly NO active elevation, reaching, or internal rotation behind back.',
      'Sleep in recliner chair or semi-recumbent with pillow supporting operative elbow.',
      'Keep arthroscopic portal stab incisions sealed and clean.',
    ],
    warning_signs: [
      'Sudden onset motor weakness or persistent loss of sensation in right hand or radial fingers.',
      'Purulent discharge or focal warmth over anterior or lateral subacromial portals.',
      'Axillary body temperature exceeding 100.8°F (38.2°C).',
    ],
    raw_ocr_text: `ST. JUDE ORTHOPAEDIC & TRAUMA CENTRE — OPERATIVE DISCHARGE SUMMARY
PATIENT: Omkar Joshi | MRN: ORT-2026-1102 | AGE: 51 | SEX: M
ADMIT: 05/09/2026 | DISCHARGE: 06/09/2026
SURGEON: Dr. Ananya Rao, MS (Ortho)

OPERATIVE PROCEDURE:
Right Shoulder Arthroscopic Subacromial Decompression, Acromioplasty, and Double-Row Supraspinatus Rotator Cuff Anchor Repair (Healix Ti 4.5mm x2).

INTRACLINICAL FINDINGS:
Full-thickness 2.2cm tear of supraspinatus tendon with minimal muscle atrophy. Subacromial spurring with bursal fraying. Subscapularis and infraspinatus intact. Biceps tendon stable in groove.

POSTOPERATIVE PLAN:
1. Ultrasling with abduction pillow locked at 15 degrees abduction.
2. Passive pendulums and grip exercises started POD 1.
3. Suture check scheduled for POD 10.`,
  },

  'rep-seed-5': {
    report_id: 'rep-seed-5',
    file_name: 'Vikram_Singh_Inguinal_Hernia_Repair_Clinical_Summary.pdf',
    procedure: {
      name: 'Lichtenstein Tension-Free Right Inguinal Mesh Hernioplasty',
      surgeon: 'Dr. Rajesh Deshmukh, MS General Surgery',
      date: '2026-08-28',
      discharge_date: '2026-08-29',
      anesthesia: 'Spinal anesthesia with local ilioinguinal nerve block',
      hospital: 'St. Jude Surgical Pavilion',
    },
    medications: [
      {
        name: 'Amoxicillin-Clavulanate (Augmentin)',
        dosage: '625mg PO',
        frequency: 'Twice daily with meals',
        duration: '5 days',
        instructions: 'Prophylactic oral antimicrobial therapy.',
        schedule: ['08:00 AM', '08:00 PM'],
      },
      {
        name: 'Ibuprofen',
        dosage: '400mg PO',
        frequency: 'Every 8 hours as needed',
        duration: '5 days',
        instructions: 'Take after meals for postoperative incisional soreness.',
        schedule: ['02:00 PM', '10:00 PM'],
      },
      {
        name: 'Docusate Sodium',
        dosage: '100mg PO',
        frequency: 'Once daily at bedtime',
        duration: '7 days',
        instructions: 'Stool softener to prevent abdominal straining during bowel movements.',
        schedule: ['10:00 PM'],
      },
    ],
    exercises: [
      {
        title: 'Gentle Ambulation Intervals',
        frequency: '10 minutes, 4 times daily',
        duration: '10 minutes',
        description: 'Short walks on even terrain to facilitate intestinal motility and prevent atelectasis.',
        target_phase: 'Phase 1: Early Mobilization',
      },
      {
        title: 'Diaphragmatic Breathing without Valsalva',
        frequency: '5 deep breaths every 2 hours',
        duration: '5 minutes',
        description: 'Deep breathing supporting lower abdomen gently with a pillow.',
        target_phase: 'Phase 1: Pulmonary Recovery',
      },
    ],
    precautions: [
      'Strict weight limit: Do NOT lift, push, or pull anything weighing more than 5 kg (10 lbs) for 4 weeks.',
      'Splint groin incision firmly with hand or pillow when coughing, sneezing, or laughing.',
      'Avoid sudden bending at waist or vigorous abdominal muscle exertion.',
      'Keep surgical incision dressing dry; sponge baths only for 48 hours.',
    ],
    warning_signs: [
      'Acute urinary retention (inability to empty bladder within 8 hours).',
      'Rapidly enlarging, tense swelling or purple ecchymosis in the right scrotum or groin.',
      'Persistent temperature elevation above 101°F (38.3°C).',
    ],
    raw_ocr_text: `ST. JUDE SURGICAL PAVILION — DISCHARGE SUMMARY
PATIENT: Vikram Singh | MRN: SURG-2026-0871 | AGE: 62 | SEX: M
SURGERY DATE: 28/08/2026 | DISCHARGE DATE: 29/08/2026
SURGEON: Dr. Rajesh Deshmukh, MS (Gen Surg), FAIS

DIAGNOSIS: Direct Inguinal Hernia, Right Groin (Nyhus Type IIIa).
OPERATION: Right Lichtenstein Open Hernia Repair with Polypropylene Prolene Mesh (7.5 x 15 cm).

OPERATIVE NARRATIVE:
Oblique inguinal incision made. External oblique aponeurosis opened. Sac dissected cleanly off cord structures. Mesh secured with 2-0 Prolene to inguinal ligament and conjoint tendon without tension. Cord relocated; wound closed in layers with subcuticular Monocryl.

DISCHARGE INSTRUCTIONS:
- Wound clean, dry. Avoid lifting > 5kg for 4 weeks. High-fiber diet. Follow up in OPD in 10 days.`,
  },

  'rep-seed-6': {
    report_id: 'rep-seed-6',
    file_name: 'Meera_Iyer_Laparoscopic_Cholecystectomy_Pathology.pdf',
    procedure: {
      name: 'Four-Port Laparoscopic Cholecystectomy',
      surgeon: 'Dr. Rajesh Deshmukh, MS General Surgery',
      date: '2026-09-02',
      discharge_date: '2026-09-03',
      anesthesia: 'Balanced general endotracheal anesthesia',
      hospital: 'St. Jude Surgical Pavilion',
    },
    medications: [
      {
        name: 'Paracetamol',
        dosage: '650mg PO',
        frequency: 'Every 8 hours as needed',
        duration: '5 days',
        instructions: 'Primary oral analgesic for port-site discomfort.',
        schedule: ['08:00 AM', '04:00 PM', '10:00 PM'],
      },
      {
        name: 'Drotaverine HCl',
        dosage: '40mg PO',
        frequency: 'Twice daily PRN',
        duration: '3 days',
        instructions: 'Smooth muscle antispasmodic for transient abdominal cramping.',
        schedule: ['09:00 AM', '09:00 PM'],
      },
      {
        name: 'Rabeprazole',
        dosage: '20mg PO',
        frequency: 'Once daily before breakfast',
        duration: '14 days',
        instructions: 'Proton-pump inhibitor for gastric comfort during diet progression.',
        schedule: ['07:30 AM'],
      },
    ],
    exercises: [
      {
        title: 'Post-Op Light Walking Regimen',
        frequency: '15-20 minutes, twice daily',
        duration: '20 minutes',
        description: 'Brisk level indoor or garden walking to promote resorption of peritoneal insufflation CO2 gas.',
        target_phase: 'Phase 1: Ambulation & Gas Resorption',
      },
    ],
    precautions: [
      'Maintain a low-fat, easily digestible diet for 3 to 4 weeks following gallbladder excision.',
      'No strenuous lifting (> 10 kg) or high-impact aerobic exercise for 3 weeks.',
      'Keep umbilical and epigastric port dressings dry; shower after 72 hours with gentle patting dry.',
      'Avoid tight-waisted belts or restrictive clothing over trocar entry points.',
    ],
    warning_signs: [
      'Jaundice signs: yellowing of the eyes/skin, tea-colored urine, or pale clay-colored stools.',
      'Severe, intractable abdominal pain or distension not relieved by medication.',
      'Persistent vomiting, high fevers, or green-tinged bilious drainage from umbilical port.',
    ],
    raw_ocr_text: `ST. JUDE SURGICAL PAVILION — OPERATIVE & HISTOPATHOLOGY REPORT
PATIENT: Meera Iyer | MRN: SURG-2026-0914 | AGE: 35 | SEX: F
OPERATION DATE: 02/09/2026 | DISCHARGE: 03/09/2026
SURGEON: Dr. Rajesh Deshmukh, MS (Gen Surg)

PROCEDURE: Laparoscopic Cholecystectomy (Standard 4-Port Technique).
FINDINGS: Gallbladder with thickened wall containing multiple faceted cholesterol calculi (size 4-8mm). Critical view of safety achieved prior to clipping cystic duct and artery. Liver bed hemostatic.
HISTOPATHOLOGY: Chronic calculous cholecystitis with Rokitansky-Aschoff sinuses. No evidence of dysplasia or malignancy.`,
  },
};

export const STATIC_OCR_EXTRACTION = STATIC_OCR_EXTRACTION_MAP['rep-seed-1'];

// Helper to update extraction in-memory
export function updateStaticExtraction(reportId: string, updatedData: Partial<ExtractedClinicalReport>) {
  if (STATIC_OCR_EXTRACTION_MAP[reportId]) {
    STATIC_OCR_EXTRACTION_MAP[reportId] = {
      ...STATIC_OCR_EXTRACTION_MAP[reportId],
      ...updatedData,
      procedure: {
        ...STATIC_OCR_EXTRACTION_MAP[reportId].procedure,
        ...(updatedData.procedure || {}),
      },
    };
  }
}

