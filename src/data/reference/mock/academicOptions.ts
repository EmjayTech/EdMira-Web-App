import { AcademicOptions } from '../types';

/**
 * Bundled sign-up option lists — a copy of EdMira-Backend
 * src/reference/academic-options.ts (the source of truth; every value must
 * exist in the backend's enums or sign-up is rejected). Used while BACKEND.useMock.reference is on,
 * and as the fallback if the live endpoint can't be reached — sign-up must
 * never be blocked by a missing list.
 */
export const DEFAULT_ACADEMIC_OPTIONS: AcademicOptions = {
  institutions: [
    ...[
      'Ahmadu Bello University',
      'University of Abuja',
      'University of Benin',
      'University of Calabar',
      'University of Ibadan',
      'University of Ilorin',
      'University of Jos',
      'University of Lagos',
      'University of Nigeria, Nsukka',
      'University of Maiduguri',
      'University of Port Harcourt',
      'Usmanu Danfodiyo University',
      'Nnamdi Azikiwe University',
      'Obafemi Awolowo University',
      'University of Uyo',
    ].map(name => ({ name, category: 'federal' as const })),
    ...[
      'Lagos State University',
      'Abia State University, Uturu',
      'Ambrose Alli University, Ekpoma',
      'Benue State University, Makurdi',
    ].map(name => ({ name, category: 'state' as const })),
  ],
  faculties: [
    'Faculty of Clinical Sciences',
    'Faculty of Basic Medical Sciences',
    'Faculty of Dental Sciences',
    'School of Nursing Science',
    'School of Allied Health Sciences',
    'Institute of Public Health',
    'Faculty of Pharmacy',
    'Faculty of Biomedical Sciences',
    'Others',
  ],
  departments: [
    'Medicine & Surgery (MBBS)',
    'Dentistry (BDS)',
    'Anatomy',
    'Biochemistry',
    'Physiology',
    'Pharmacology',
    'Pharmacy',
    'Radiography',
    'Nursing Science',
    'Physiotherapy',
    'Public Health',
    'Biomedical engineering',
    'School/College of Nursing',
    'Medical Laboratory Science',
    'Community Medicine',
    'Haematology',
    'Others',
  ],
  programmes: [
    {
      type: 'Undergraduate',
      levels: ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', '600 Level'],
    },
    {
      type: 'Postgraduate',
      levels: [
        'Master of Science (M.Sc.)',
        'Master of Philosophy (M.Phil.)',
        'Doctor of Philosophy (Ph.D.)',
        'Higher Doctorates',
      ],
    },
  ],
};
