#!/usr/bin/env node
'use strict';

/**
 * Tiba Stone — New Range Product Page Generator
 * Generates 91 product HTML pages from the tp-001–tp-102 image set.
 * Run from the site root: node scripts/generate-new-range.js
 */

const fs   = require('fs');
const path = require('path');

const SITE_ROOT  = path.resolve(__dirname, '..');
const IMG_BASE   = '../../Tiba Dev/tiba-stone-img-gen/new range generations';

// ─── IMAGE PATH HELPER ──────────────────────────────────────────────────────
const img = (code, suffix) =>
  `${IMG_BASE}/${code}/${code}_${suffix}.png`;

// ─── CATEGORY META ──────────────────────────────────────────────────────────
const CAT = {
  'consoles': {
    label: 'Console Table', anchor: 'consoles',
    dims: '150 × 40 × 85 cm', weight: 'Approx. 95 kg',
    finish: 'Honed or polished', leadtime: '4–6 weeks',
    faq: [
      { q: 'Can the dimensions be customised?',
        a: 'Yes. Width, depth and height can all be adjusted within the structural parameters of each design. Speak with us to discuss your specific spatial requirements.' },
      { q: 'Is wall-fixing required?',
        a: 'Most console designs are freestanding and require no fixing. Certain cantilevered designs benefit from a wall anchor — this is specified per piece.' },
      { q: 'What finishes are available?',
        a: 'All pieces are available in honed or polished finish. Sandblasted and leathered textures can be explored for select stones.' },
    ],
  },
  'side-tables': {
    label: 'Side Table', anchor: 'side-tables',
    dims: '45 × 45 × 58 cm', weight: 'Approx. 35 kg',
    finish: 'Honed or polished', leadtime: '3–5 weeks',
    faq: [
      { q: 'Is the piece suitable for outdoor use?',
        a: 'Selected marbles perform well in sheltered outdoor settings. We advise against prolonged exposure to standing water or direct sunlight for certain stones.' },
      { q: 'Can it function as a stool as well as a side table?',
        a: 'Many of our side table designs comfortably bear the weight of a seated person. Structural load data is available on request.' },
      { q: 'How are mixed-material pieces constructed?',
        a: 'Mixed-material designs — stone with wood, brass or onyx — are assembled using concealed hardware and food-grade adhesives designed for natural stone.' },
    ],
  },
  'coffee-tables': {
    label: 'Coffee Table', anchor: 'coffee-tables',
    dims: '120 × 80 × 38 cm', weight: 'Approx. 85 kg',
    finish: 'Honed or polished', leadtime: '4–6 weeks',
    faq: [
      { q: 'Is the surface treated against spills?',
        a: 'All pieces leave the atelier with a professional-grade impregnating sealer. We recommend reapplication annually for polished surfaces in active use.' },
      { q: 'Can the table be made larger or smaller?',
        a: 'Custom dimensions are available on all designs. Structural constraints vary by form — contact us with your requirements and we will advise.' },
      { q: 'How should I clean the marble surface?',
        a: 'Daily cleaning with a slightly damp cloth is sufficient. Avoid acidic cleaners entirely. Annual resealing extends the surface quality indefinitely.' },
    ],
  },
  'dining-tables': {
    label: 'Dining Table', anchor: 'dining-tables',
    dims: '240 × 100 × 75 cm', weight: 'Approx. 240 kg',
    finish: 'Honed or polished', leadtime: '6–10 weeks',
    faq: [
      { q: 'How many people does the table seat?',
        a: 'Standard dimensions seat 8–10. Custom widths and lengths can increase capacity — speak with us about your specific requirements.' },
      { q: 'Can the table be delivered assembled?',
        a: 'Due to weight and scale, most dining tables are delivered in components and assembled on site by our installation team.' },
      { q: 'Is custom sizing available?',
        a: 'Yes — all dining table designs can be made to bespoke dimensions. Structural integrity is maintained across a wide size range; we will advise on any constraints.' },
    ],
  },
  'benches': {
    label: 'Bench', anchor: 'benches',
    dims: '150 × 45 × 45 cm', weight: 'Approx. 90 kg',
    finish: 'Honed or polished', leadtime: '4–6 weeks',
    faq: [
      { q: 'Can the bench be used outdoors?',
        a: 'Selected stone types perform well outdoors. We recommend a sealed finish and annual maintenance for exterior installations.' },
      { q: 'What is the structural load capacity?',
        a: 'Our benches are tested to carry concentrated loads of 300 kg. Specific load data is available on request for any design.' },
      { q: 'Are cushions included?',
        a: 'Upholstered designs include the cushion as standard. Replacement cushions, in your choice of fabric, can be ordered separately.' },
    ],
  },
  'cabinets': {
    label: 'Cabinet', anchor: 'cabinets',
    dims: '100 × 45 × 80 cm', weight: 'Approx. 120 kg',
    finish: 'Honed or polished', leadtime: '6–8 weeks',
    faq: [
      { q: 'How do the push-open mechanisms work?',
        a: 'Push-to-open hardware requires no handles, preserving the clean faces of the stone. The mechanism is spring-loaded and adjustable.' },
      { q: 'What are the interior finishes?',
        a: 'Interiors are typically lacquered wood in warm or cool tones to complement the stone exterior. Stone-lined interiors are available for select designs.' },
      { q: 'Can additional drawers be added?',
        a: 'Configuration can be discussed at the commissioning stage. We work with you to adapt storage to your specific requirements.' },
    ],
  },
  'credenzas': {
    label: 'Credenza', anchor: 'credenzas',
    dims: '200 × 50 × 80 cm', weight: 'Approx. 160 kg',
    finish: 'Honed or polished', leadtime: '6–10 weeks',
    faq: [
      { q: 'Is the credenza freestanding?',
        a: 'All credenza designs are freestanding. Wall anchoring is optional and advised for stability in high-footfall environments.' },
      { q: 'What hardware is used for the doors?',
        a: 'Push-to-open concealed hardware is standard. Bespoke hardware in brass, oxidised steel or bronze can be specified.' },
      { q: 'Can custom lengths be made?',
        a: 'Yes. Credenzas can be extended or shortened within the parameters of the design. Speak with us about your space.' },
    ],
  },
  'washbasins': {
    label: 'Washbasin', anchor: 'washbasins',
    dims: 'Custom per design', weight: 'Approx. 55–120 kg',
    finish: 'Honed, polished or natural', leadtime: '4–8 weeks',
    faq: [
      { q: 'Are the basins waterproof without additional sealing?',
        a: 'All basins leave the atelier sealed to a hospitality-grade standard. Annual resealing is recommended for long-term performance.' },
      { q: 'What drainage systems are compatible?',
        a: 'Basins are drilled for standard 40 mm waste fittings. We work with your plumber to specify the optimal drain position.' },
      { q: 'Can a custom overflow be fitted?',
        a: 'Overflow channels can be incorporated into the design at the commissioning stage. Advise your plumber of the requirement early.' },
    ],
  },
  'compliments': {
    label: 'Object', anchor: 'compliments',
    dims: 'Variable', weight: 'Variable',
    finish: 'Natural or polished', leadtime: '3–6 weeks',
    faq: [
      { q: 'Can the piece be specified in a different stone?',
        a: 'Stone selection can be discussed at the commissioning stage. Some forms are stone-specific by structural necessity; we will advise.' },
      { q: 'Is the object purely decorative or functional?',
        a: 'Each piece is designed with both in mind. Function varies — some serve as lighting, seating, surface, or display. Details per piece.' },
      { q: 'How should sculptural marble objects be maintained?',
        a: 'A soft dry cloth removes dust. For polished surfaces, an occasional application of marble wax maintains the depth of the stone\'s lustre.' },
    ],
  },
};

// ─── CATEGORY EDITORIAL TEMPLATES ───────────────────────────────────────────
const EDITORIAL = {
  'consoles': {
    e1: (name) => ({
      label: 'Form & Entry',
      heading: 'The Threshold Piece',
      text: `${name} is designed to own the moment of arrival. A console announces a room before the room is seen — it sets the register for everything that follows. The material, the proportion, the finish: all conspire to make a statement in the narrow architecture of a threshold.`,
    }),
    e2: (name) => ({
      label: 'Stone & Surface',
      heading: 'Where Craft Meets Light',
      text: `Every surface of ${name} is worked by hand through progressive grades until the stone reaches its final quality. What appears effortless is the product of considerable labour — the kind that only reveals itself in the quality of light across the finished surface.`,
    }),
  },
  'side-tables': {
    e1: (name) => ({
      label: 'Scale & Presence',
      heading: 'The Intimate Object',
      text: `${name} operates at the scale of the hand and the body. A side table is the most private of furniture — it holds what is held dear. The stone chosen, the form resolved, the weight felt when you rest your hand on it: intimacy built from material certainty.`,
    }),
    e2: (name) => ({
      label: 'Stone & Silence',
      heading: 'Hewn from a Single Intention',
      text: `The best objects require no explanation. ${name} earns its place in a room without demanding attention — it simply is what it is, unmistakably, in the material it was always meant to be made from.`,
    }),
  },
  'coffee-tables': {
    e1: (name) => ({
      label: 'Surface & Gathering',
      heading: 'The Room\'s Anchor',
      text: `${name} holds a room together. The coffee table is the one piece of furniture that every seat faces — it becomes the ground beneath conversation, beneath objects, beneath light. In stone, it holds that gravity permanently and without effort.`,
    }),
    e2: (name) => ({
      label: 'Weight & Permanence',
      heading: 'Built to Outlast',
      text: `Natural stone does not age the way other materials do. ${name} will develop character over years of use — a patina that no surface treatment can replicate and no renovation can erase. It is, in the truest sense, a piece for life.`,
    }),
  },
  'dining-tables': {
    e1: (name) => ({
      label: 'Table & Ceremony',
      heading: 'At the Centre of Everything',
      text: `${name} is the room's most consequential object. The dining table is where the architecture of daily life plays out — meals, work, conversation, silence. In stone, it bears all of this without showing the strain.`,
    }),
    e2: (name) => ({
      label: 'Material & Scale',
      heading: 'The Weight of Permanence',
      text: `There is a kind of authority that comes only with real mass. ${name} earns its place at the centre of a room by virtue of what it is made from — stone quarried, worked, and refined over weeks until the surface is exactly what it should be.`,
    }),
  },
  'benches': {
    e1: (name) => ({
      label: 'Rest & Resolve',
      heading: 'Stone Made Habitable',
      text: `${name} does something stone rarely does: it invites you to sit. The bench is the furniture of pause — the moment between the door and the room, the bed and the world. In stone, that pause feels permanent.`,
    }),
    e2: (name) => ({
      label: 'Form & Function',
      heading: 'No Compromise',
      text: `Every design decision in ${name} resolves a tension between the hardness of stone and the requirement of use. The edge radii, the surface finish, the proportion of seat to height — each detail negotiated until stone becomes genuinely liveable.`,
    }),
  },
  'cabinets': {
    e1: (name) => ({
      label: 'Storage & Presence',
      heading: 'The Wall Piece Reborn',
      text: `${name} recasts storage as architecture. The cabinet holds what must be held, but its exterior face is the piece's true purpose — a composition of stone that reads as sculpture even when all doors are closed.`,
    }),
    e2: (name) => ({
      label: 'Material & Mechanism',
      heading: 'Precision in Stone',
      text: `The hardware behind ${name}'s doors and drawers is chosen to disappear. Push-open mechanisms, concealed hinges, silent dampers — all working in service of an exterior face that shows nothing but the stone.`,
    }),
  },
  'credenzas': {
    e1: (name) => ({
      label: 'Horizontal Authority',
      heading: 'The Long Object',
      text: `${name} is furniture as landscape — a horizontal expanse of stone that organises a room's sense of ground. The credenza at its best is both container and composition: a wall unto itself.`,
    }),
    e2: (name) => ({
      label: 'Stone & Craft',
      heading: 'At the Boundary of Function',
      text: `The long form of ${name} demands exceptional consistency from the stone — veining that reads across the full length, finishes matched panel to panel. This is the most technically demanding format we produce.`,
    }),
  },
  'washbasins': {
    e1: (name) => ({
      label: 'Water & Stone',
      heading: 'The Ancient Pairing',
      text: `Stone and water have always belonged together — one shaped by the other over geological time. ${name} makes this relationship explicit: a vessel carved to receive and hold water, finished to a standard that improves with every encounter.`,
    }),
    e2: (name) => ({
      label: 'Ritual & Refinement',
      heading: 'The Daily Object',
      text: `The washbasin is encountered more often than any other piece of stone in a home. ${name} is designed to reward that frequency — to reveal new aspects of the material as the light moves across it through the day.`,
    }),
  },
  'compliments': {
    e1: (name) => ({
      label: 'Object & Intention',
      heading: 'Beyond Function',
      text: `${name} asks less of you than other pieces ask of furniture. It does not need to be sat on or eaten from or used to store things. It needs only to exist — to hold its presence in a room and justify the attention it receives.`,
    }),
    e2: (name) => ({
      label: 'Material Truth',
      heading: 'The Piece as Statement',
      text: `There is a category of object for which no category quite suffices. ${name} belongs to this territory — furniture, sculpture, and material study simultaneously. It is best encountered in a room where there is space to think.`,
    }),
  },
};

// ─── PRODUCT DATA ─────────────────────────────────────────────────────────────
const products = [
  // CONSOLES
  { code:'tp-002', name:'Rupe', slug:'rupe', category:'consoles',
    subtitle:'a monolithic waterfall console',
    desc:'Rosso Levanto folds from surface to floor in one uninterrupted vertical pour. No joint, no seam — stone working at the limit of what a single block can achieve.',
    quote:'The cliff face brought indoors. Mass that holds its breath.' },

  { code:'tp-003', name:'Soglia', slug:'soglia', category:'consoles',
    subtitle:'a threshold console in dark green',
    desc:'Two vertical slabs bear a single suspended plane in Verde Guatemala. The simplest grammar of structure: column and beam, distilled to their essence.',
    quote:'A doorway that never leads anywhere. The threshold as destination.' },

  { code:'tp-006', name:'Prisma', slug:'prisma', category:'consoles',
    subtitle:'a crystal and brass console',
    desc:'Selenite crystal panels set within a brushed brass frame catch the light in perpetual, shifting motion. The console as instrument — responsive to every change in the room.',
    quote:'Stone that moves without moving. Crystal memory of light.' },

  { code:'tp-007', name:'Lama', slug:'lama', category:'consoles',
    subtitle:'a blade-form Calacatta Viola console',
    desc:'A long blade of Calacatta Viola balanced on two trapezoidal legs — each vein a brushstroke drawn the length of the surface. Elongated beyond expectation, resolved with complete confidence.',
    quote:'The long gesture. A horizon held at hip height.' },

  { code:'tp-008', name:'Falce', slug:'falce', category:'consoles',
    subtitle:'an asymmetric cantilever console',
    desc:'A bold asymmetric cantilever in Verde Guatemala holds a surface in apparent defiance of gravity. The wedge base provides the hidden logic that makes the gesture possible.',
    quote:'Weight that pretends otherwise. The cantilever as confidence.' },

  { code:'tp-009', name:'Diagonale', slug:'diagonale', category:'consoles',
    subtitle:'a geometric console with disc joints',
    desc:'Verde Guatemala legs lean outward at deliberate angles, each joint anchored by a stone disc. Architecture borrowed from structural engineering, returned as ornament.',
    quote:'The angle that holds everything else straight.' },

  { code:'tp-011', name:'Marea', slug:'marea', category:'consoles',
    subtitle:'a scalloped modular console',
    desc:'A coastline of cream marble: five undulating modules that rise and fall like waves arrested in stone. Each unit is individually resolved; together they form something larger.',
    quote:'The tide, held. Motion made permanent in a material that cannot move.' },

  { code:'tp-012', name:'Arco', slug:'arco', category:'consoles',
    subtitle:'an arched console in Verde Guatemala',
    desc:'A single oval surface floats above an arched void — the structural gesture reduced to its most confident simplest form. Dark green marble makes the arch feel inevitable.',
    quote:'One opening, one surface. Everything else is stone.' },

  { code:'tp-013', name:'Traversa', slug:'traversa', category:'consoles',
    subtitle:'a T-channel console in teal marble',
    desc:'A T-shaped channel in teal-green marble turns structural honesty into formal beauty. The cross-section of a beam becomes the vocabulary of the piece.',
    quote:'The structural drawing, realised. Elevation as ornament.' },

  { code:'tp-014', name:'Vela', slug:'vela', category:'consoles',
    subtitle:'a sail-form Rosso Levanto console',
    desc:'Two tapering fin-like legs carry a curved surface in Rosso Levanto — a sail frozen mid-voyage. The curve catches light the way a sail catches wind: fully, completely, without remainder.',
    quote:'A sail made stone. The voyage interrupted, the form preserved.' },

  { code:'tp-015', name:'Fuso', slug:'fuso', category:'consoles',
    subtitle:'a travertine and walnut console',
    desc:'A floating travertine plane rests on two tapered dark walnut columns — the warmth of ancient wood against the cool permanence of layered stone. Two timescales, one object.',
    quote:'Oak and travertine. Two materials that understand each other perfectly.' },

  { code:'tp-017', name:'Grotta', slug:'grotta', category:'consoles',
    subtitle:'an arched-base Rosso Levanto console',
    desc:'Four rounded arches in Rosso Levanto form a solid base for the elongated surface above. The grotto beneath is the space that defines the piece — absence made structural.',
    quote:'The cave below holds the surface above. Absence as architecture.' },

  { code:'tp-094', name:'Arcata', slug:'arcata', category:'consoles',
    subtitle:'an arcade console in Calacatta Viola',
    desc:'Five arched voids define the base of this Calacatta Viola console — a colonnade in miniature. The arcade form has held up buildings for two thousand years; here it holds a surface.',
    quote:'The arcade reduced. Five arches and one horizon.' },

  // SIDE TABLES
  { code:'tp-001', name:'Riccio', slug:'riccio', category:'side-tables',
    subtitle:'a scroll-form side table in Rosso Levanto',
    desc:'Rosso Levanto folds back on itself in a continuous curl — a single piece of marble that becomes its own support. The scroll form is ancient; the material execution, entirely of its time.',
    quote:'Stone that curves back to touch itself. The circle, begun and never closed.' },

  { code:'tp-005', name:'Altare', slug:'altare', category:'side-tables',
    subtitle:'a tiered travertine side table',
    desc:'A round travertine disc holds a square offering block above a rectangular column. Three geometries, one material, one unbroken hierarchy — the altar reduced to its structural logic.',
    quote:'The offering surface. Three forms that know their place.' },

  { code:'tp-020', name:'Torre', slug:'torre', category:'side-tables',
    subtitle:'a stacked two-stone side table',
    desc:'Green onyx rests atop a deep red marble base — two stones with entirely different characters in precise vertical dialogue. The tower form makes the contrast the composition.',
    quote:'Two stones, one intention. The tower as argument.' },

  { code:'tp-022', name:'Zolla', slug:'zolla', category:'side-tables',
    subtitle:'an onyx and burlwood side table',
    desc:'Honey onyx rests on a dark burlwood block — two natural materials at different timescales, in complete harmony. Neither dominates; each makes the other more fully itself.',
    quote:'Wood remembers the tree. Stone remembers the sea. Together they are still.' },


  { code:'tp-024', name:'Finestra', slug:'finestra', category:'side-tables',
    subtitle:'an oval-arch side table in honey marble',
    desc:'A square honey-marble top floats above a base carved with a single oval opening. The void beneath the surface is as deliberate as the surface itself — stone edited to its minimum.',
    quote:'The window within the stone. Light passing through what cannot be moved.' },

  { code:'tp-026', name:'Cubo', slug:'cubo', category:'side-tables',
    subtitle:'an L-form rose quartz side table',
    desc:'Two interlocking L-shapes in rose quartz create a composition that changes character with each viewing angle. The abstract form doubles as surface; the surface is the sculpture.',
    quote:'Two angles, one form. The corner that became the piece.' },

  { code:'tp-027', name:'Nucleo', slug:'nucleo', category:'side-tables',
    subtitle:'a biomorphic side table in swirled marble',
    desc:'A biomorphic void at its center — swirling grey marble carved into something simultaneously ancient and forward. The aperture is the piece\'s nucleus: everything else is in orbit around it.',
    quote:'The core defined by its absence. Stone hollowed to its essential form.' },

  { code:'tp-028', name:'Cupola', slug:'cupola', category:'side-tables',
    subtitle:'a double-arch side table',
    desc:'A square surface rests above twin arched apertures — the section of a cathedral made intimate. Dark variegated marble gives the arches the gravity of something structural and old.',
    quote:'Two arches bearing one surface. The cathedral in miniature.' },

  { code:'tp-029', name:'Capitello', slug:'capitello', category:'side-tables',
    subtitle:'a ribbed-arch side table in mixed green',
    desc:'A ribbed arch base meets a smooth organic top — the architectural capital reinterpreted as intimate furniture. The classical element placed in a domestic register.',
    quote:'The capital without the column. Ornament that stands alone.' },

  { code:'tp-075', name:'Gamma', slug:'gamma', category:'side-tables',
    subtitle:'an interlocking L side table in honey onyx',
    desc:'Two interlocking L-forms in honey onyx create a composition that reads differently from every angle. The geometry is deliberate; the warmth of the stone makes it feel inevitable.',
    quote:'The corner made object. Two forms that hold each other in place.' },

  { code:'tp-085', name:'Erma', slug:'erma', category:'side-tables',
    subtitle:'a travertine and wood nightstand',
    desc:'A hexagonal travertine column with a cantilevered dark wood drawer and an onyx tray — a bedside companion of extraordinary refinement. The term as furniture: functional, architectural, intimate.',
    quote:'The herm reimagined. Column, drawer, and offering surface in one.' },

  { code:'tp-092', name:'Grado', slug:'grado', category:'side-tables',
    subtitle:'a stepped cube side table in Rosso Levanto',
    desc:'Two stepped cubes of Rosso Levanto — one set upon the other, slightly offset — a study in the power of simple geometry and dramatic stone. The step is the design; the material does the rest.',
    quote:'Two cubes, one step. The grade between surface and floor.' },

  // COFFEE TABLES
  { code:'tp-021', name:'Disco', slug:'disco', category:'coffee-tables',
    subtitle:'a round disc coffee table',
    desc:'A generous circular disc in mixed travertine rests on a single low pedestal. The table as pure surface — no unnecessary structure, no distraction from the stone\'s horizontal expanse.',
    quote:'The disc. The simplest possible surface in the most permanent material.' },

  { code:'tp-040', name:'Lastra', slug:'lastra', category:'coffee-tables',
    subtitle:'a slab coffee table in rose quartz',
    desc:'A slab of rose quartz resting on minimal geometric feet — the stone commanding space without apology. The surface is the piece; everything else is in service of it.',
    quote:'The slab speaks first. Everything else follows.' },

  { code:'tp-050', name:'Navata', slug:'navata', category:'coffee-tables',
    subtitle:'an oval coffee table with arch legs',
    desc:'A long oval in deep Verde Guatemala floats above three arched supports — the nave of a great cathedral distilled into furniture. The arches carry the surface the way they have always carried roofs.',
    quote:'The nave made low. Three arches, one surface, the scale of a room.' },

  { code:'tp-053', name:'Bivio', slug:'bivio', category:'coffee-tables',
    subtitle:'a bicolor ribbed-leg coffee table',
    desc:'Two contrasting travertines — cream and deep red — meet in a single oval surface above ribbed marble legs. The crossroads of colour and form made permanent in stone.',
    quote:'Where two stones meet. The point of decision made horizontal.' },

  { code:'tp-054', name:'Rena', slug:'rena', category:'coffee-tables',
    subtitle:'an organic coffee table in dark green and marble',
    desc:'An asymmetric, flowing top in dark green marble carried by paired white arch-cut legs. The organic form above and the architectural form below — two languages, one resolved piece.',
    quote:'Sand and arch. The organic shaped by the geometric.' },

  { code:'tp-056', name:'Colonnato', slug:'colonnato', category:'coffee-tables',
    subtitle:'an oval coffee table on fluted columns',
    desc:'A fossil marble oval floats above a colonnade of fluted columns — ancient architecture distilled to coffee-table scale. The columns carry the weight the way they have always carried weight: quietly, with conviction.',
    quote:'The colonnade brought low. Ancient structure serving a modern surface.' },

  { code:'tp-062', name:'Dado', slug:'dado', category:'coffee-tables',
    subtitle:'a square plinth coffee table in travertine',
    desc:'A pure square of travertine reduced to its most essential form — the plinth before it became a pedestal, the die before it was cast. Confidence in geometry without decoration.',
    quote:'The square. The plinth. The travertine. Nothing else required.' },

  { code:'tp-064', name:'Podio', slug:'podio', category:'coffee-tables',
    subtitle:'a square coffee table on bronze pyramid feet',
    desc:'A square of Calacatta Verde raised on four sharp bronze pyramidal feet — the podium form, the surface elevated by the precision of the material it stands on.',
    quote:'Four pyramids and one surface. The podium without the speech.' },

  { code:'tp-065', name:'Cuneo', slug:'cuneo', category:'coffee-tables',
    subtitle:'a wedge-base coffee table in mixed marble',
    desc:'A rectangular top rests on a single diagonal wedge of mixed marble — geometry subverting expectation. The wedge is not a compromise; it is the point.',
    quote:'The wedge holds everything level. Asymmetry in the service of balance.' },

  { code:'tp-066', name:'Piombo', slug:'piombo', category:'coffee-tables',
    subtitle:'a solid block coffee table in Calacatta Viola',
    desc:'A solid rectangular block in Calacatta Viola — weight, presence, and the quiet confidence of pure form. The table as monolith; nothing borrowed, nothing removed.',
    quote:'Weight without excuse. The block as a complete statement.' },

  { code:'tp-067', name:'Ali', slug:'ali', category:'coffee-tables',
    subtitle:'a bilobed wing coffee table in travertine',
    desc:'Two oval wings of travertine fan outward from a single cylindrical base — flight arrested in stone. The moment before lift-off made permanent and horizontal.',
    quote:'Two wings, one moment. Stone that almost took flight.' },

  { code:'tp-068', name:'Anello', slug:'anello', category:'coffee-tables',
    subtitle:'a stacked-ring coffee table in Calacatta gold',
    desc:'Stacked rings of warm Calacatta marble, each disc diminishing upward, carry a round top with effortless grace. The ring as structural logic — ancient, resolved, endlessly applicable.',
    quote:'The ring, repeated. Each tier smaller, each surface more considered.' },

  { code:'tp-069', name:'Duetto', slug:'duetto', category:'coffee-tables',
    subtitle:'a two-form coffee table in green and white marble',
    desc:'A waterfall of Verde Guatemala and a solid block of white marble — two entirely distinct forms in one continuous composition. The table as conversation between two stones.',
    quote:'Green against white. Two stones in perpetual, irresolvable dialogue.' },

  { code:'tp-070', name:'Eco', slug:'eco', category:'coffee-tables',
    subtitle:'nesting coffee tables in Rosso Levanto',
    desc:'Two nesting tables in deep Rosso Levanto — the smaller always suggesting the larger, an echo in stone. Together they read as a single composition; apart, each is complete.',
    quote:'The echo. The second form that confirms the first.' },

  { code:'tp-071', name:'Ponte', slug:'ponte', category:'coffee-tables',
    subtitle:'a marble and walnut bridge coffee table',
    desc:'A bridge of Calacatta marble rests on dark walnut cylinders — the ancient material and the warmly modern one in unexpected, entirely resolved agreement.',
    quote:'Stone over wood. The bridge as furniture.' },

  { code:'tp-073', name:'Basalto', slug:'basalto', category:'coffee-tables',
    subtitle:'a rectangular plinth coffee table in Calacatta Viola',
    desc:'A pure rectangle of Calacatta Viola — monolithic, grounded, the weight of the earth held in polished form. The table that refuses to apologise for its presence.',
    quote:'The mass that centres a room. Nothing decorative; everything considered.' },

  { code:'tp-074', name:'Tondo', slug:'tondo', category:'coffee-tables',
    subtitle:'a softly rounded coffee table in travertine',
    desc:'A softly rounded rectangle of travertine on a minimal ring base — the gentlest geometry in stone. The table that greets every surrounding chair with the same unhurried warmth.',
    quote:'The round-cornered world. Softness with the permanence of stone.' },

  { code:'tp-076', name:'Incastro', slug:'incastro', category:'coffee-tables',
    subtitle:'a two-tone fragment coffee table',
    desc:'Alabaster and Emperadore fragments fit together like puzzle pieces across a cantilevered surface above two contrasting base blocks. The join is the design — where stone meets stone.',
    quote:'Two stones in a single surface. The join as the subject.' },

  { code:'tp-077', name:'Piano', slug:'piano', category:'coffee-tables',
    subtitle:'a low travertine plinth coffee table',
    desc:'A long low plane of travertine close to the ground — the table as landscape, the surface as terrain. Piano asks you to look down at something that repays the attention.',
    quote:'Close to the ground. The low object with the tallest presence.' },

  { code:'tp-078', name:'Goccia', slug:'goccia', category:'coffee-tables',
    subtitle:'an organic drop-form coffee table in travertine',
    desc:'An organic teardrop surface of travertine carried by a single sculpted arched base. The drop form is drawn from water; the material is stone\'s inversion of it.',
    quote:'The drop that never fell. Water\'s form in stone.' },

  { code:'tp-079', name:'Sigillo', slug:'sigillo', category:'coffee-tables',
    subtitle:'a rounded square coffee table in travertine',
    desc:'A rounded square of travertine on a low disc base — the seal of the atelier pressed horizontal and made permanent. Travertine\'s ancient laminations run through every face.',
    quote:'The seal pressed into the earth. The stamp, made surface.' },

  { code:'tp-082', name:'Lunare', slug:'lunare', category:'coffee-tables',
    subtitle:'a lunar coffee table in dark striated marble',
    desc:'A round table in dark striated marble, its surface split by a single notch — the moon in its first quarter, captured in the stone of midnight. The crescent as coffee table.',
    quote:'The first quarter. The crescent that rests and does not rise.' },

  { code:'tp-084', name:'Croce', slug:'croce', category:'coffee-tables',
    subtitle:'a cross-form travertine and oak coffee table',
    desc:'A cross-shaped composition: travertine and oak intersecting at right angles at floor level. Two materials, one gesture — the table as intersection.',
    quote:'Stone crosses wood. The crossroads at ground level.' },

  { code:'tp-086', name:'Fusione', slug:'fusione', category:'coffee-tables',
    subtitle:'a two-tone alabaster coffee table',
    desc:'White alabaster and dark Emperadore fragments fused into a single horizontal plane above contrasting base blocks — a study in the beauty of material opposition, held together by shared form.',
    quote:'Light stone, dark stone. The fusion that neither could achieve alone.' },

  { code:'tp-087', name:'Fiocco', slug:'fiocco', category:'coffee-tables',
    subtitle:'a scalloped-base coffee table in rose marble',
    desc:'A square of rose marble floats above a scalloped wave base — softness and strength meeting beneath the surface. The scallop draws on centuries of ornamental precedent; the material makes it immediate.',
    quote:'The wave below the surface. Softness that bears all the weight.' },

  { code:'tp-088', name:'Petto', slug:'petto', category:'coffee-tables',
    subtitle:'a rounded travertine coffee table',
    desc:'A softly rounded rectangle of travertine rests on a stepped pedestal — presence without aggression, weight without intimidation. The chest form, inverted and laid open.',
    quote:'The chest made horizontal. Stone that opens itself to the room.' },

  { code:'tp-089', name:'Territorio', slug:'territorio', category:'coffee-tables',
    subtitle:'a slab coffee table in striated grey marble',
    desc:'A vast slab of striated grey marble at ground level — a territory unto itself. Territorio requires space to be understood; it repays that space by anchoring everything around it.',
    quote:'The territory defined by its edges. A continent on the floor.' },

  { code:'tp-090', name:'Trifoglio', slug:'trifoglio', category:'coffee-tables',
    subtitle:'a round trefoil-base coffee table',
    desc:'A round disc of grey marble with a trefoil base — three arches supporting one circle, a resolution so complete it appears inevitable. The trefoil is structural; the disc is effortless.',
    quote:'Three arches, one circle. The resolution that required no alternatives.' },

  { code:'tp-091', name:'Distesa', slug:'distesa', category:'coffee-tables',
    subtitle:'a large plinth coffee table in Calacatta Viola',
    desc:'A great expanse of Calacatta Viola at low height — the table that commands the room without altitude. Distesa spreads; it does not rise. Its authority comes entirely from surface.',
    quote:'The expanse. The long horizontal that needs no height to dominate.' },

  // DINING TABLES
  { code:'tp-010', name:'Conica', slug:'conica', category:'dining-tables',
    subtitle:'an oval dining table on conical legs',
    desc:'A wide oval of Rosso Levanto carried by two conical legs — the architecture of the Italian piazza at your table. The legs taper with the certainty of something that has always stood this way.',
    quote:'The cone that carries everything. Ancient geometry, dining scale.' },

  { code:'tp-043', name:'Pilastro', slug:'pilastro', category:'dining-tables',
    subtitle:'an oval dining table on cylinder legs',
    desc:'A classic oval travertine top on two perfect cylinders — refined, timeless, and irreducible. The dining table as it would be if every excess were removed and what remained were kept.',
    quote:'The cylinder and the oval. Nothing borrowed, nothing left over.' },

  { code:'tp-046', name:'Giunone', slug:'giunone', category:'dining-tables',
    subtitle:'an oval Calacatta Viola dining table',
    desc:'A sweeping oval of Calacatta Viola balanced on two conical columns — Juno presiding over the feast. The drama of the stone matched by the authority of the form.',
    quote:'Juno at the table. The goddess of the feast made permanent in marble.' },

  { code:'tp-047', name:'Arcone', slug:'arcone', category:'dining-tables',
    subtitle:'an oval dining table on marble U-frames',
    desc:'A large oval in dark green marble rests above a series of marble U-frames — a great arch, multiplied and compressed into a dining base. Ancient engineering serving a modern table.',
    quote:'The arch, repeated. Structural logic made legible at dining height.' },

  { code:'tp-048', name:'Angolo', slug:'angolo', category:'dining-tables',
    subtitle:'a marble dining table with brass corners',
    desc:'A rectangular table wrapped in multicolour marble with brass corner columns — four materials meeting at four corners with complete deliberateness. The corner as the design decision.',
    quote:'Where four materials meet. The corner as the subject of the piece.' },

  { code:'tp-049', name:'Incisione', slug:'incisione', category:'dining-tables',
    subtitle:'an oval dining table with sawtooth base',
    desc:'A sweeping Verde Guatemala oval above a serrated geometric base — carved and fierce beneath, fluid above. The incision that defines the base is precise, almost surgical.',
    quote:'The serration below. The blade-cut base that carries the fluid form above.' },

  { code:'tp-051', name:'Volta', slug:'volta', category:'dining-tables',
    subtitle:'an oval dining table on a vaulted pedestal',
    desc:'A long oval of dark green marble over a single vaulted pedestal — one arch carrying everything. The vault is the oldest reliable structure in architecture; here it carries a table.',
    quote:'One vault, one surface. The simplest structural argument, dining scale.' },

  { code:'tp-052', name:'Monolite', slug:'monolite', category:'dining-tables',
    subtitle:'a rectangular dining table on a stone monolith',
    desc:'A rectangular surface of Verde Guatemala on a single massive slab pedestal — the dining table as monument. Monolite does not compromise between function and presence; it achieves both absolutely.',
    quote:'The monolith as pedestal. All the weight in one place, by design.' },

  { code:'tp-055', name:'Ottagonale', slug:'ottagonale', category:'dining-tables',
    subtitle:'a rectangular dining table on octagonal legs',
    desc:'A large rectangle of Nero Marquina on two clustered octagonal pillars — darkness and geometry in total agreement. Eight sides carry the weight that four would struggle to hold with this much confidence.',
    quote:'Eight sides. The octagon that was always the right answer for this load.' },

  { code:'tp-057', name:'Stele', slug:'stele', category:'dining-tables',
    subtitle:'a dining table on asymmetric stone bases',
    desc:'Two asymmetric block feet — one round, one square — carry a rectangular Calacatta top. The ancient stele: the standing marker, reborn as a dining table. The asymmetry is the honesty.',
    quote:'Round and square. Two forms beneath one surface, irresolvably different.' },

  { code:'tp-063', name:'Ruota', slug:'ruota', category:'dining-tables',
    subtitle:'a round split-top dining table in Calacatta Verde',
    desc:'A round table in Calacatta Verde split into two equal halves on a single rectangular pedestal. The circle divided — two complementary forms that require each other to be complete.',
    quote:'The circle split at its equator. Two halves that need each other.' },

  { code:'tp-080', name:'Fungo', slug:'fungo', category:'dining-tables',
    subtitle:'an oval dining table on a single pedestal',
    desc:'A wide oval disc floats above a single tapering cylinder — mushroom geometry at dining scale. The single point of support that keeps everything else in motion, arrested at the moment of perfection.',
    quote:'One point of support. All the confidence of the pedestal, dining scale.' },

  { code:'tp-102', name:'Solido', slug:'solido', category:'dining-tables',
    subtitle:'an oval travertine dining table',
    desc:'A rounded oval of blush travertine on a single solid pillar — warm, grounded, and permanent. Solido earns its name: there is nothing provisional about its form or its material.',
    quote:'The solid thing. Warm stone and a single column, nothing else needed.' },

  // BENCHES
  { code:'tp-034', name:'Getto', slug:'getto', category:'benches',
    subtitle:'a waterfall bench in dramatic marble',
    desc:'A waterfall bench of Calacatta black — the marble folds in one uninterrupted pour from seat to floor. The gesture is simple; the material execution, extraordinary.',
    quote:'The pour that stopped at the floor. Stone that remembers being liquid.' },

  { code:'tp-036', name:'Giacitura', slug:'giacitura', category:'benches',
    subtitle:'an upholstered marble bench',
    desc:'A long cream marble bench with a velvet cushion at one end — a place of rest between statement and comfort. The cushion acknowledges the body; the stone refuses to forget its nature.',
    quote:'Stone and velvet. The bench that holds both, without apology.' },

  { code:'tp-037', name:'Travetto', slug:'travetto', category:'benches',
    subtitle:'a marble and walnut beam bench',
    desc:'A Calacatta marble beam rests on two dark walnut cylinders — the timber beneath, the stone above. The small beam of the craftsman\'s vocabulary made into something for a considered room.',
    quote:'Timber holds stone. The builder\'s logic become the designer\'s statement.' },

  { code:'tp-038', name:'Riposo', slug:'riposo', category:'benches',
    subtitle:'a long bench in pink travertine',
    desc:'A long low bench of pink travertine on angled geometric feet — repose in the warmest of stones. Riposo invites you to stop; the material ensures the pause is worth taking.',
    quote:'The resting place. Warm stone at the scale of the body.' },

  { code:'tp-072', name:'Alcova', slug:'alcova', category:'benches',
    subtitle:'an onyx and velvet bench',
    desc:'A long oval of cream onyx with a chocolate velvet cushion — the alcove brought into the room. The private space made portable and placed wherever contemplation is required.',
    quote:'The alcove made portable. The private moment in public stone.' },

  // CABINETS
  { code:'tp-045', name:'Cassetto', slug:'cassetto', category:'cabinets',
    subtitle:'a three-drawer travertine cabinet',
    desc:'Three deep drawers of travertine set within a minimal frame — the drawer as monument. Cassetto is storage that makes no concessions to the idea that storage should be invisible.',
    quote:'Three openings in one surface. The drawer that dares to be furniture.' },

  { code:'tp-058', name:'Morbido', slug:'morbido', category:'credenzas',
    subtitle:'a curved-corner travertine credenza',
    desc:'A long credenza in travertine with softly rounded corners and flush push-open panels — gentleness at scale. The soft edge is a decision as radical as the form itself.',
    quote:'The soft corner. The credenza that refuses the right angle.' },

  { code:'tp-060', name:'Portico', slug:'portico', category:'credenzas',
    subtitle:'a rounded-end travertine credenza',
    desc:'A rounded-end travertine credenza with four fluted columns as legs — the porch of a great house made small enough for a room. The columns carry this weight the way they have always carried weight.',
    quote:'The porch brought inside. Four columns bearing one long surface.' },

  { code:'tp-061', name:'Taglio', slug:'taglio', category:'credenzas',
    subtitle:'an angled-door credenza in Calacatta Viola',
    desc:'Two angled push-open panels in Calacatta Viola on dark bronze legs — a credenza that opens like an aperture, revealing what it holds through the precise angle of the cut.',
    quote:'The cut that opens everything. The angle as invitation.' },

  // WASHBASINS
  { code:'tp-018', name:'Conca', slug:'conca', category:'washbasins',
    subtitle:'a trough washbasin in dark green marble',
    desc:'A deep trough carved from dark green marble — its softly rounded interior a basin for water and for a particular kind of contemplation. The conca: ancient in form, modern in execution.',
    quote:'The shell form in stone. Water in, water out, stone forever.' },

  { code:'tp-019', name:'Ovale', slug:'ovale', category:'washbasins',
    subtitle:'an oval freestanding washbasin in Nero Marquina',
    desc:'A freestanding oval basin in Nero Marquina — the egg form, hollowed and perfected. Dark marble veined with white lightning: every use of water makes the stone more itself.',
    quote:'The dark oval, hollowed. The egg that holds what it cannot become.' },

  { code:'tp-096', name:'Canale', slug:'canale', category:'washbasins',
    subtitle:'a channel washbasin in green marble',
    desc:'A broad marble channel with an integrated side shelf and brass fitting — a washbasin that becomes a ritual. The channel draws water from the broad surface to the drain with the authority of a river.',
    quote:'The channel cut by intention. Water follows the line the stone was given.' },

  { code:'tp-098', name:'Mensola', slug:'mensola', category:'washbasins',
    subtitle:'a wall-mounted Bianco Carrara washbasin',
    desc:'A wall-mounted Bianco Carrara basin with a chrome bracket shelf — lightness and precision in the bathroom. The shelf is the structure; the basin rests in it as water rests in the piece.',
    quote:'The bracket that bears the basin. Lightness achieved by engineering.' },

  { code:'tp-100', name:'Rigato', slug:'rigato', category:'washbasins',
    subtitle:'a grooved rectangular washbasin in Calacatta Viola',
    desc:'A rectangular vessel in Calacatta Viola with grooved panel detailing — the washbasin as architecture. The grooves are the detail that makes the surface legible at every scale.',
    quote:'The groove, repeated. The surface made readable by the line.' },

  { code:'tp-101', name:'Coppia', slug:'coppia', category:'washbasins',
    subtitle:'a pair of freestanding washbasins',
    desc:'Two freestanding monolithic washbasins in contrasting marbles — identical in form, opposed in stone. The pair as statement: the same gesture in two entirely different materials.',
    quote:'The same form, twice. Two stones that share a shape and nothing else.' },

  // COMPLIMENTS
  { code:'tp-030', name:'Luce', slug:'luce', category:'compliments',
    subtitle:'a backlit onyx lamp object',
    desc:'A bar of luminous honey onyx backlit from within, balanced on a single brushed steel cube — the object as lamp. Luce reveals what onyx has always kept hidden: the light that was already inside.',
    quote:'The light that was always there. Onyx lit from within, made visible.' },

  { code:'tp-031', name:'Trono', slug:'trono', category:'compliments',
    subtitle:'a marble stool with velvet cushion',
    desc:'A marble stepped pedestal crowned with a dark velvet cushion — the stool as ceremonial object. Trono takes the idea of the throne and removes its excess, leaving only the essential act of elevation.',
    quote:'The throne reduced. The elevation that remains when excess is removed.' },

  { code:'tp-032', name:'Spirale', slug:'spirale', category:'compliments',
    subtitle:'a looped tube sculpture in Verde Guatemala',
    desc:'Four ribbed rings of Verde Guatemala loop and coil — sculpture that becomes seating that becomes sculpture again. The spiral is the form\'s logic; the marble is the form\'s authority.',
    quote:'The coil in dark green. The spiral that holds and is held.' },

  { code:'tp-033', name:'Figura', slug:'figura', category:'compliments',
    subtitle:'a twin-column sculptural object',
    desc:'Two cylindrical columns of Calacatta Verde lean toward each other — a figure study in stone. Figura proposes an intimacy between forms that nothing can resolve and nothing should.',
    quote:'Two columns leaning. The figure that is never quite still.' },

  { code:'tp-041', name:'Nido', slug:'nido', category:'compliments',
    subtitle:'a marble stool with bouclé cushion',
    desc:'A deep pink marble cradle embraces a bouclé cushion — the nest made permanent in stone. The marble does the holding; the textile does the receiving. Neither could exist without the other.',
    quote:'The nest in rose marble. The holding form that precedes everything else.' },

  { code:'tp-042', name:'Fuoco', slug:'fuoco', category:'compliments',
    subtitle:'a fire pit coffee table in travertine',
    desc:'Travertine curved into an elliptical vessel, a linear flame running through its heart, carried on bronze stands. Fire and stone: the oldest pairing, made furniture at last.',
    quote:'Stone around fire. The oldest alliance, given a specific form.' },

  { code:'tp-093', name:'Tavola', slug:'tavola', category:'compliments',
    subtitle:'a standing marble panel in Calacatta Viola',
    desc:'A tall, upright panel of Calacatta Viola — a slab of the earth, displayed. Tavola asks nothing of the room except attention; in return it offers the unambiguous authority of material truth.',
    quote:'The slab, upright. The earth displayed at eye height.' },

  { code:'tp-095', name:'Obelisco', slug:'obelisco', category:'compliments',
    subtitle:'a tall column in Rosso Levanto',
    desc:'A tall rectangular column of Rosso Levanto — the obelisk, distilled to pure form. No hieroglyphs, no taper, no finial: only the stone and the vertical, in absolute agreement.',
    quote:'The obelisk without inscription. The vertical in Rosso Levanto, speaking for itself.' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getRelated(product) {
  const sameCategory = products.filter(p => p.category === product.category && p.code !== product.code);
  // Pick 3 — next in list, wrapping around
  const idx = sameCategory.findIndex(p => p.code === product.code);
  const picks = [];
  for (let i = 0; i < Math.min(3, sameCategory.length); i++) {
    picks.push(sameCategory[i % sameCategory.length]);
  }
  return picks;
}

function catLabel(cat) {
  return CAT[cat] ? CAT[cat].label : 'Object';
}

function catAnchor(cat) {
  return CAT[cat] ? CAT[cat].anchor : cat;
}

// ─── HTML TEMPLATE ───────────────────────────────────────────────────────────
function generatePage(p) {
  const cat  = CAT[p.category] || CAT['compliments'];
  const ed   = EDITORIAL[p.category] || EDITORIAL['compliments'];
  const ed1  = ed.e1(p.name);
  const ed2  = ed.e2(p.name);
  const faqs = cat.faq;
  const related = getRelated(p);

  const relatedHTML = related.map(r => `
      <a href="/product-${r.slug}.html" class="prod-card">
        <div class="prod-card__media">
          <img src="${img(r.code, '12_catalogue')}" alt="${r.name}" class="prod-card__img" loading="lazy" decoding="async">
        </div>
        <h3 class="prod-card__name">${r.name}</h3>
        <span class="prod-card__type">Marble ${catLabel(r.category)}</span>
      </a>`).join('');

  const relatedTitle = `More ${catLabel(p.category)}s`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} ${catLabel(p.category)} | TIBA STONE</title>
  <meta name="description" content="${p.name} — ${p.subtitle}. A bespoke marble ${catLabel(p.category).toLowerCase()} from Tiba Stone Atelier.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="image" href="${img(p.code, '12_catalogue')}" fetchpriority="high">
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-stone: #222323;
      --color-ivory: #FFFFFF;
      --color-sunset: #925638;
      --color-river-green: #A3996A;
      --color-dusk-blue: #153647;
      --color-moss: #3E402B;
      --color-sand: #F0EBE3;
      --color-warm-bg: #E8E2DA;
      --color-charcoal: #1A1A1B;
      --color-off-black: #111111;
      --font-display: 'Libre Baskerville', 'Baskerville', Georgia, serif;
      --font-body: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
      --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
      --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-dramatic: cubic-bezier(0.22, 1, 0.36, 1);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 17px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    body { background: var(--color-ivory); color: var(--color-stone); font-family: var(--font-body); font-weight: 400; line-height: 1.7; overflow-x: hidden; }
    body::before { content:''; position:fixed; inset:0; pointer-events:none; z-index:9998; opacity:0.028;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23g)'/%3E%3C/svg%3E");
      background-repeat:repeat; background-size:200px; }
    img { max-width:100%; height:auto; display:block; }
    a { color:inherit; text-decoration:none; }
    button { font-family:var(--font-body); border:none; background:none; cursor:pointer; }

    /* HEADER */
    .header { position:fixed; top:0; left:0; width:100%; z-index:1000; padding:1.25rem 0;
      background:rgba(255,255,255,0.96); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
      border-bottom:1px solid rgba(34,35,35,0.06); transition:padding 0.3s ease; }
    .header.is-scrolled { padding:0.875rem 0; }
    .header__inner { max-width:1600px; margin:0 auto; padding:0 clamp(1.5rem,4vw,4rem); display:flex; align-items:center; justify-content:space-between; }
    .header__logo { z-index:2; }
    .header__logo-img { height:22px; width:auto; }
    .header__nav { display:flex; gap:2.5rem; font-family:var(--font-body); font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; }
    .header__nav a { opacity:0.55; transition:opacity 0.3s ease; }
    .header__nav a:hover, .header__nav a.is-active { opacity:1; }
    .header__hamburger { display:none; flex-direction:column; gap:6px; width:24px; padding:0; cursor:pointer; z-index:2; }
    .header__hamburger span { display:block; height:1.5px; background:var(--color-stone); width:100%; }

    /* MOBILE MENU */
    .mobile-menu { position:fixed; inset:0; background:var(--color-stone); z-index:9999; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity 0.4s ease; }
    .mobile-menu.is-open { opacity:1; pointer-events:all; }
    .mobile-menu__close { position:absolute; top:1.5rem; right:1.5rem; font-size:2rem; color:var(--color-ivory); }
    .mobile-menu__nav { display:flex; flex-direction:column; align-items:center; gap:2rem; }
    .mobile-menu__nav a { font-family:var(--font-display); font-size:1.75rem; color:var(--color-ivory); opacity:0.7; transition:opacity 0.3s ease; }
    .mobile-menu__nav a:hover { opacity:1; }

    /* UTILITIES */
    .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.85s ease, transform 0.85s ease; }
    .reveal.is-visible { opacity:1; transform:translateY(0); }

    /* PRODUCT HERO */
    .product-hero { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; padding-top:70px; }
    .product-hero__gallery { position:relative; overflow:hidden; background:var(--color-sand); }
    .product-hero__main-img { width:100%; height:100%; object-fit:cover; min-height:60vh; transition:opacity 0.5s ease; cursor:zoom-in; }
    .product-hero__info { display:flex; flex-direction:column; justify-content:space-between; padding:clamp(6rem,10vw,10rem) clamp(2.5rem,5vw,5rem) clamp(3rem,5vw,5rem); }
    .product-hero__back { display:inline-flex; align-items:center; gap:0.35rem; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; opacity:0.45; transition:opacity 0.3s ease; margin-bottom:3rem; }
    .product-hero__back:hover { opacity:1; }
    .product-hero__back svg { width:14px; height:14px; stroke:currentColor; stroke-width:1.5; fill:none; }
    .product-hero__category { font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.25em; color:var(--color-river-green); margin-bottom:1rem; }
    .product-hero__title { font-family:var(--font-display); font-size:clamp(2.75rem,4.5vw,4.5rem); font-weight:400; line-height:1.1; margin-bottom:0.5rem; }
    .product-hero__subtitle { font-family:var(--font-display); font-style:italic; font-size:clamp(0.875rem,1.25vw,1.1rem); color:var(--color-river-green); margin-bottom:2rem; }
    .product-hero__rule { width:50px; height:2px; background:var(--color-sunset); margin-bottom:2rem; }
    .product-hero__desc { font-size:clamp(0.8rem,1vw,0.925rem); line-height:1.85; max-width:420px; margin-bottom:2.5rem; color:rgba(34,35,35,0.75); }

    /* BUTTONS */
    .btn { display:inline-block; padding:1.1rem 3rem; font-family:var(--font-body); font-size:0.8125rem; font-weight:500; text-transform:uppercase; letter-spacing:0.22em; position:relative; overflow:hidden; isolation:isolate; cursor:pointer; transition:color 0.6s var(--ease-dramatic),border-color 0.5s var(--ease-smooth); }
    .btn--dark { border:1px solid var(--color-stone); color:var(--color-stone); }
    .btn--dark::before { content:''; position:absolute; inset:0; background:var(--color-stone); z-index:-1; transform:scaleX(0); transform-origin:left; transition:transform 0.7s var(--ease-dramatic); }
    .btn--dark::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:var(--color-sunset); transform:scaleX(0); transform-origin:left; transition:transform 0.55s var(--ease-spring); z-index:2; }
    .btn--dark:hover { color:var(--color-ivory); }
    .btn--dark:hover::before { transform:scaleX(1); }
    .btn--dark:hover::after { transform:scaleX(1); transition-delay:0.12s; }
    .btn--light { border:1px solid rgba(255,255,255,0.25); color:var(--color-ivory); }
    .btn--light::before { content:''; position:absolute; inset:0; background:var(--color-ivory); z-index:-1; transform:scaleX(0); transform-origin:left; transition:transform 0.7s var(--ease-dramatic); }
    .btn--light::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:var(--color-sunset); transform:scaleX(0); transform-origin:left; transition:transform 0.55s var(--ease-spring); z-index:2; }
    .btn--light:hover { color:var(--color-stone); border-color:var(--color-ivory); }
    .btn--light:hover::before { transform:scaleX(1); }
    .btn--light:hover::after { transform:scaleX(1); transition-delay:0.12s; }
    .btn--text { padding:0; border:none !important; position:relative; color:var(--color-stone); font-weight:500; transition:color 0.5s var(--ease-smooth); }
    .btn--text::before { display:none; }
    .btn--text::after { content:''; position:absolute; bottom:-5px; left:0; width:100%; height:1px; background:var(--color-sunset); transform:scaleX(0.2); transform-origin:left; transition:transform 0.6s var(--ease-spring); }
    .btn--text:hover { color:var(--color-sunset); }
    .btn--text:hover::after { transform:scaleX(1); }

    /* GALLERY STRIP */
    .gallery-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
    .gallery-strip__item { overflow:hidden; cursor:pointer; }
    .gallery-strip__img { width:100%; aspect-ratio:1; object-fit:cover; transition:transform 0.8s var(--ease-dramatic); }
    .gallery-strip__item:hover .gallery-strip__img { transform:scale(1.04); }

    /* EDITORIAL */
    .editorial { display:grid; grid-template-columns:1fr 1fr; min-height:80vh; }
    .editorial--reverse .editorial__media { order:2; }
    .editorial--reverse .editorial__content { order:1; }
    .editorial__media { overflow:hidden; }
    .editorial__img { width:100%; height:100%; object-fit:cover; }
    .editorial__content { display:flex; flex-direction:column; justify-content:center; padding:clamp(3rem,6vw,6rem) clamp(2.5rem,5vw,5rem); }
    .editorial__content--dark { background:var(--color-charcoal); color:var(--color-ivory); }
    .editorial__content--sand { background:var(--color-sand); }
    .editorial__label { font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.3em; color:var(--color-river-green); margin-bottom:1.25rem; }
    .editorial__content--dark .editorial__label { color:rgba(255,255,255,0.4); }
    .editorial__heading { font-family:var(--font-display); font-size:clamp(2rem,3.5vw,3rem); font-weight:400; line-height:1.2; margin-bottom:1.75rem; }
    .editorial__text { font-size:clamp(0.8rem,1vw,0.925rem); line-height:1.85; max-width:420px; margin-bottom:2.5rem; color:rgba(34,35,35,0.7); }
    .editorial__content--dark .editorial__text { color:rgba(255,255,255,0.6); }

    /* MATERIALS */
    .materials { padding:clamp(5rem,10vw,10rem) clamp(2rem,5vw,5rem); }
    .materials__inner { max-width:1320px; margin:0 auto; display:grid; grid-template-columns:1.1fr 1fr; gap:clamp(3rem,6vw,6rem); align-items:center; }
    .materials__media img { width:100%; border-radius:4px; }
    .materials__label { font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.3em; color:var(--color-river-green); margin-bottom:1rem; }
    .materials__title { font-family:var(--font-display); font-size:clamp(1.75rem,3vw,2.5rem); font-weight:400; margin-bottom:1.5rem; }
    .materials__text { font-size:clamp(0.8rem,1vw,0.925rem); line-height:1.85; color:rgba(34,35,35,0.7); margin-bottom:1.5rem; }
    .materials__note { font-size:0.8rem; font-style:italic; color:var(--color-river-green); margin-bottom:2rem; }

    /* SPECS */
    .specs { padding:clamp(4rem,8vw,8rem) clamp(2rem,5vw,5rem); background:var(--color-sand); }
    .specs__header { max-width:1320px; margin:0 auto 3rem; }
    .specs__label { font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.3em; color:var(--color-river-green); margin-bottom:0.75rem; }
    .specs__title { font-family:var(--font-display); font-size:clamp(1.75rem,3vw,2.5rem); font-weight:400; }
    .specs__grid { max-width:1320px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:start; }
    .specs__drawing img { width:100%; aspect-ratio:4/3; object-fit:contain; background:var(--color-ivory); padding:2rem; }
    .specs__table { width:100%; border-collapse:collapse; }
    .specs__table tr { border-bottom:1px solid rgba(34,35,35,0.08); }
    .specs__table td { padding:1rem 0; font-size:0.875rem; vertical-align:top; }
    .specs__table td:first-child { font-weight:600; text-transform:uppercase; letter-spacing:0.1em; font-size:0.75rem; color:var(--color-river-green); width:35%; padding-right:1.5rem; }

    /* QUOTE BANNER */
    .quote-banner { background:var(--color-dusk-blue); padding:clamp(4rem,8vw,7rem) clamp(2rem,5vw,5rem); text-align:center; }
    .quote-banner__text { font-family:var(--font-display); font-size:clamp(1.1rem,2vw,1.5rem); line-height:1.7; color:rgba(255,255,255,0.8); max-width:720px; margin:0 auto; }

    /* FAQ */
    .faq { padding:clamp(5rem,10vw,10rem) clamp(2rem,5vw,5rem); }
    .faq__inner { max-width:1320px; margin:0 auto; display:grid; grid-template-columns:1fr 1.5fr; gap:4rem; }
    .faq__label { font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.3em; color:var(--color-river-green); margin-bottom:1rem; display:block; }
    .faq__title { font-family:var(--font-display); font-size:clamp(1.5rem,2.5vw,2rem); font-weight:400; line-height:1.35; margin-bottom:1.5rem; }
    .faq-item { border-bottom:1px solid rgba(34,35,35,0.08); }
    .faq-item__q { width:100%; display:flex; justify-content:space-between; align-items:center; padding:1.25rem 0; font-size:0.875rem; font-weight:500; text-align:left; gap:1rem; cursor:pointer; }
    .faq-item__icon { font-size:1.1rem; font-weight:300; transition:transform 0.3s ease; flex-shrink:0; }
    .faq-item__a { max-height:0; overflow:hidden; transition:max-height 0.4s var(--ease-spring); }
    .faq-item.is-open .faq-item__a { max-height:300px; }
    .faq-item.is-open .faq-item__icon { transform:rotate(45deg); }
    .faq-item__a p { padding-bottom:1.25rem; font-size:0.875rem; line-height:1.8; color:rgba(34,35,35,0.65); }

    /* RELATED */
    .related { padding:clamp(4rem,8vw,7rem) clamp(2rem,5vw,5rem); background:var(--color-sand); }
    .related__header { max-width:1320px; margin:0 auto 2.5rem; display:flex; justify-content:space-between; align-items:baseline; }
    .related__title { font-family:var(--font-display); font-size:clamp(1.5rem,2.5vw,2rem); font-weight:400; }
    .related__link { font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; opacity:0.5; transition:opacity 0.3s ease; }
    .related__link:hover { opacity:1; }
    .related__grid { max-width:1320px; margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
    .prod-card { display:block; }
    .prod-card__media { overflow:hidden; margin-bottom:1rem; aspect-ratio:4/5; }
    .prod-card__img { width:100%; height:100%; object-fit:cover; transition:transform 0.6s var(--ease-dramatic); }
    .prod-card:hover .prod-card__img { transform:scale(1.03); }
    .prod-card__name { font-family:var(--font-display); font-size:1rem; font-weight:400; margin-bottom:0.2rem; }
    .prod-card__type { font-size:0.75rem; font-weight:500; text-transform:uppercase; letter-spacing:0.15em; color:var(--color-river-green); }

    /* INQUIRY */
    .inquiry { background:var(--color-charcoal); color:var(--color-ivory); }
    .inquiry__inner { max-width:1320px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:0; }
    .inquiry__media { position:sticky; top:0; height:100vh; overflow:hidden; }
    .inquiry__preview { width:100%; height:100%; object-fit:cover; transition:opacity 0.3s ease; }
    .inquiry__media-thumbs { position:absolute; bottom:2rem; left:50%; transform:translateX(-50%); display:flex; gap:0.5rem; }
    .inquiry__media-thumb { width:48px; height:48px; object-fit:cover; cursor:pointer; opacity:0.5; border:2px solid transparent; transition:opacity 0.3s ease,border-color 0.3s ease; }
    .inquiry__media-thumb:hover { opacity:0.8; }
    .inquiry__media-thumb.is-active { opacity:1; border-color:var(--color-ivory); }
    .inquiry__form-col { padding:clamp(5rem,8vw,8rem) clamp(2.5rem,4vw,4rem); display:flex; flex-direction:column; justify-content:center; }
    .inquiry__label { font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.3em; color:var(--color-river-green); margin-bottom:1rem; }
    .inquiry__heading { font-family:var(--font-display); font-size:clamp(1.75rem,3vw,2.5rem); font-weight:400; margin-bottom:1rem; }
    .inquiry__text { font-size:clamp(0.8rem,1vw,0.875rem); line-height:1.8; color:rgba(255,255,255,0.55); margin-bottom:2.5rem; max-width:400px; }
    .inquiry__form { display:flex; flex-direction:column; gap:1rem; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group--full { grid-column:1/-1; }
    .form-input, .form-textarea { width:100%; padding:0.875rem 0; background:none; border:none; border-bottom:1px solid rgba(255,255,255,0.15); color:var(--color-ivory); font-family:var(--font-body); font-size:0.875rem; transition:border-color 0.3s ease; outline:none; }
    .form-input:focus, .form-textarea:focus { border-color:rgba(255,255,255,0.5); }
    .form-input::placeholder, .form-textarea::placeholder { color:rgba(255,255,255,0.3); }
    .form-textarea { resize:vertical; min-height:80px; }
    .form-consent { display:flex; gap:0.75rem; align-items:flex-start; margin-top:0.5rem; }
    .form-consent input[type="checkbox"] { margin-top:3px; accent-color:var(--color-sunset); }
    .form-consent label { font-size:0.75rem; line-height:1.6; color:rgba(255,255,255,0.4); }
    .form-consent a { text-decoration:underline; }

    /* FOOTER */
    .footer { background:var(--color-off-black); color:rgba(255,255,255,0.55); padding:clamp(4rem,8vw,6rem) clamp(2rem,5vw,5rem) 2rem; }
    .footer__grid { max-width:1320px; margin:0 auto 3rem; display:grid; grid-template-columns:1.5fr 1fr 1fr 1.5fr; gap:3rem; }
    .footer__logo { height:40px; width:auto; opacity:0.6; margin-bottom:1rem; }
    .footer__tagline { font-size:0.8125rem; font-style:italic; margin-bottom:1.5rem; }
    .footer__social { display:flex; gap:1rem; }
    .footer__social a svg { width:18px; height:18px; fill:rgba(255,255,255,0.4); transition:fill 0.3s ease; }
    .footer__social a:hover svg { fill:rgba(255,255,255,0.8); }
    .footer__col-title { font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.2em; color:rgba(255,255,255,0.3); margin-bottom:1.25rem; }
    .footer__link { display:block; font-size:0.875rem; margin-bottom:0.6rem; transition:color 0.3s ease; }
    .footer__link:hover { color:rgba(255,255,255,0.9); }
    .footer__contact p { font-size:0.875rem; margin-bottom:0.4rem; }
    .footer-form { display:flex; flex-direction:column; gap:0.75rem; }
    .footer-form__input, .footer-form__textarea { width:100%; padding:0.6rem 0; background:none; border:none; border-bottom:1px solid rgba(255,255,255,0.1); color:var(--color-ivory); font-family:var(--font-body); font-size:0.8125rem; outline:none; }
    .footer-form__input::placeholder, .footer-form__textarea::placeholder { color:rgba(255,255,255,0.25); }
    .footer-form__textarea { resize:none; }
    .footer__bottom { max-width:1320px; margin:0 auto; padding-top:2rem; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; }
    .footer__legal { display:flex; gap:1.5rem; }
    .footer__legal a { opacity:0.5; transition:opacity 0.3s ease; }
    .footer__legal a:hover { opacity:1; }

    /* LIGHTBOX */
    .lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:10000; display:flex; align-items:center; justify-content:center; cursor:zoom-out; opacity:0; pointer-events:none; transition:opacity 0.3s ease; }
    .lightbox.is-open { opacity:1; pointer-events:all; }
    .lightbox img { max-width:90%; max-height:90vh; object-fit:contain; }

    /* RESPONSIVE */
    @media (max-width:1023px) {
      .product-hero { grid-template-columns:1fr; }
      .product-hero__gallery { order:-1; }
      .editorial { grid-template-columns:1fr; }
      .editorial--reverse .editorial__media { order:-1; }
      .editorial--reverse .editorial__content { order:0; }
      .materials__inner { grid-template-columns:1fr; }
      .specs__grid { grid-template-columns:1fr; }
      .faq__inner { grid-template-columns:1fr; }
      .inquiry__inner { grid-template-columns:1fr; }
      .inquiry__media { position:relative; height:50vh; }
      .related__grid { grid-template-columns:repeat(2,1fr); }
      .footer__grid { grid-template-columns:1fr 1fr; }
    }
    @media (max-width:767px) {
      .header__nav { display:none; }
      .header__hamburger { display:flex; }
      .product-hero__info { padding:2rem 1.25rem; }
      .product-hero__main-img { min-height:45vh; }
      .gallery-strip { grid-template-columns:repeat(2,1fr); }
      .form-row { grid-template-columns:1fr; }
      .related__grid { grid-template-columns:1fr; }
      .footer__grid { grid-template-columns:1fr; gap:2rem; }
      .footer__bottom { flex-direction:column; gap:0.75rem; text-align:center; }
    }
  </style>
</head>
<body>

  <header class="header" id="siteHeader">
    <div class="header__inner">
      <a href="/" class="header__logo">
        <img src="assets/tiba-logo-landscape.webp" alt="TIBA Stone" class="header__logo-img">
      </a>
      <nav class="header__nav">
        <a href="/">Home</a>
        <a href="/craft">Craft</a>
        <a href="/slabs">Slabs</a>
        <a href="/catalog" class="is-active">Collection</a>
        <a href="/contact">Contact</a>
      </nav>
      <button class="header__hamburger" id="hamburgerBtn" aria-label="Open menu">
        <span></span><span></span>
      </button>
    </div>
  </header>

  <div class="mobile-menu" id="mobileMenu">
    <button class="mobile-menu__close" id="mobileMenuClose" aria-label="Close menu">&times;</button>
    <nav class="mobile-menu__nav">
      <a href="/">Home</a>
      <a href="/craft">Craft</a>
      <a href="/slabs">Slabs</a>
      <a href="/catalog">Collection</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>

  <section class="product-hero">
    <div class="product-hero__gallery">
      <img src="${img(p.code, '12_catalogue')}"
           alt="${p.name} — ${p.subtitle}"
           class="product-hero__main-img"
           id="heroMainImg"
           loading="eager" fetchpriority="high">
    </div>
    <div class="product-hero__info">
      <a href="/catalog#${catAnchor(p.category)}" class="product-hero__back">
        <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Collection
      </a>
      <div>
        <p class="product-hero__category">${catLabel(p.category)}</p>
        <h1 class="product-hero__title">${p.name}</h1>
        <p class="product-hero__subtitle">${p.subtitle}</p>
        <div class="product-hero__rule"></div>
        <p class="product-hero__desc">${p.desc}</p>
        <a href="#inquiry" class="btn btn--dark">Request a Quote</a>
      </div>
    </div>
  </section>

  <div class="gallery-strip">
    <div class="gallery-strip__item">
      <img src="${img(p.code, '01_editorial')}" alt="${p.name} editorial" class="gallery-strip__img" loading="lazy" decoding="async">
    </div>
    <div class="gallery-strip__item">
      <img src="${img(p.code, '03_closeup_veining')}" alt="${p.name} veining" class="gallery-strip__img" loading="lazy" decoding="async">
    </div>
    <div class="gallery-strip__item">
      <img src="${img(p.code, '04_closeup_edge')}" alt="${p.name} edge" class="gallery-strip__img" loading="lazy" decoding="async">
    </div>
    <div class="gallery-strip__item">
      <img src="${img(p.code, '05_closeup_surface')}" alt="${p.name} surface" class="gallery-strip__img" loading="lazy" decoding="async">
    </div>
  </div>

  <section class="editorial reveal">
    <div class="editorial__media">
      <img src="${img(p.code, '07_workshop')}" alt="${p.name} in the atelier" class="editorial__img" loading="lazy" decoding="async">
    </div>
    <div class="editorial__content editorial__content--dark">
      <span class="editorial__label">${ed1.label}</span>
      <h2 class="editorial__heading">${ed1.heading}</h2>
      <p class="editorial__text">${ed1.text}</p>
      <a href="#inquiry" class="btn btn--light" style="align-self:flex-start;">Begin Your Project</a>
    </div>
  </section>

  <section class="editorial editorial--reverse reveal">
    <div class="editorial__media">
      <img src="${img(p.code, '02_human')}" alt="${p.name} at human scale" class="editorial__img" loading="lazy" decoding="async">
    </div>
    <div class="editorial__content editorial__content--sand">
      <span class="editorial__label">${ed2.label}</span>
      <h2 class="editorial__heading">${ed2.heading}</h2>
      <p class="editorial__text">${ed2.text}</p>
      <a href="/craft" class="btn btn--text" style="align-self:flex-start;">Discover Our Craft</a>
    </div>
  </section>

  <section class="materials reveal" id="materials">
    <div class="materials__inner">
      <div class="materials__media">
        <img src="${img(p.code, '12_catalogue')}" alt="${p.name} stone selection" id="materialsMainImg" loading="lazy" decoding="async">
      </div>
      <div>
        <span class="materials__label">Stone &amp; Surface</span>
        <h2 class="materials__title">Stone Selection</h2>
        <p class="materials__text">${p.name} is available across our full palette of natural stones — from the deep drama of Rosso Levanto and Nero Marquina to the warm stillness of travertine and the luminous complexity of Calacatta Viola. Every stone changes the character of the piece; every piece changes how you read the stone.</p>
        <p class="materials__note">Stone variants for this piece are in preparation. Contact us to discuss your preferred material.</p>
        <a href="#inquiry" class="btn btn--dark">Inquire About Stone</a>
      </div>
    </div>
  </section>

  <section class="specs reveal" id="specs">
    <div class="specs__header">
      <span class="specs__label">Construction</span>
      <h2 class="specs__title">Technical Specifications</h2>
    </div>
    <div class="specs__grid">
      <div class="specs__drawing">
        <img src="${img(p.code, '11_technical')}" alt="${p.name} technical drawing" loading="lazy" decoding="async">
      </div>
      <table class="specs__table">
        <tr><td>Type</td><td>${catLabel(p.category)}</td></tr>
        <tr><td>Finish</td><td>${cat.finish}</td></tr>
        <tr><td>Material</td><td>Natural stone — multiple options available</td></tr>
        <tr><td>Lead time</td><td>${cat.leadtime} from confirmed order</td></tr>
        <tr><td>Custom sizing</td><td>Available on request</td></tr>
        <tr><td>Dimensions</td><td>${cat.dims}</td></tr>
        <tr><td>Weight</td><td>${cat.weight}</td></tr>
      </table>
    </div>
  </section>

  <section class="quote-banner">
    <p class="quote-banner__text reveal"><em>${p.quote}</em></p>
  </section>

  <section class="faq reveal">
    <div class="faq__inner">
      <div>
        <span class="faq__label">Questions</span>
        <h2 class="faq__title">You have questions?<br>We have answers.</h2>
        <a href="/contact" class="btn btn--text">Or speak with us</a>
      </div>
      <div>
        ${faqs.map(f => `
        <div class="faq-item">
          <button class="faq-item__q"><span>${f.q}</span><span class="faq-item__icon">+</span></button>
          <div class="faq-item__a"><p>${f.a}</p></div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="related reveal">
    <div class="related__header">
      <h2 class="related__title">${relatedTitle}</h2>
      <a href="/catalog#${catAnchor(p.category)}" class="related__link">View All</a>
    </div>
    <div class="related__grid">
      ${relatedHTML}
    </div>
  </section>

  <section class="inquiry" id="inquiry">
    <div class="inquiry__inner">
      <div class="inquiry__media reveal">
        <img src="${img(p.code, '01_editorial')}" alt="${p.name} preview" class="inquiry__preview" id="inquiryPreviewImg">
        <div class="inquiry__media-thumbs">
          <img src="${img(p.code, '01_editorial')}" alt="Editorial" class="inquiry__media-thumb is-active" data-index="0" loading="lazy">
          <img src="${img(p.code, '02_human')}" alt="Scale" class="inquiry__media-thumb" data-index="1" loading="lazy">
          <img src="${img(p.code, '12_catalogue')}" alt="Studio" class="inquiry__media-thumb" data-index="2" loading="lazy">
          <img src="${img(p.code, '07_workshop')}" alt="Workshop" class="inquiry__media-thumb" data-index="3" loading="lazy">
        </div>
      </div>
      <div class="inquiry__form-col reveal">
        <span class="inquiry__label">Made to Order</span>
        <h2 class="inquiry__heading">Commission your ${p.name}</h2>
        <p class="inquiry__text">Every ${p.name} begins with a stone selection. Inquire to begin a conversation about material, dimensions, and finish.</p>
        <form class="inquiry__form" id="inquiryForm">
          <input type="hidden" name="product" value="${p.name} ${catLabel(p.category)}">
          <div class="form-row">
            <div><input type="text" name="firstName" class="form-input" placeholder="First Name" required></div>
            <div><input type="text" name="lastName" class="form-input" placeholder="Last Name" required></div>
          </div>
          <div class="form-row">
            <div><input type="email" name="email" class="form-input" placeholder="Email" required></div>
            <div><input type="tel" name="phone" class="form-input" placeholder="Phone"></div>
          </div>
          <div class="form-row">
            <div class="form-group--full">
              <textarea name="message" class="form-textarea" placeholder="Your message &mdash; stone preference, dimensions, project details&hellip;" rows="4"></textarea>
            </div>
          </div>
          <div class="form-consent">
            <input type="checkbox" id="consent" name="consent" required>
            <label for="consent">I agree to the <a href="/privacy">Privacy Policy</a> and consent to being contacted about my inquiry.</label>
          </div>
          <button type="submit" class="btn btn--light">Send Inquiry</button>
        </form>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="footer__grid">
      <div>
        <img src="assets/tiba-logo-portrait.webp" alt="TIBA Stone" class="footer__logo" loading="lazy" decoding="async">
        <p class="footer__tagline">Bespoke Marble Atelier</p>
        <div class="footer__social">
          <a href="https://instagram.com/tibaliving" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
      </div>
      <div>
        <h4 class="footer__col-title">Navigate</h4>
        <a href="/" class="footer__link">Home</a>
        <a href="/craft" class="footer__link">Craft</a>
        <a href="/slabs" class="footer__link">Slabs</a>
        <a href="/catalog" class="footer__link">Collection</a>
        <a href="/contact" class="footer__link">Contact</a>
      </div>
      <div class="footer__contact">
        <h4 class="footer__col-title">Visit</h4>
        <p>Tiba Stone Atelier</p>
        <p><a href="mailto:contact@tibaliving.com">contact@tibaliving.com</a></p>
        <p><a href="tel:+6281239442648">+62 81239442648</a></p>
      </div>
      <div>
        <h4 class="footer__col-title">Inquire</h4>
        <form class="footer-form" id="footerForm">
          <input type="text" name="name" placeholder="Name" class="footer-form__input" required>
          <input type="email" name="email" placeholder="Email" class="footer-form__input" required>
          <textarea name="message" placeholder="Message" class="footer-form__textarea" rows="3" required></textarea>
          <button type="submit" class="btn btn--light">Send</button>
        </form>
      </div>
    </div>
    <div class="footer__bottom">
      <p>&copy; 2026 Tiba Stone. All rights reserved.</p>
      <div class="footer__legal">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms</a>
      </div>
    </div>
  </footer>

  <div class="lightbox" id="lightbox"><img src="" alt=""></div>

  <script>
    (function(){
      'use strict';
      var header=document.getElementById('siteHeader'),ticking=false;
      window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(function(){header.classList.toggle('is-scrolled',window.scrollY>60);ticking=false;});ticking=true;}},{passive:true});
      var hamburger=document.getElementById('hamburgerBtn'),menu=document.getElementById('mobileMenu'),menuClose=document.getElementById('mobileMenuClose');
      hamburger.addEventListener('click',function(){menu.classList.add('is-open');document.body.style.overflow='hidden';});
      menuClose.addEventListener('click',function(){menu.classList.remove('is-open');document.body.style.overflow='';});
      menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('is-open');document.body.style.overflow='';});});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'){menu.classList.remove('is-open');document.body.style.overflow='';}});
      var reveals=document.querySelectorAll('.reveal');
      var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}});},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
      reveals.forEach(function(el){obs.observe(el);});
      document.querySelectorAll('.faq-item__q').forEach(function(btn){btn.addEventListener('click',function(){var item=btn.parentElement,wasOpen=item.classList.contains('is-open');document.querySelectorAll('.faq-item.is-open').forEach(function(open){open.classList.remove('is-open');});if(!wasOpen)item.classList.add('is-open');});});
      var inquiryImg=document.getElementById('inquiryPreviewImg');
      document.querySelectorAll('.inquiry__media-thumb').forEach(function(thumb){thumb.addEventListener('click',function(){document.querySelector('.inquiry__media-thumb.is-active').classList.remove('is-active');thumb.classList.add('is-active');inquiryImg.style.opacity='0';setTimeout(function(){inquiryImg.src=thumb.src;inquiryImg.style.opacity='1';},250);});});
      var lb=document.getElementById('lightbox'),lbImg=lb.querySelector('img');
      document.querySelectorAll('.gallery-strip__item,.product-hero__main-img').forEach(function(el){el.addEventListener('click',function(){var src=el.tagName==='IMG'?el.src:el.querySelector('img').src;lbImg.src=src;lb.classList.add('is-open');document.body.style.overflow='hidden';});});
      lb.addEventListener('click',function(){lb.classList.remove('is-open');document.body.style.overflow='';});
      document.querySelectorAll('.gallery-strip__img,.prod-card__img,.editorial__img').forEach(function(img){img.style.opacity='0';img.style.transition='opacity 0.8s ease';function show(){img.style.opacity='1';}if(img.complete&&img.naturalHeight!==0)show();else img.addEventListener('load',show);});
      ['inquiryForm','footerForm'].forEach(function(id){
        var form=document.getElementById(id);if(!form)return;
        form.addEventListener('submit',function(e){
          e.preventDefault();
          var btn=form.querySelector('button[type="submit"]');
          var orig=btn.textContent;btn.textContent='Sending\u2026';btn.disabled=true;
          fetch('https://formspree.io/f/xvgolnjw',{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
            .then(function(r){btn.textContent=r.ok?'Sent':'Error';if(r.ok)form.reset();})
            .catch(function(){btn.textContent='Error';})
            .finally(function(){setTimeout(function(){btn.textContent=orig;btn.disabled=false;},3000);});
        });
      });
    })();
  </script>
</body>
</html>`;
}

// ─── GENERATE ALL PAGES ────────────────────────────────────────────────────────
let generated = 0;
products.forEach(function(p) {
  const html     = generatePage(p);
  const filename = `product-${p.slug}.html`;
  const outpath  = path.join(SITE_ROOT, filename);
  fs.writeFileSync(outpath, html, 'utf8');
  generated++;
  process.stdout.write(`\r  Generated ${generated}/${products.length}: product-${p.slug}.html`);
});

console.log(`\n\n✓ ${generated} product pages written to ${SITE_ROOT}`);
console.log('\nFiles created:');
products.forEach(p => console.log(`  product-${p.slug}.html  (${p.code} — ${p.name})`));
