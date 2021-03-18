const regCodes = [
  {
    regCode: 'AA',
    regName: 'Academic Affairs',
  },
  {
    regCode: 'ACC',
    regName: 'Accountancy',
  },
  {
    regCode: 'AER',
    regName: 'Aeronautics',
  },
  {
    regCode: 'AES',
    regName: 'Aerospace Studies',
  },
  {
    regCode: 'ACE',
    regName: 'American Culture & English Prg',
  },
  {
    regCode: 'AMS',
    regName: 'American Studies',
  },
  {
    regCode: 'ATH',
    regName: 'Anthropology',
  },
  {
    regCode: 'APC',
    regName: 'Applied Communication',
  },
  {
    regCode: 'ASO',
    regName: 'Applied Social Science',
  },
  {
    regCode: 'ARB',
    regName: 'Arabic',
  },
  {
    regCode: 'ARC',
    regName: 'Architecture & Interior Design',
  },
  {
    regCode: 'ART',
    regName: 'Art',
  },
  {
    regCode: 'AAA',
    regName: 'Asian/Asian American Studies',
  },
  {
    regCode: 'BSC',
    regName: 'Biological Sciences',
  },
  {
    regCode: 'BIO',
    regName: 'Biology',
  },
  {
    regCode: 'BWS',
    regName: 'Black World Studies',
  },
  {
    regCode: 'BOT',
    regName: 'Botany',
  },
  {
    regCode: 'BUS',
    regName: 'Business Analysis',
  },
  {
    regCode: 'BLS',
    regName: 'Business Legal Studies',
  },
  {
    regCode: 'BTE',
    regName: 'Business Technology',
  },
  {
    regCode: 'CPB',
    regName: 'Chem, Paper & Biomed Engineer',
  },
  {
    regCode: 'CPE',
    regName: 'Chemical & Paper Engineering',
  },
  {
    regCode: 'CHM',
    regName: 'Chemistry & Biochemistry',
  },
  {
    regCode: 'CHI',
    regName: 'Chinese',
  },
  {
    regCode: 'CRD',
    regName: 'Civic and Regional Development',
  },
  {
    regCode: 'CLS',
    regName: 'Classics',
  },
  {
    regCode: 'CEC',
    regName: 'Col of Engineering & Computing',
  },
  {
    regCode: 'CAS',
    regName: 'College of Arts and Science',
  },
  {
    regCode: 'CCA',
    regName: 'College of Creative Arts',
  },
  {
    regCode: 'CMR',
    regName: 'Commerce',
  },
  {
    regCode: 'COM',
    regName: 'Communication',
  },
  {
    regCode: 'CMA',
    regName: 'Community Arts',
  },
  {
    regCode: 'CIT',
    regName: 'Comp & Information Technology',
  },
  {
    regCode: 'CSE',
    regName: 'Comp Sci &Software Engineering',
  },
  {
    regCode: 'CMS',
    regName: 'Comparative Media Studies',
  },
  {
    regCode: 'CJS',
    regName: 'Criminal Justice Studies',
  },
  {
    regCode: 'CRE',
    regName: 'Critical Race & Ethnic Studies',
  },
  {
    regCode: 'DSC',
    regName: 'Decision Sciences',
  },
  {
    regCode: 'DST',
    regName: 'Disability Studies',
  },
  {
    regCode: 'ECO',
    regName: 'Economics',
  },
  {
    regCode: 'EHS',
    regName: 'Education, Health and Society',
  },
  {
    regCode: 'EDL',
    regName: 'Educational Leadership',
  },
  {
    regCode: 'EDP',
    regName: 'Educational Psychology',
  },
  {
    regCode: 'ECE',
    regName: 'Electrical & Computer Engineer',
  },
  {
    regCode: 'IMS',
    regName: 'Emerging Tech: Business&Design',
  },
  {
    regCode: 'EAS',
    regName: 'Engineering & App Science',
  },
  {
    regCode: 'EGM',
    regName: 'Engineering Management',
  },
  {
    regCode: 'ENT',
    regName: 'Engineering Technology',
  },
  {
    regCode: 'ENG',
    regName: 'English',
  },
  {
    regCode: 'EGS',
    regName: 'English Studies',
  },
  {
    regCode: 'ESP',
    regName: 'Entrepreneurship',
  },
  {
    regCode: 'ENV',
    regName: 'Environmental Science',
  },
  {
    regCode: 'IES',
    regName: 'Environmental Sciences',
  },
  {
    regCode: 'FSW',
    regName: 'Family Science and Social Work',
  },
  {
    regCode: 'FAS',
    regName: 'Fashion Design',
  },
  {
    regCode: 'FST',
    regName: 'Film Studies',
  },
  {
    regCode: 'FIN',
    regName: 'Finance',
  },
  {
    regCode: 'FRE',
    regName: 'French',
  },
  {
    regCode: 'GEO',
    regName: 'Geography',
  },
  {
    regCode: 'GLG',
    regName: 'Geology',
  },
  {
    regCode: 'GER',
    regName: 'German',
  },
  {
    regCode: 'GTY',
    regName: 'Gerontology',
  },
  {
    regCode: 'GIC',
    regName: 'Global & Intercultural Studies',
  },
  {
    regCode: 'GHS',
    regName: 'Global Health Studies',
  },
  {
    regCode: 'GSC',
    regName: 'Graduate School Community',
  },
  {
    regCode: 'GRK',
    regName: 'Greek Language and Literature',
  },
  {
    regCode: 'HBW',
    regName: 'Hebrew',
  },
  {
    regCode: 'HIN',
    regName: 'Hindi',
  },
  {
    regCode: 'HST',
    regName: 'History',
  },
  {
    regCode: 'HON',
    regName: 'Honors',
  },
  {
    regCode: 'HUM',
    regName: 'Humanities Center',
  },
  {
    regCode: 'ISA',
    regName: 'Information Systems& Analytics',
  },
  {
    regCode: 'LR',
    regName: 'Inst Learning in Retirement',
  },
  {
    regCode: 'BIS',
    regName: 'Integrative Studies',
  },
  {
    regCode: 'IDS',
    regName: 'Interdisciplinary',
  },
  {
    regCode: 'ITS',
    regName: 'International Studies',
  },
  {
    regCode: 'ITL',
    regName: 'Italian',
  },
  {
    regCode: 'JPN',
    regName: 'Japanese',
  },
  {
    regCode: 'JRN',
    regName: 'Journalism',
  },
  {
    regCode: 'KNH',
    regName: 'Kinesiology,Nutrition & Health',
  },
  {
    regCode: 'KOR',
    regName: 'Korean',
  },
  {
    regCode: 'LAS',
    regName: 'Latin American Studies',
  },
  {
    regCode: 'LAT',
    regName: 'Latin Language & Literature',
  },
  {
    regCode: 'LST',
    regName: 'Liberal Studies',
  },
  {
    regCode: 'LUX',
    regName: 'Luxembourg',
  },
  {
    regCode: 'MGT',
    regName: 'Management',
  },
  {
    regCode: 'MKT',
    regName: 'Marketing',
  },
  {
    regCode: 'MTH',
    regName: 'Mathematics',
  },
  {
    regCode: 'MME',
    regName: 'Mechan & Manufact Engineering',
  },
  {
    regCode: 'MAC',
    regName: 'Media and Culture',
  },
  {
    regCode: 'MJF',
    regName: 'Media, Journalism & Film',
  },
  {
    regCode: 'MBI',
    regName: 'Microbiology',
  },
  {
    regCode: 'MSC',
    regName: 'Military Science',
  },
  {
    regCode: 'MUS',
    regName: 'Music',
  },
  {
    regCode: 'NSC',
    regName: 'Naval Science',
  },
  {
    regCode: 'NCS',
    regName: 'Nonprofit & Community Studies',
  },
  {
    regCode: 'NSG',
    regName: 'Nursing',
  },
  {
    regCode: 'ORG',
    regName: 'Organizational Leadership',
  },
  {
    regCode: 'PCE',
    regName: 'Paper & Chemical Engineering',
  },
  {
    regCode: 'PHL',
    regName: 'Philosophy',
  },
  {
    regCode: 'PHY',
    regName: 'Physics',
  },
  {
    regCode: 'POL',
    regName: 'Political Science',
  },
  {
    regCode: 'POR',
    regName: 'Portuguese',
  },
  {
    regCode: 'PLW',
    regName: 'Pre-Law Studies',
  },
  {
    regCode: 'PMD',
    regName: 'Premedical Studies',
  },
  {
    regCode: 'CPS',
    regName: 'Prof Studies & Appl Sciences',
  },
  {
    regCode: 'PSS',
    regName: 'Psychological Science',
  },
  {
    regCode: 'PSY',
    regName: 'Psychology',
  },
  {
    regCode: 'REL',
    regName: 'Religion, Comparative',
  },
  {
    regCode: 'RUS',
    regName: 'Russian',
  },
  {
    regCode: 'SCA',
    regName: 'School of Creative Arts',
  },
  {
    regCode: 'SJS',
    regName: 'Social Justice Studies',
  },
  {
    regCode: 'SOC',
    regName: 'Sociology',
  },
  {
    regCode: 'SPN',
    regName: 'Spanish',
  },
  {
    regCode: 'SPA',
    regName: 'Speech Pathology & Audiology',
  },
  {
    regCode: 'SLM',
    regName: 'Sport Leadership & Management',
  },
  {
    regCode: 'STA',
    regName: 'Statistics',
  },
  {
    regCode: 'STC',
    regName: 'Strategic Communication',
  },
  {
    regCode: 'EDT',
    regName: 'Teacher Education',
  },
  {
    regCode: 'THE',
    regName: 'Theatre',
  },
  {
    regCode: 'UNV',
    regName: 'University',
  },
  {
    regCode: 'WST',
    regName: 'Western Program',
  },
  {
    regCode: 'WGS',
    regName: 'Women,Gender&Sexuality Studies',
  },
  {
    regCode: 'ZOO',
    regName: 'Zoology',
  },
];
module.exports = regCodes;
