// BMSCE-specific sample data. Everything here is dummy data for frontend development.
// Replace names, offices and services with the real ones before any real use.

export const CAMPUS = {
  short: 'BMSCE',
  name: 'BMS College of Engineering',
  place: 'Basavanagudi, Bengaluru',
  domain: 'bmsce.ac.in',
};

export const BRANCHES = [
  { code: 'CS', name: 'Computer Science and Engineering' },
  { code: 'IS', name: 'Information Science and Engineering' },
  { code: 'EC', name: 'Electronics and Communication Engineering' },
  { code: 'EE', name: 'Electrical and Electronics Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'CV', name: 'Civil Engineering' },
  { code: 'AI', name: 'Artificial Intelligence and Machine Learning' },
  { code: 'CH', name: 'Chemical Engineering' },
  { code: 'BT', name: 'Biotechnology' },
];

// Sample USN format: 1BM + admission year + branch code + roll number
export const USN_PATTERN = /^1BM\d{2}[A-Z]{2}\d{3}$/i;

export const DEPARTMENTS = [
  { id: 'exam', name: 'Examination Section', head: 'Controller of Examinations' },
  { id: 'accounts', name: 'Accounts Section', head: 'Accounts Officer' },
  { id: 'library', name: 'Central Library', head: 'Librarian' },
  { id: 'hostel', name: 'Hostel Office', head: 'Chief Warden' },
  { id: 'placement', name: 'Placement & Training', head: 'Placement Officer' },
  { id: 'estate', name: 'Estate & Maintenance', head: 'Estate Officer' },
  { id: 'academics', name: 'Dean – Academics', head: 'Dean Academics' },
  { id: 'students', name: 'Dean – Student Affairs', head: 'Dean Student Affairs' },
  { id: 'hod-cse', name: 'CSE Department Office', head: 'HOD, CSE' },
];

export const SERVICE_TYPES = {
  document: {
    label: 'Document verification',
    blurb: 'Certificates and document copies',
    items: [
      { id: 'bonafide', name: 'Bonafide certificate', dept: 'academics', days: 2 },
      { id: 'study', name: 'Study / conduct certificate', dept: 'academics', days: 3 },
      { id: 'marks', name: 'Marks card copy', dept: 'exam', days: 5 },
      { id: 'transcript', name: 'Transcript', dept: 'exam', days: 7 },
      { id: 'feereceipt', name: 'Fee receipt (duplicate)', dept: 'accounts', days: 2 },
      { id: 'docverify', name: 'Original document verification', dept: 'academics', days: 3 },
    ],
  },
  service: {
    label: 'Student service',
    blurb: 'Cards, passes, no-dues and more',
    items: [
      { id: 'idcard', name: 'ID card reissue', dept: 'students', days: 4 },
      { id: 'nodues', name: 'Library no-dues', dept: 'library', days: 2 },
      { id: 'hostelchange', name: 'Hostel room change', dept: 'hostel', days: 5 },
      { id: 'busfee', name: 'Bus pass / transport', dept: 'students', days: 3 },
      { id: 'placecert', name: 'Placement documents', dept: 'placement', days: 3 },
    ],
  },
  complaint: {
    label: 'Complaint',
    blurb: 'Raise an issue with an office',
    items: [
      { id: 'academic', name: 'Academic complaint', dept: 'academics', days: 5 },
      { id: 'hostelc', name: 'Hostel complaint', dept: 'hostel', days: 3 },
      { id: 'fees', name: 'Fee / accounts query', dept: 'accounts', days: 3 },
      { id: 'general', name: 'General grievance', dept: 'students', days: 5 },
    ],
  },
  maintenance: {
    label: 'Maintenance',
    blurb: 'Report a fault on campus',
    items: [
      { id: 'classroom', name: 'Classroom / lab fault', dept: 'estate', days: 3 },
      { id: 'hostelm', name: 'Hostel maintenance', dept: 'estate', days: 3 },
      { id: 'washroom', name: 'Washroom / water', dept: 'estate', days: 2 },
      { id: 'wifi', name: 'Wi-Fi / network', dept: 'estate', days: 2 },
    ],
  },
};

export const LOCATIONS = [
  'Main Block', 'CSE Block', 'ISE Block', 'Library', 'Auditorium', 'Canteen',
  'Boys Hostel', 'Girls Hostel', 'Sports Ground', 'Other',
];

export const STATUSES = ['Submitted', 'Assigned', 'In review', 'Resolved', 'Rejected'];

export const statusTone = (s) =>
  ({ Submitted: '', Assigned: 'info', 'In review': 'warn', Resolved: 'ok', Rejected: 'bad' }[s] || '');

export const DEMO_USERS = [
  { id: 'u1', role: 'student', name: 'Aarav Rao', usn: '1BM24CS001', email: 'aarav.cs24@bmsce.ac.in', branch: 'CS', sem: 3, password: 'demo123' },
  { id: 'u2', role: 'staff', name: 'Mrs. Kavitha S', email: 'kavitha@bmsce.ac.in', dept: 'academics', title: 'Office Superintendent', password: 'demo123' },
  { id: 'u3', role: 'admin', name: 'Admin', email: 'admin@bmsce.ac.in', title: 'System Administrator', password: 'demo123' },
];

export const OTHER_STUDENTS = [
  { id: 's2', name: 'Meera Nair', usn: '1BM24IS014', branch: 'IS', sem: 3 },
  { id: 's3', name: 'Rohan Gowda', usn: '1BM23EC052', branch: 'EC', sem: 5 },
  { id: 's4', name: 'Sneha Iyer', usn: '1BM22ME031', branch: 'ME', sem: 7 },
];

const d = (n) => new Date(Date.now() - n * 864e5).toISOString();

export const SEED_REQUESTS = [
  {
    id: 'UNI-1042', type: 'document', item: 'bonafide', title: 'Bonafide certificate',
    dept: 'academics', studentId: 'u1', studentName: 'Aarav Rao', usn: '1BM24CS001',
    details: 'Needed for a scholarship application.', status: 'In review', createdAt: d(2),
    assignee: 'u2', comments: [{ by: 'Mrs. Kavitha S', text: 'Verifying details with the admissions record.', at: d(1) }],
    timeline: [{ s: 'Submitted', at: d(2) }, { s: 'Assigned', at: d(2) }, { s: 'In review', at: d(1) }],
  },
  {
    id: 'UNI-1038', type: 'maintenance', item: 'classroom', title: 'Projector not working',
    dept: 'estate', studentId: 'u1', studentName: 'Aarav Rao', usn: '1BM24CS001',
    details: 'Projector in the room does not power on.', location: 'CSE Block', status: 'Assigned', createdAt: d(4),
    assignee: null, comments: [],
    timeline: [{ s: 'Submitted', at: d(4) }, { s: 'Assigned', at: d(3) }],
  },
  {
    id: 'UNI-1021', type: 'service', item: 'nodues', title: 'Library no-dues',
    dept: 'library', studentId: 'u1', studentName: 'Aarav Rao', usn: '1BM24CS001',
    details: 'Semester end clearance.', status: 'Resolved', createdAt: d(12),
    assignee: null, comments: [{ by: 'Library', text: 'No dues pending. Certificate issued.', at: d(10) }],
    timeline: [{ s: 'Submitted', at: d(12) }, { s: 'Assigned', at: d(12) }, { s: 'In review', at: d(11) }, { s: 'Resolved', at: d(10) }],
  },
  {
    id: 'UNI-1045', type: 'document', item: 'marks', title: 'Marks card copy',
    dept: 'exam', studentId: 's2', studentName: 'Meera Nair', usn: '1BM24IS014',
    details: 'Second semester marks card copy.', status: 'Submitted', createdAt: d(1),
    assignee: null, comments: [], timeline: [{ s: 'Submitted', at: d(1) }],
  },
  {
    id: 'UNI-1044', type: 'complaint', item: 'hostelc', title: 'Hostel complaint',
    dept: 'hostel', studentId: 's3', studentName: 'Rohan Gowda', usn: '1BM23EC052',
    details: 'Water supply is irregular in the evenings.', status: 'Assigned', createdAt: d(1),
    assignee: null, comments: [], timeline: [{ s: 'Submitted', at: d(1) }, { s: 'Assigned', at: d(1) }],
  },
  {
    id: 'UNI-1030', type: 'maintenance', item: 'wifi', title: 'Wi-Fi / network',
    dept: 'estate', studentId: 's4', studentName: 'Sneha Iyer', usn: '1BM22ME031',
    details: 'No signal in the reading hall.', location: 'Library', status: 'In review', createdAt: d(9),
    assignee: null, comments: [], timeline: [{ s: 'Submitted', at: d(9) }, { s: 'Assigned', at: d(8) }, { s: 'In review', at: d(6) }],
  },
];

export const HELP_CATEGORIES = ['Documents', 'Academics', 'Maintenance', 'Administration', 'Technical', 'Campus', 'General'];

export const SEED_POSTS = [
  {
    id: 'p1', category: 'Documents', author: 'Meera Nair', role: 'student', createdAt: d(3), votes: 14, voted: false,
    title: 'How long does a bonafide certificate usually take?',
    body: 'I need one for a bank education loan. Is the request portal faster than visiting the office?',
    suggest: 'bonafide', accepted: 'a1',
    answers: [
      { id: 'a1', author: 'Rohan Gowda', role: 'student', votes: 9, voted: false, createdAt: d(3), text: 'Took me two working days through the portal. Carry the printed copy to the office for the stamp.' },
      { id: 'a2', author: 'Mrs. Kavitha S', role: 'staff', votes: 4, voted: false, createdAt: d(2), text: 'Standard processing is two working days. Mention the purpose in the request so we can word it correctly.' },
    ],
  },
  {
    id: 'p2', category: 'Academics', author: 'Sneha Iyer', role: 'student', createdAt: d(5), votes: 8, voted: false,
    title: 'Where do I find the revaluation schedule?',
    body: 'Results are out but I cannot find the revaluation dates anywhere.',
    suggest: null, accepted: null,
    answers: [{ id: 'a3', author: 'Aarav Rao', role: 'student', votes: 3, voted: false, createdAt: d(4), text: 'It is usually posted on the examination notice board and the college website a day after results.' }],
  },
  {
    id: 'p3', category: 'Technical', author: 'Aarav Rao', role: 'student', createdAt: d(1), votes: 5, voted: false,
    title: 'Campus Wi-Fi keeps disconnecting in the library',
    body: 'Anyone else facing this? It drops every few minutes on the second floor.',
    suggest: 'wifi', accepted: null, answers: [],
  },
];

export const SEED_AVAILABILITY = [
  { id: 'av1', name: 'Principal', place: 'Administrative Block', status: 'Unavailable', note: 'In a board meeting', updatedAt: new Date(Date.now() - 25 * 60e3).toISOString(), next: 'Today, 3:30 PM' },
  { id: 'av2', name: 'Dean – Academics', place: 'Main Block', status: 'Available', note: 'Open for walk-ins', updatedAt: new Date(Date.now() - 10 * 60e3).toISOString(), next: null },
  { id: 'av3', name: 'Dean – Student Affairs', place: 'Main Block', status: 'Tentative', note: 'May be called to a meeting', updatedAt: new Date(Date.now() - 50 * 60e3).toISOString(), next: 'Today, 2:00 PM' },
  { id: 'av4', name: 'HOD, CSE', place: 'CSE Block', status: 'Available', note: '', updatedAt: new Date(Date.now() - 5 * 60e3).toISOString(), next: null },
  { id: 'av5', name: 'Examination Section', place: 'Main Block', status: 'Available', note: 'Counter open 10 AM – 4 PM', updatedAt: new Date(Date.now() - 90 * 60e3).toISOString(), next: null },
  { id: 'av6', name: 'Accounts Section', place: 'Main Block', status: 'Unavailable', note: 'Closed for audit', updatedAt: new Date(Date.now() - 120 * 60e3).toISOString(), next: 'Tomorrow, 10:00 AM' },
];

export const SEED_NOTIFICATIONS = [
  { id: 'n1', userId: 'u1', text: 'UNI-1042 is now in review.', at: d(1), read: false },
  { id: 'n2', userId: 'u1', text: 'UNI-1021 was resolved. Your no-dues certificate is ready.', at: d(10), read: true },
];

export const timeAgo = (iso) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso)) / 1000));
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export const initials = (name = '') =>
  name.replace(/^(Mrs?|Dr|Prof)\.?\s+/i, '').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
