import { Course, Question, StudyResource, Topic } from '@/data/learning/types';

/**
 * Sample MVP catalog used while the content backend is not available.
 *
 * NOTE: this content has NOT been through EdMira's medical review workflow.
 * The app labels it as sample content. Replace with the approved question
 * bank from the API before beta.
 */

/** `forYou` is added by the mock repository (every sample course is for everyone). */
export const COURSES: Omit<Course, 'forYou'>[] = [
  {
    id: 'anatomy',
    title: 'Anatomy',
    code: 'ANA',
    color: '#0A369D',
    description:
      'Structure of the human body — upper limb, thorax and head & neck essentials.',
    status: 'published',
  },
  {
    id: 'physiology',
    title: 'Physiology',
    code: 'PHY',
    color: '#0F766E',
    description:
      'How organ systems work — cardiovascular, renal and respiratory physiology.',
    status: 'published',
  },
  {
    id: 'biochemistry',
    title: 'Biochemistry',
    code: 'BCH',
    color: '#7C3AED',
    description:
      'Metabolism, enzymes and vitamins that underpin clinical medicine.',
    status: 'published',
  },
  {
    id: 'pharmacology',
    title: 'Pharmacology',
    code: 'PHA',
    color: '#C2410C',
    description:
      'Principles of drug action, autonomic drugs and antimicrobials.',
    status: 'published',
  },
  {
    id: 'pathology',
    title: 'Pathology',
    code: 'PAT',
    color: '#BE123C',
    description: 'Mechanisms of disease.',
    // Not yet published — must not be shown to students (US-05).
    status: 'draft',
  },
];

const topic = (
  courseId: string,
  id: string,
  order: number,
  title: string,
  summary: string,
  readMinutes: number,
  material: Topic['material'],
): Topic => ({
  id,
  courseId,
  order,
  title,
  summary,
  readMinutes,
  material,
  status: 'published',
});

export const TOPICS: Topic[] = [
  // ── Anatomy ────────────────────────────────────────────────────────────────
  topic('anatomy', 'ana-brachial-plexus', 1, 'Brachial Plexus',
    'Roots, trunks and the classic nerve injuries of the upper limb.', 6, [
      {
        heading: 'Overview',
        body: 'The brachial plexus is formed by the anterior rami of C5–T1. It is organised as roots, trunks, divisions, cords and terminal branches, and supplies the skin and muscles of the upper limb.',
        keyPoints: [
          'Roots: C5, C6, C7, C8, T1',
          'Trunks: upper (C5–6), middle (C7), lower (C8–T1)',
          'Cords are named by their relation to the axillary artery',
        ],
      },
      {
        heading: 'Terminal branches',
        body: 'Five terminal branches arise from the cords: musculocutaneous, axillary, radial, median and ulnar nerves.',
        keyPoints: [
          'Axillary nerve — deltoid, teres minor; at risk in surgical neck fractures',
          'Radial nerve — extensors; at risk in midshaft humerus fractures (wrist drop)',
          'Ulnar nerve — most intrinsic hand muscles (claw hand)',
          'Median nerve — thenar muscles (ape hand, carpal tunnel)',
        ],
      },
      {
        heading: 'Plexus injuries',
        body: "Upper trunk injury (Erb's palsy, C5–C6) gives the \"waiter's tip\" posture. Lower trunk injury (Klumpke's palsy, C8–T1) affects the intrinsic hand muscles and may cause claw hand.",
      },
    ]),
  topic('anatomy', 'ana-heart', 2, 'Anatomy of the Heart',
    'Chambers, valves, conducting system and coronary circulation.', 7, [
      {
        heading: 'Chambers and surfaces',
        body: 'The heart has four chambers. The sternocostal (anterior) surface is formed mainly by the right ventricle, which makes it the most anterior chamber.',
      },
      {
        heading: 'Valves',
        body: 'Atrioventricular valves (tricuspid on the right, mitral on the left) separate atria from ventricles. Semilunar valves (pulmonary and aortic) guard the outflow tracts.',
        keyPoints: [
          'Tricuspid: right atrium → right ventricle',
          'Mitral (bicuspid): left atrium → left ventricle',
        ],
      },
      {
        heading: 'Conducting system and blood supply',
        body: 'The sinoatrial node lies in the wall of the right atrium near the opening of the superior vena cava. The left coronary artery divides into the left anterior descending and circumflex arteries. Most cardiac veins drain into the coronary sinus.',
      },
    ]),
  topic('anatomy', 'ana-cranial-nerves', 3, 'Cranial Nerves',
    'Functions and foramina of the twelve cranial nerves.', 8, [
      {
        heading: 'Eye movements',
        body: 'Most extraocular muscles are supplied by the oculomotor nerve (CN III). The exceptions are superior oblique (trochlear, CN IV) and lateral rectus (abducens, CN VI).',
        keyPoints: ['Memory aid: LR6 SO4, the rest 3'],
      },
      {
        heading: 'Face and tongue',
        body: 'The mandibular division of the trigeminal nerve (V3) supplies the muscles of mastication. Taste from the anterior two-thirds of the tongue travels in the chorda tympani, a branch of the facial nerve (CN VII).',
      },
      {
        heading: 'Skull foramina',
        body: 'The glossopharyngeal (IX), vagus (X) and accessory (XI) nerves leave the skull through the jugular foramen. The hypoglossal nerve (XII) uses the hypoglossal canal.',
      },
    ]),

  // ── Physiology ─────────────────────────────────────────────────────────────
  topic('physiology', 'phy-cardiac-cycle', 1, 'The Cardiac Cycle',
    'Pressure and volume changes, heart sounds and cardiac output.', 7, [
      {
        heading: 'Phases',
        body: 'Each cycle has systole (isovolumetric contraction, ejection) and diastole (isovolumetric relaxation, filling). During the isovolumetric phases all four valves are closed.',
      },
      {
        heading: 'Heart sounds',
        body: 'S1 is caused by closure of the atrioventricular (mitral and tricuspid) valves at the start of systole. S2 is caused by closure of the aortic and pulmonary valves.',
      },
      {
        heading: 'Cardiac output',
        body: 'Cardiac output = heart rate × stroke volume. A typical resting stroke volume is about 70 mL, giving an output of about 5 L/min at 70 beats per minute.',
        keyPoints: ['JVP a wave = atrial contraction'],
      },
    ]),
  topic('physiology', 'phy-renal', 2, 'Renal Physiology',
    'Filtration, tubular reabsorption and hormonal control.', 8, [
      {
        heading: 'Glomerular filtration',
        body: 'Normal GFR is about 125 mL/min (about 180 L/day). The macula densa in the distal tubule senses NaCl delivery and helps regulate GFR through tubuloglomerular feedback.',
      },
      {
        heading: 'Tubular handling',
        body: 'The proximal convoluted tubule reabsorbs most filtered sodium, water, and almost all filtered glucose and amino acids.',
      },
      {
        heading: 'Hormonal control',
        body: 'ADH inserts aquaporin-2 channels in the collecting duct, increasing water reabsorption. Aldosterone increases sodium reabsorption and potassium secretion in the distal nephron.',
      },
    ]),
  topic('physiology', 'phy-respiratory', 3, 'Respiratory Physiology',
    'Lung volumes, control of breathing and oxygen transport.', 7, [
      {
        heading: 'Lung volumes',
        body: 'Tidal volume at rest is about 500 mL. Residual volume is the air left after maximal expiration and cannot be measured by simple spirometry.',
      },
      {
        heading: 'Control of breathing',
        body: 'In healthy people the main chemical drive to breathe is arterial PCO₂, sensed mainly by central chemoreceptors through changes in CSF H⁺.',
      },
      {
        heading: 'Oxygen transport',
        body: 'Surfactant from type II pneumocytes reduces alveolar surface tension. The oxygen–haemoglobin curve shifts right with increased CO₂, H⁺, temperature and 2,3-BPG.',
      },
    ]),

  // ── Biochemistry ───────────────────────────────────────────────────────────
  topic('biochemistry', 'bch-glycolysis', 1, 'Glycolysis',
    'Steps, regulation and energy yield of glucose breakdown.', 6, [
      {
        heading: 'Overview',
        body: 'Glycolysis converts glucose to pyruvate in the cytoplasm. Under anaerobic conditions pyruvate is reduced to lactate, regenerating NAD⁺.',
      },
      {
        heading: 'Regulation',
        body: 'Phosphofructokinase-1 (PFK-1) is the rate-limiting enzyme. Hexokinase and pyruvate kinase are the other irreversible steps.',
      },
      {
        heading: 'Energy and clinical links',
        body: 'Anaerobic glycolysis gives a net 2 ATP per glucose. Red cells depend on glycolysis, so pyruvate kinase deficiency causes haemolytic anaemia.',
      },
    ]),
  topic('biochemistry', 'bch-enzymes', 2, 'Enzymes & Kinetics',
    'How enzymes work and how inhibitors change their kinetics.', 6, [
      {
        heading: 'How enzymes work',
        body: 'Enzymes speed up reactions by lowering the activation energy. They do not change the equilibrium of the reaction.',
      },
      {
        heading: 'Michaelis–Menten kinetics',
        body: 'Km is the substrate concentration at which the reaction rate is half of Vmax. A lower Km means higher affinity. Allosteric enzymes show sigmoidal rather than hyperbolic kinetics.',
      },
      {
        heading: 'Inhibition',
        body: 'Competitive inhibitors raise Km without changing Vmax. Non-competitive inhibitors lower Vmax without changing Km.',
      },
    ]),
  topic('biochemistry', 'bch-vitamins', 3, 'Vitamins',
    'Functions and deficiency states of key vitamins.', 5, [
      {
        heading: 'Water-soluble vitamins',
        body: 'Thiamine (B1) deficiency causes beriberi and Wernicke encephalopathy. Niacin (B3) deficiency causes pellagra. Vitamin C deficiency causes scurvy.',
      },
      {
        heading: 'Fat-soluble vitamins',
        body: 'Vitamin A deficiency causes night blindness. Vitamin K is required for γ-carboxylation of clotting factors II, VII, IX and X.',
      },
    ]),

  // ── Pharmacology ───────────────────────────────────────────────────────────
  topic('pharmacology', 'pha-pharmacokinetics', 1, 'Pharmacokinetics',
    'Absorption, distribution, metabolism and elimination.', 7, [
      {
        heading: 'Bioavailability',
        body: 'Bioavailability is the fraction of a dose that reaches the systemic circulation unchanged. It is 100% for intravenous drugs. Oral drugs may undergo first-pass metabolism, mainly in the liver.',
      },
      {
        heading: 'Distribution and dosing',
        body: 'The loading dose depends on the volume of distribution. Steady state is reached after about 4–5 half-lives of regular dosing.',
      },
      {
        heading: 'Elimination kinetics',
        body: 'Most drugs follow first-order kinetics. A few, such as ethanol, follow zero-order kinetics — a constant amount is eliminated per unit time.',
      },
    ]),
  topic('pharmacology', 'pha-autonomic', 2, 'Autonomic Drugs',
    'Cholinergic and adrenergic agonists and antagonists.', 7, [
      {
        heading: 'Cholinergic drugs',
        body: 'Atropine is a muscarinic antagonist. Organophosphates inhibit acetylcholinesterase; poisoning is treated with atropine and pralidoxime.',
      },
      {
        heading: 'Adrenergic drugs',
        body: 'Salbutamol is a β2 agonist used in asthma. Propranolol is a non-selective β blocker. Intramuscular adrenaline is the first-line treatment for anaphylaxis.',
      },
    ]),
  topic('pharmacology', 'pha-antimicrobials', 3, 'Antimicrobials',
    'Mechanisms and important adverse effects of antibiotics.', 6, [
      {
        heading: 'Mechanisms',
        body: 'β-lactams such as penicillins inhibit bacterial cell wall synthesis. Aminoglycosides inhibit the 30S ribosomal subunit.',
      },
      {
        heading: 'Adverse effects to remember',
        body: 'Aminoglycosides are nephrotoxic and ototoxic. Chloramphenicol can cause grey baby syndrome. Rifampicin turns body fluids red-orange. Metronidazole with alcohol causes a disulfiram-like reaction.',
      },
    ]),
];

const q = (
  topicId: string,
  n: number,
  stem: string,
  options: string[],
  answerIndex: number,
  explanation: string,
): Question => ({
  id: `${topicId}-q${n}`,
  topicId,
  stem,
  options,
  answerIndex,
  explanation,
  status: 'published',
});

export const QUESTIONS: Question[] = [
  // Brachial plexus
  q('ana-brachial-plexus', 1, 'The brachial plexus is formed by the anterior rami of which spinal nerves?',
    ['C1–C4', 'C5–T1', 'T1–T5', 'L1–L4'], 1,
    'The brachial plexus arises from the anterior rami of C5, C6, C7, C8 and T1. C1–C4 form the cervical plexus.'),
  q('ana-brachial-plexus', 2, "A newborn delivered with shoulder dystocia holds the arm adducted and internally rotated with the forearm pronated. Which posture is this?",
    ['Claw hand', "Waiter's tip", 'Wrist drop', 'Ape hand'], 1,
    "This is Erb's palsy from injury to the upper trunk (C5–C6), which produces the \"waiter's tip\" posture."),
  q('ana-brachial-plexus', 3, 'Which nerve is most at risk in a fracture of the midshaft of the humerus?',
    ['Axillary nerve', 'Radial nerve', 'Ulnar nerve', 'Musculocutaneous nerve'], 1,
    'The radial nerve runs in the radial (spiral) groove of the humerus. Injury here causes wrist drop.'),
  q('ana-brachial-plexus', 4, 'A fracture of the surgical neck of the humerus most commonly injures which nerve?',
    ['Radial nerve', 'Median nerve', 'Axillary nerve', 'Long thoracic nerve'], 2,
    'The axillary nerve winds around the surgical neck with the posterior circumflex humeral artery. Injury weakens deltoid and teres minor.'),
  q('ana-brachial-plexus', 5, "Klumpke's palsy results from injury to which roots?",
    ['C5–C6', 'C6–C7', 'C7 only', 'C8–T1'], 3,
    "Klumpke's palsy is a lower trunk injury (C8–T1), affecting the intrinsic muscles of the hand."),

  // Heart
  q('ana-heart', 1, 'Where is the sinoatrial node located?',
    ['Wall of the right atrium', 'Wall of the left atrium', 'Interventricular septum', 'Apex of the left ventricle'], 0,
    'The SA node lies in the wall of the right atrium near the opening of the superior vena cava.'),
  q('ana-heart', 2, 'The tricuspid valve lies between which two chambers?',
    ['Left atrium and left ventricle', 'Right atrium and right ventricle', 'Right ventricle and pulmonary trunk', 'Left ventricle and aorta'], 1,
    'The tricuspid valve is the right atrioventricular valve. The mitral valve is on the left.'),
  q('ana-heart', 3, 'The left anterior descending artery is a branch of which vessel?',
    ['Right coronary artery', 'Left coronary artery', 'Circumflex artery', 'Posterior descending artery'], 1,
    'The left coronary artery divides into the left anterior descending and circumflex arteries.'),
  q('ana-heart', 4, 'Which chamber forms most of the anterior (sternocostal) surface of the heart?',
    ['Right atrium', 'Left atrium', 'Right ventricle', 'Left ventricle'], 2,
    'The right ventricle forms most of the sternocostal surface, making it the most anterior chamber.'),
  q('ana-heart', 5, 'The great cardiac vein drains into the:',
    ['Superior vena cava', 'Coronary sinus', 'Left atrium directly', 'Inferior vena cava'], 1,
    'The great cardiac vein runs with the LAD and drains into the coronary sinus, which opens into the right atrium.'),

  // Cranial nerves
  q('ana-cranial-nerves', 1, 'Which cranial nerve supplies the lateral rectus muscle?',
    ['Oculomotor (III)', 'Trochlear (IV)', 'Abducens (VI)', 'Facial (VII)'], 2,
    'Lateral rectus is supplied by the abducens nerve (LR6). Palsy causes inability to abduct the eye.'),
  q('ana-cranial-nerves', 2, 'The superior oblique muscle is supplied by the:',
    ['Oculomotor nerve', 'Trochlear nerve', 'Abducens nerve', 'Ophthalmic nerve'], 1,
    'Superior oblique is supplied by the trochlear nerve (SO4).'),
  q('ana-cranial-nerves', 3, 'The muscles of mastication are supplied by the:',
    ['Facial nerve', 'Maxillary nerve (V2)', 'Mandibular nerve (V3)', 'Hypoglossal nerve'], 2,
    'The mandibular division of the trigeminal nerve (V3) supplies the muscles of mastication.'),
  q('ana-cranial-nerves', 4, 'Taste from the anterior two-thirds of the tongue is carried by the:',
    ['Chorda tympani (facial nerve)', 'Lingual branch of glossopharyngeal', 'Hypoglossal nerve', 'Vagus nerve'], 0,
    'Taste from the anterior two-thirds travels in the chorda tympani, a branch of the facial nerve. General sensation is via the lingual nerve (V3).'),
  q('ana-cranial-nerves', 5, 'Which cranial nerve passes through the jugular foramen?',
    ['Hypoglossal', 'Vagus', 'Facial', 'Abducens'], 1,
    'CN IX, X and XI pass through the jugular foramen. The hypoglossal nerve uses the hypoglossal canal.'),

  // Cardiac cycle
  q('phy-cardiac-cycle', 1, 'The first heart sound (S1) is caused by:',
    ['Closure of the aortic and pulmonary valves', 'Closure of the mitral and tricuspid valves', 'Rapid ventricular filling', 'Atrial contraction'], 1,
    'S1 marks the start of systole and is caused by closure of the atrioventricular valves.'),
  q('phy-cardiac-cycle', 2, 'During isovolumetric contraction:',
    ['Only the AV valves are open', 'Only the semilunar valves are open', 'All four valves are closed', 'All four valves are open'], 2,
    'Pressure rises in a closed ventricle — both AV and semilunar valves are closed, so volume does not change.'),
  q('phy-cardiac-cycle', 3, 'A typical resting stroke volume in an adult is about:',
    ['20 mL', '70 mL', '150 mL', '250 mL'], 1,
    'Resting stroke volume is about 70 mL. At 70 beats/min this gives a cardiac output of about 5 L/min.'),
  q('phy-cardiac-cycle', 4, 'Cardiac output is calculated as:',
    ['Heart rate × stroke volume', 'Stroke volume ÷ heart rate', 'Mean arterial pressure × heart rate', 'End-diastolic volume − heart rate'], 0,
    'Cardiac output = heart rate × stroke volume.'),
  q('phy-cardiac-cycle', 5, 'The "a" wave of the jugular venous pulse corresponds to:',
    ['Ventricular contraction', 'Atrial contraction', 'Tricuspid valve closure', 'Rapid ventricular filling'], 1,
    'The a wave is produced by right atrial contraction. It is absent in atrial fibrillation.'),

  // Renal
  q('phy-renal', 1, 'Most filtered glucose is reabsorbed in the:',
    ['Proximal convoluted tubule', 'Loop of Henle', 'Distal convoluted tubule', 'Collecting duct'], 0,
    'Almost all filtered glucose is reabsorbed in the proximal convoluted tubule via SGLT transporters.'),
  q('phy-renal', 2, 'A normal adult glomerular filtration rate is approximately:',
    ['25 mL/min', '60 mL/min', '125 mL/min', '500 mL/min'], 2,
    'Normal GFR is about 125 mL/min, or roughly 180 L/day.'),
  q('phy-renal', 3, 'ADH increases water reabsorption mainly by acting on the:',
    ['Proximal tubule', 'Descending loop of Henle', 'Collecting duct', 'Glomerulus'], 2,
    'ADH acts on V2 receptors in the collecting duct to insert aquaporin-2 channels.'),
  q('phy-renal', 4, 'Aldosterone acts on the distal nephron to:',
    ['Decrease sodium reabsorption', 'Increase sodium reabsorption and potassium secretion', 'Increase glucose reabsorption', 'Decrease hydrogen ion secretion'], 1,
    'Aldosterone increases ENaC and Na⁺/K⁺-ATPase activity, so sodium is reabsorbed and potassium secreted.'),
  q('phy-renal', 5, 'The macula densa senses:',
    ['Blood pressure in the afferent arteriole', 'NaCl concentration in the distal tubule', 'Plasma osmolality', 'Urea concentration'], 1,
    'The macula densa senses tubular NaCl and drives tubuloglomerular feedback and renin release.'),

  // Respiratory
  q('phy-respiratory', 1, 'Normal resting tidal volume in an adult is about:',
    ['150 mL', '500 mL', '1200 mL', '3000 mL'], 1,
    'Resting tidal volume is about 500 mL (roughly 7 mL/kg).'),
  q('phy-respiratory', 2, 'In a healthy person the main chemical stimulus for breathing is:',
    ['Arterial PO₂', 'Arterial PCO₂', 'Plasma bicarbonate', 'Haemoglobin concentration'], 1,
    'Arterial PCO₂, acting through CSF H⁺ on central chemoreceptors, is the main drive. Hypoxic drive matters more when PO₂ is very low.'),
  q('phy-respiratory', 3, 'Surfactant is produced by:',
    ['Type I pneumocytes', 'Type II pneumocytes', 'Alveolar macrophages', 'Club cells only'], 1,
    'Type II pneumocytes secrete surfactant, which reduces surface tension and prevents alveolar collapse.'),
  q('phy-respiratory', 4, 'Which shifts the oxygen–haemoglobin dissociation curve to the right?',
    ['Decreased temperature', 'Alkalosis', 'Increased 2,3-BPG', 'Decreased PCO₂'], 2,
    'Increased 2,3-BPG, CO₂, H⁺ and temperature shift the curve right, helping oxygen unloading in tissues.'),
  q('phy-respiratory', 5, 'Which lung volume cannot be measured by simple spirometry?',
    ['Tidal volume', 'Vital capacity', 'Residual volume', 'Inspiratory reserve volume'], 2,
    'Residual volume stays in the lungs and needs helium dilution or body plethysmography to measure.'),

  // Glycolysis
  q('bch-glycolysis', 1, 'The rate-limiting enzyme of glycolysis is:',
    ['Hexokinase', 'Phosphofructokinase-1', 'Pyruvate kinase', 'Aldolase'], 1,
    'PFK-1 is the main control point, activated by AMP and fructose-2,6-bisphosphate and inhibited by ATP and citrate.'),
  q('bch-glycolysis', 2, 'The net ATP yield of anaerobic glycolysis per glucose molecule is:',
    ['1', '2', '4', '36'], 1,
    '4 ATP are produced but 2 are used in the preparatory phase, giving a net 2 ATP.'),
  q('bch-glycolysis', 3, 'Glycolysis takes place in the:',
    ['Mitochondrial matrix', 'Cytoplasm', 'Endoplasmic reticulum', 'Nucleus'], 1,
    'All glycolytic enzymes are cytoplasmic.'),
  q('bch-glycolysis', 4, 'Under anaerobic conditions in skeletal muscle, pyruvate is converted to:',
    ['Acetyl-CoA', 'Lactate', 'Ethanol', 'Oxaloacetate'], 1,
    'Lactate dehydrogenase reduces pyruvate to lactate, regenerating NAD⁺ so glycolysis can continue.'),
  q('bch-glycolysis', 5, 'Which enzyme deficiency of glycolysis classically causes haemolytic anaemia?',
    ['Glucokinase', 'Pyruvate kinase', 'Phosphoglucomutase', 'Lactate dehydrogenase'], 1,
    'Red cells rely on glycolysis for ATP. Pyruvate kinase deficiency reduces ATP and causes haemolysis.'),

  // Enzymes
  q('bch-enzymes', 1, 'A competitive inhibitor:',
    ['Increases Km, Vmax unchanged', 'Decreases Vmax, Km unchanged', 'Decreases both Km and Vmax', 'Has no effect on Km or Vmax'], 0,
    'A competitive inhibitor competes for the active site. More substrate overcomes it, so Vmax is unchanged but Km rises.'),
  q('bch-enzymes', 2, 'Km is defined as the substrate concentration at which:',
    ['The reaction stops', 'The rate is half of Vmax', 'The rate equals Vmax', 'The enzyme is denatured'], 1,
    'Km is the substrate concentration giving half-maximal velocity. A low Km means high affinity.'),
  q('bch-enzymes', 3, 'A non-competitive inhibitor:',
    ['Increases Km', 'Decreases Vmax without changing Km', 'Increases Vmax', 'Binds only at the active site'], 1,
    'Non-competitive inhibitors bind away from the active site, reducing Vmax without changing Km.'),
  q('bch-enzymes', 4, 'Enzymes increase the rate of reactions by:',
    ['Increasing the activation energy', 'Lowering the activation energy', 'Changing the equilibrium constant', 'Raising the temperature'], 1,
    'Enzymes lower the activation energy. They do not change the equilibrium of the reaction.'),
  q('bch-enzymes', 5, 'Allosteric enzymes typically show which velocity–substrate curve?',
    ['Hyperbolic', 'Linear', 'Sigmoidal', 'Bell-shaped'], 2,
    'Cooperative binding in allosteric enzymes gives a sigmoidal curve.'),

  // Vitamins
  q('bch-vitamins', 1, 'Scurvy is caused by deficiency of:',
    ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'], 2,
    'Vitamin C is needed for collagen hydroxylation. Deficiency causes bleeding gums and poor wound healing.'),
  q('bch-vitamins', 2, 'Wernicke encephalopathy is caused by deficiency of:',
    ['Thiamine (B1)', 'Riboflavin (B2)', 'Niacin (B3)', 'Pyridoxine (B6)'], 0,
    'Thiamine deficiency, often with chronic alcohol use, causes Wernicke encephalopathy: confusion, ophthalmoplegia and ataxia.'),
  q('bch-vitamins', 3, 'Pellagra (dermatitis, diarrhoea, dementia) is due to deficiency of:',
    ['Thiamine', 'Niacin', 'Folate', 'Vitamin K'], 1,
    'Pellagra is caused by niacin (B3) deficiency.'),
  q('bch-vitamins', 4, 'Vitamin K is required for:',
    ['Hydroxylation of proline', 'γ-carboxylation of factors II, VII, IX and X', 'Synthesis of rhodopsin', 'Calcium absorption'], 1,
    'Vitamin K is a cofactor for γ-carboxylation of clotting factors II, VII, IX and X (and proteins C and S).'),
  q('bch-vitamins', 5, 'Night blindness is an early sign of deficiency of:',
    ['Vitamin A', 'Vitamin E', 'Vitamin D', 'Vitamin B12'], 0,
    'Vitamin A is needed to form rhodopsin in rod cells.'),

  // Pharmacokinetics
  q('pha-pharmacokinetics', 1, 'With regular dosing, steady-state concentration is reached after about:',
    ['1 half-life', '2 half-lives', '4–5 half-lives', '10 half-lives'], 2,
    'About 94–97% of steady state is reached after 4–5 half-lives.'),
  q('pha-pharmacokinetics', 2, 'First-pass metabolism of oral drugs occurs mainly in the:',
    ['Kidney', 'Liver', 'Lungs', 'Brain'], 1,
    'Drugs absorbed from the gut go through the portal vein to the liver before reaching the systemic circulation.'),
  q('pha-pharmacokinetics', 3, 'Which of the following follows zero-order elimination kinetics?',
    ['Ethanol', 'Penicillin', 'Gentamicin', 'Amoxicillin'], 0,
    'Ethanol is eliminated at a constant rate because alcohol dehydrogenase is saturated at usual concentrations.'),
  q('pha-pharmacokinetics', 4, 'The bioavailability of a drug given intravenously is:',
    ['0%', '50%', 'Variable', '100%'], 3,
    'An IV dose goes straight into the systemic circulation, so bioavailability is 100% by definition.'),
  q('pha-pharmacokinetics', 5, 'The loading dose of a drug mainly depends on its:',
    ['Half-life', 'Volume of distribution', 'Clearance', 'Protein binding only'], 1,
    'Loading dose = Vd × target concentration ÷ bioavailability. The maintenance dose depends on clearance.'),

  // Autonomic
  q('pha-autonomic', 1, 'Atropine acts as a:',
    ['Muscarinic antagonist', 'Nicotinic agonist', 'β1 agonist', 'Cholinesterase inhibitor'], 0,
    'Atropine competitively blocks muscarinic receptors, e.g. treating bradycardia and organophosphate poisoning.'),
  q('pha-autonomic', 2, 'The first-line drug for anaphylaxis is:',
    ['IV hydrocortisone', 'Oral antihistamine', 'Intramuscular adrenaline', 'Nebulised salbutamol'], 2,
    'IM adrenaline is first-line. Antihistamines and steroids are adjuncts.'),
  q('pha-autonomic', 3, 'Propranolol is best described as a:',
    ['Selective β1 blocker', 'Non-selective β blocker', 'α1 blocker', 'β2 agonist'], 1,
    'Propranolol blocks both β1 and β2 receptors, so it is used with caution in asthma.'),
  q('pha-autonomic', 4, 'Along with atropine, which drug is used in organophosphate poisoning to reactivate acetylcholinesterase?',
    ['Neostigmine', 'Pralidoxime', 'Physostigmine', 'Naloxone'], 1,
    'Pralidoxime regenerates acetylcholinesterase if given before the enzyme "ages".'),
  q('pha-autonomic', 5, 'Salbutamol relieves bronchospasm by acting as a:',
    ['β2 agonist', 'Muscarinic agonist', 'β1 antagonist', 'Leukotriene antagonist'], 0,
    'Salbutamol stimulates β2 receptors on bronchial smooth muscle, causing bronchodilation.'),

  // Antimicrobials
  q('pha-antimicrobials', 1, 'Penicillins act by inhibiting:',
    ['Protein synthesis', 'Cell wall synthesis', 'DNA gyrase', 'Folate synthesis'], 1,
    'β-lactams bind penicillin-binding proteins and block peptidoglycan cross-linking in the cell wall.'),
  q('pha-antimicrobials', 2, 'The major adverse effects of aminoglycosides are:',
    ['Hepatotoxicity and rash', 'Nephrotoxicity and ototoxicity', 'Tendon rupture and QT prolongation', 'Grey baby syndrome'], 1,
    'Aminoglycosides such as gentamicin are nephrotoxic and ototoxic, so levels are monitored.'),
  q('pha-antimicrobials', 3, 'Grey baby syndrome is associated with:',
    ['Chloramphenicol', 'Tetracycline', 'Ciprofloxacin', 'Ceftriaxone'], 0,
    'Newborns cannot conjugate chloramphenicol well, so it accumulates and causes circulatory collapse.'),
  q('pha-antimicrobials', 4, 'Which drug turns urine and tears red-orange?',
    ['Isoniazid', 'Ethambutol', 'Rifampicin', 'Pyrazinamide'], 2,
    'Rifampicin colours body fluids red-orange. Patients should be warned.'),
  q('pha-antimicrobials', 5, 'Taking alcohol with which antibiotic can cause a disulfiram-like reaction?',
    ['Amoxicillin', 'Metronidazole', 'Azithromycin', 'Doxycycline'], 1,
    'Metronidazole inhibits aldehyde dehydrogenase, causing flushing, nausea and vomiting with alcohol.'),
];

/** Sample study materials (freely licensed, openly available). */
export const RESOURCES: StudyResource[] = [
  {
    id: 'res-openstax-ap',
    courseId: 'anatomy',
    kind: 'textbook',
    title: 'Anatomy and Physiology 2e (OpenStax)',
    description: 'Free, peer-reviewed textbook (CC BY 4.0). Read online or download the PDF from OpenStax.',
    source: 'link',
    link: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
  },
];
