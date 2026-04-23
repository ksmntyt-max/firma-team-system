import { useState, useRef, useCallback, useEffect } from 'react'

const WHITELISTED = new Set([
  'info@mycryptoguru.co.uk',
  'ksmntyt@gmail.com',
  'creativeclarky@gmail.com',
  'curtis@firmcollective.org',
])

const KNOWN_ACCOUNTS = [
  { name: 'Karl Samonte', email: 'ksmntyt@gmail.com', initials: 'K', color: '#4285F4' },
  { name: 'Creative Clarky', email: 'creativeclarky@gmail.com', initials: 'C', color: '#EA4335' },
  { name: 'Crypto Guru', email: 'info@mycryptoguru.co.uk', initials: 'G', color: '#34A853' },
  { name: 'Curtis', email: 'Curtis@firmcollective.org', initials: 'C', color: '#FBBC05' },
]

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// SHA-256 of the access password — plain text never stored in source
const ACCESS_HASH = '92f7df677126c8eb72339b6fe83c2407fca44c58c34d218eb475327de43dc51c'
const PROTECTED = new Set(['planner', 'notes', 'atlas'])

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const INITIAL_TASKS = [
  { id: 1, title: 'Bataan HQ Visit', category: 'DEPLOYMENT', priority: 'high', assignee: '@Karl', date: '2026-04-30', status: 'inprogress' },
]

const INITIAL_DOCUMENTS = [
]

// ── STRUCTURED ARCHITECTURE DOCS ──────────────────────────────────────────────
// Each doc uses a `blocks` array. Block types:
//   context | key-insight | sequence | phase | section | table | layers | two-col | outcome
// Fallback: if no blocks, renders plain `content` text.

const INITIAL_ARCH_DOCS = [
  {
    id: 'bless',
    title: 'BLESS',
    section: 'Foundation',
    badge: 'Land System',
    subtitle: 'Bataan Land Evaluation for Sustainable Settlements',
    description: 'West Luzon Corridor · Land Assessment Platform',
    externalUrl: 'https://firma-blis.vercel.app/',
    blocks: [],
  },
  {
    id: 'bataan-framework',
    title: 'BATAAN FRAMEWORK',
    section: 'Foundation',
    badge: 'Framework',
    subtitle: 'Firma Sovereign Foundation · Asia-Pacific Deployment Strategy',
    description: 'West Luzon Corridor · 2026–2028 · V1.0',
    thesis: 'Establish Bataan as Firma\'s primary Asia-Pacific operational headquarters — a sovereign-grade zone corridor functioning as a Settlemint anchor, logistics gateway, and compliance-ready base for all Southeast Asian operations.',
    blocks: [
      {
        type: 'context',
        content: 'The corridor operates across three sites: Dinalupihan (HQ), Mariveles/AFAB (zone operations), and SBFZ (logistics and international gateway). Each site holds a distinct operational role within Firma\'s sovereign infrastructure stack. The legal and registration structure must be established in the correct sequence to unlock zone incentives and land rights.'
      },
      {
        type: 'key-insight',
        title: 'KEY STRUCTURAL DECISION: 60/40 OWNERSHIP',
        content: 'Foreign corporations cannot purchase land in the Philippines. Land ownership is restricted to Filipino citizens and corporations with at least 60% Filipino equity. Since Phase 3 is land acquisition, the corporation must be structured 60% Filipino / 40% foreign from day one — not retrofitted later.'
      },
      {
        type: 'sequence',
        label: 'Registration Sequence',
        steps: ['SEC', 'SBFZ', 'Office Setup', 'FAB', 'Land Acquisition']
      },
      {
        type: 'phase',
        title: 'Phase 1 — Foundation',
        period: 'Month 0–3',
        theme: 'Legal entity formation — SEC first, SBFZ second',
        timeline: '2.5–3 months',
        rows: [
          { step: 1, action: 'SEC Registration', detail: 'File Articles of Incorporation under RA 11232 with 60/40 ownership structure. Authorized capital: ₱20,000,000. Appoint Corporate Secretary (must be Filipino resident).', time: '2–4 weeks' },
          { step: 2, action: 'Open Corporate Bank Account', detail: 'Required for capitalization proof before SBMA application.', time: '1–2 weeks' },
          { step: 3, action: 'Prepare SBMA Application Package', detail: 'LOI to SBMA Chairman, business plan + financial projections, company profile, risk & safety assessment, SEC cert + Articles, bank capitalization proof.', time: '2–3 weeks' },
          { step: 4, action: 'Submit SBMA Application', detail: 'File via One-Stop Shop or online portal. Fee: ₱5,000. SBMA review period.', time: '1–3 months' },
          { step: 5, action: 'Obtain CRTE', detail: 'Certificate of Registration and Tax Exemption. Unlocks 5% GIT, duty-free imports, VAT zero-rating.', time: 'Upon SBMA approval' },
          { step: 6, action: 'BIR Registration', detail: 'TIN, COR, authority to print invoices via BIR Form 1903. Fee: ₱500.', time: '2–4 weeks' },
          { step: 7, action: 'SSS / PhilHealth / Pag-IBIG', detail: 'Register for all employees. Under 10 employees = simplified remittance.', time: '1–2 weeks' },
          { step: 8, action: 'Secure SBFZ Physical Lease (HQ Office)', detail: 'SBMA requires actual presence. Target a larger commercial unit — meeting rooms, team workspace, operations hub. Rate: ~₱50–200/sqm/month depending on district.', time: '1–2 weeks' },
        ],
        exit: 'CRTE received, BIR COR issued, all agency registrations complete.'
      },
      {
        type: 'phase',
        title: 'Phase 2 — Expansion',
        period: 'Month 3–12',
        theme: 'HQ office live, operations structured, FAB registered',
        timeline: '4–6 months',
        rows: [
          { step: 1, action: 'Office Setup (Design → Build)', detail: 'Hire licensed architect, design HQ layout, fit-out the leased space, set up IT infrastructure, utilities, and signage. Corporate kit (seal, minute book, stock ledger) finalized upon completion.', time: '1–2 months' },
          { step: 2, action: 'Bookkeeping & Accounting Setup', detail: 'Hire or contract a CPA/bookkeeper. Set up accounting system (QuickBooks, Xero, or local alternative). Establish chart of accounts, payroll processing, and BIR-compliant official receipts.', time: '3–4 weeks' },
          { step: 3, action: 'Payroll System', detail: 'Set up payroll aligned with SSS, PhilHealth, Pag-IBIG contribution schedules. Define pay cycle and pay slips.', time: '2–3 weeks' },
          { step: 4, action: 'Begin Quarterly BIR Filings', detail: 'File and pay 5% GIT quarterly. Compliance calendar due dates: Apr 30, Jul 31, Oct 31, Jan 31.', time: 'Ongoing' },
          { step: 5, action: 'FAB Registration', detail: 'Once SBFZ office is active, register with AFAB as a locator for Bataan-side operations. Requires separate AFAB application and locator agreement.', time: '1–3 months' },
          { step: 6, action: 'SBMA Annual Report Prep', detail: 'Start collecting employment data and financial statements for first annual SBMA submission.', time: 'Ongoing' },
        ],
        exit: 'SBFZ HQ operational (occupancy permit secured), bookkeeping system live, FAB registration filed or approved.'
      },
      {
        type: 'phase',
        title: 'Phase 3 — Land Acquisition',
        period: 'After FAB is Secured',
        theme: 'Secure land — the hardest and longest part of the plan',
        timeline: '12–24 months from start of land search',
        rows: [
          { step: 1, action: 'Identify Target Land', detail: 'Prospect lots near SBFZ / Bataan corridor. Engage licensed broker (PRC-registered). Factor in zoning, SBMA perimeter rules, flood maps, access roads.', time: '2–4 months' },
          { step: 2, action: 'Due Diligence', detail: 'Verify clean OCT/TCT at Registry of Deeds; no encumbrances, liens, or adverse claims. Check agricultural classification (may require DAR clearance), DENR classification, and real property tax status.', time: '2–3 months' },
          { step: 3, action: 'DAR Clearance (if agricultural)', detail: 'If land is classified agricultural, secure Department of Agrarian Reform clearance before any sale. This is the longest possible blocker.', time: '3–6 months (if required)' },
          { step: 4, action: 'Negotiate and Execute Deed of Absolute Sale', detail: 'Notarized; buyer listed as Firma corporation. Lock in price, payment terms, and turn-over conditions.', time: '2–4 weeks' },
          { step: 5, action: 'Pay Transfer Taxes', detail: 'Capital Gains Tax: 6%; Documentary Stamp Tax: 1.5%; Transfer Tax at LGU: 0.5–0.75%. Real Property Tax clearance required.', time: '1–2 months' },
          { step: 6, action: 'Obtain CAR from BIR', detail: 'Certificate Authorizing Registration. Required before title can transfer.', time: '3–6 weeks' },
          { step: 7, action: 'Title Transfer at Registry of Deeds', detail: 'New TCT issued in Firma corporation\'s name. Final step.', time: '2–4 weeks' },
        ],
        exit: 'Clean TCT issued in Firma corporation\'s name.'
      },
      {
        type: 'section',
        title: 'Phase 4 — FAB Extension / Own Economic Zone',
        content: 'This phase begins only after land is acquired and operations are proven at both SBFZ and FAB. Firma pursues one or both paths to become a recognized economic zone in its own right.'
      },
      {
        type: 'table',
        headers: ['Factor', 'Option A — FAB Extension', 'Option B — Own PEZA Zone'],
        rows: [
          ['What it is', 'Petition AFAB to formally include Firma\'s land within the FAB perimeter', 'Apply with PEZA to establish a private economic zone on Firma-owned land'],
          ['Control', 'Less — AFAB remains the authority', 'Full — Firma is the zone operator'],
          ['Setup Complexity', 'Lower — petition to existing zone', 'Higher — full PEZA application + zone development'],
          ['Revenue Upside', 'None (incentive recipient only)', 'Yes — locator fees, zone admin'],
          ['Sovereign Feel', 'Partial', 'Full'],
          ['Timeline', '1–2 years after land secured', '2–4 years after land secured'],
        ]
      },
      {
        type: 'outcome',
        title: 'RECOMMENDED FIRST MOVE',
        content: 'Pursue FAB Extension while simultaneously scoping the PEZA zone application — they are not mutually exclusive. FAB Extension accelerates the credibility needed for a PEZA application, building the employment, investment, and economic contribution track record that PEZA will require.'
      }
    ]
  },
  {
    id: 'priority-hq',
    title: 'PRIORITY: FIT HQ SETUP',
    section: 'Priority Actions',
    badge: 'Priority',
    subtitle: 'Physical HQ & Compliance Foundation',
    description: 'Immediate actions for securing MSpace Balanga and establishing operational presence',
    thesis: 'Lock down the right space in Bataan — then build the legal and IP foundation clean from day one so the model is replicable across other countries without retrofitting.',
    blocks: [
      {
        type: 'context',
        content: 'We\'re set to look at MSpace in Balanga and a couple other options inside the Freeport Area. We need a small fund as support so that when we go to visit in person, it\'s proper and on time — photos, feel the space, not just a price sheet. Whatever we lock down must feel like a base of operations, not just desks with a logo slapped on.'
      },
      {
        type: 'section',
        title: 'FOR SECURING THE PHYSICAL HQ',
        bullets: [
          'Business lease agreement review — commercial use and events rights',
          'Barangay clearance for business operations in Balanga City',
          'Mayor\'s Business Permit (City of Balanga) — required before FIT HQ can operate officially',
          'BIR registration (if FIRMA / FIT will be billing or transacting out of this address)',
          'DOLE compliance if onboarding local staff at this location',
          'Fire safety inspection certificate and occupancy clearance (standard for any commercial space)',
          'Coordination with the Freeport Authority of Bataan (FAB) if going the Freeport Area route — separate permitting layer from the city',
        ]
      },
      {
        type: 'section',
        title: 'FOR ESTABLISHING FIRMA IP IN THE PHILIPPINES',
        bullets: [
          'Trademark registration with IPOPHL — FIRMA, FIT, SEEDBASE, Nation of Heaven marks across key classes: Class 9 (tech/software), Class 35 (business services), Class 36 (financial/token-related), Class 41 (events and education)',
          'Trade name registration with SEC (if setting up a local entity under the FIRMA brand)',
          'Copyright filing for original creative assets — visual identity, documents, content, architectural frameworks',
          'Domain and brand protection sweep — lock all key URLs, handles, and variations before going loud publicly',
          'Early coordination with the SEC Philippines on token/digital asset classification if tokenizing anything locally',
          'NDA and IP assignment agreements for all local contractors, crew, and staff from day one',
        ]
      },
      {
        type: 'outcome',
        title: 'STRATEGY',
        content: 'Do this clean from the start in Bataan so when we replicate the model in other countries, we already have a working compliance template to hand off. No scrambling, no retrofitting.'
      },
      {
        type: 'section',
        title: 'KEY CONTACT — RECURRA',
        bullets: [
          'Primary contact for event logistics, film crew, and agency services in Bataan region',
          'Clarky personally knows the Owner',
          'Facebook: facebook.com/recurraph',
          'Website: recurraph.com',
          'Services: Event Logistics · Film Crew · Agencies',
        ]
      }
    ]
  },
  {
    id: 'events-calendar',
    title: 'FIT 2026 EVENT CALENDAR',
    section: 'Events',
    badge: 'Events',
    subtitle: 'SEA & Asia Event Scouting Calendar — 2026',
    description: 'No PBW. Only high-impact, high-visibility events worth showing up to like a movement.',
    thesis: 'Five to six events across five countries from June to October — a clean Asia circuit that builds momentum event by event, culminating at Token2049 Singapore as the year\'s biggest moment.',
    blocks: [
      {
        type: 'context',
        content: 'Each event is selected for maximum community impact, brand visibility, and strategic network building across the Southeast Asia and Asia-Pacific Web3 ecosystem. Events feed forward into each other — each city builds hype for the next. Every activation proves the blueprint.'
      },
      {
        type: 'section',
        title: 'TIER 1 — MUST BE THERE',
        content: 'Non-negotiables. FIT needs full presence: booth, side event, and content capture.'
      },
      {
        type: 'table',
        headers: ['Event', 'Date', 'Location', 'Scale', 'FIT Play'],
        rows: [
          ['TOKEN2049 Singapore', 'Oct 7–8, 2026', 'Marina Bay Sands, SG', '25,000+ attendees · 7,000+ companies · 160+ countries', 'Sponsor side event · booth on main floor · host afterparty that becomes a talking point'],
          ['Coinfest Asia', 'Aug 20–21, 2026', 'Nuanu Juice Center, Bali', '10,000+ attendees · world\'s largest crypto festival', 'Activation booth · SEEDBASE pop-up · side event or community beach meetup · hire local Bali crew for content'],
          ['Korea Blockchain Week', 'Sep 29 – Oct 1, 2026', 'Seoul, South Korea', '7,000+ attendees · 120+ speakers', 'Side event or executive dinner · coordinate with Hype3\'s Korea team · stack with Token2049 travel'],
        ]
      },
      {
        type: 'section',
        title: 'TIER 2 — HIGH PRIORITY',
        content: 'Go if the activation is right. Strong ROI when paired with Tier 1 travel windows.'
      },
      {
        type: 'table',
        headers: ['Event', 'Date', 'Location', 'Why FIT', 'FIT Play'],
        rows: [
          ['SEABW — Bangkok', 'May 18–24, 2026', 'True Icon Hall, Bangkok', 'SEA-specific circuit, 3,000+ participants, test ground before Token2049', 'Booth + community panel or side event'],
          ['AIBC Asia / SiGMA Asia', 'June 1–3, 2026', 'SMX Convention Center, Manila', 'Home ground — signals FIT is the go-to PH infrastructure for anyone entering the market', 'Local anchor activation — booth + dinner for international delegates'],
          ['WebX', 'July 13–14, 2026', 'Tokyo, Japan', 'Japan is the most regulated/respected crypto market in Asia — credibility with institutional audiences', 'Speaking slot or brand presence'],
          ['Network School', 'Monthly cohorts', 'Forest City, Johor, MY', 'Founded by Balaji Srinivasan — THE ideological home for Nation of Heaven vision', 'Send Karl and/or Clarky as participants, not exhibitors'],
        ]
      },
      {
        type: 'outcome',
        title: 'FIT\'S 2026 EVENT RUN',
        bullets: [
          'June — AIBC / SiGMA Asia — Manila, PH — Priority 2',
          'July — WebX — Tokyo, Japan — Priority 2',
          'August — Coinfest Asia — Bali, Indonesia — Priority 1',
          'September — Korea Blockchain Week — Seoul, South Korea — Priority 1',
          'October — TOKEN2049 Singapore — Singapore — Priority 1 (Flagship)',
          'Ongoing — Network School — Forest City, Malaysia — Participation (Strategic)',
        ]
      }
    ]
  },
  {
    id: 'peso-partnership',
    title: 'FIRMA × PESO BATAAN',
    section: 'Partnerships',
    badge: 'Partnership',
    subtitle: 'Community & Government Partnership Framework',
    description: 'Leveraging Clarky\'s relationship with PESO Bataan head for employment and ESR',
    thesis: 'Build Firma\'s name in Bataan through social good, employment, and community service — the way a sovereign builder earns trust before it earns a permit.',
    blocks: [
      {
        type: 'context',
        content: 'PESO (Public Employment Service Office) is a government-operated employment and livelihood office under DOLE. In Bataan, PESO organizes job fairs, connects employers to workers, facilitates skills training, and is the primary channel companies use for ESR (Employee Social Responsibility) and community outreach. It has direct relationships with barangay officials, schools, and local government — exactly the network Firma needs to be trusted in.'
      },
      {
        type: 'key-insight',
        title: 'STRATEGIC LEVER',
        content: 'Clarky has an existing personal relationship with the PESO Bataan head. This is the fastest, lowest-friction entry point into legitimate community presence. A single coffee meeting can open the door to a formal MOU, job fair presence, and TESDA training partnership — all within weeks.'
      },
      {
        type: 'layers',
        title: 'HOW FIRMA ORGANIZES WITH PESO',
        layers: [
          {
            title: 'Firma as an Employer Partner',
            content: 'The most natural and fastest entry point.',
            bullets: [
              'Job Fair Participation — Firma sets up a booth at PESO Bataan job fairs. Benefit: brand visibility to hundreds of local applicants in one day.',
              'Post Job Listings — Firma submits open roles (ops, tech, community, trades) to PESO\'s database.',
              'Skills Matching — PESO identifies candidates for TESDA blockchain training cohorts. Feeds directly into Phase 2 workforce buildout.',
            ]
          },
          {
            title: 'Firma as a Training Partner',
            content: 'PESO coordinates with TESDA and employers to run livelihood and upskilling programs.',
            bullets: [
              'Blockchain Literacy Bootcamp — Co-hosted by Firma + PESO + TESDA; PESO recruits participants from local barangays.',
              'Freelancer Upskilling — Digital skills (remote work, crypto wallets, Web3 basics). PESO promotes, Firma delivers at HQ.',
              'Youth Tech Track — Intro to agentic AI, SeedBase, and FIG. Co-branded with PESO.',
            ]
          },
          {
            title: 'Firma as an ESR Partner',
            content: 'Where Firma builds its public name and government goodwill.',
            bullets: [
              'Livelihood Fair — SeedBase merchant onboarding, FIG wallet setup, solar energy demo. PESO provides venue, community mobilization, LGU endorsement.',
              'Job Readiness Seminar — Firma team facilitates; focus on Web3 careers and remote work.',
              'Community Solar / Power Demo — EDGE solar pod showcase. PESO coordinates media coverage.',
              'CIK Mission Day — Food, medical, digital literacy pack. PESO facilitates with DSWD and barangay captains.',
            ]
          }
        ]
      },
      {
        type: 'section',
        title: 'THE IMMEDIATE ASK — HOW TO START',
        bullets: [
          '1. Clarky sets a coffee meeting with the PESO head — introduce Firma, share the plain-language one-pager, ask: "What does PESO need right now that Firma can help with?"',
          '2. Propose a co-hosted Job Fair booth at the next PESO Bataan job fair — low commitment, high visibility.',
          '3. Sign a simple MOU between Firma Sovereign Foundation and PESO Bataan — formalizes the partnership, gives Firma a government-recognized relationship on record.',
          '4. Cross-promote — PESO promotes HQ open house; Firma promotes PESO\'s job fair at the PBN event.',
        ]
      },
      {
        type: 'table',
        title: 'WHY THIS BUILDS FIRMA\'S NAME',
        headers: ['What the Community Sees', 'What It Signals'],
        rows: [
          ['Firma at the PESO job fair', '"They create local jobs"'],
          ['Firma running blockchain training with TESDA', '"They invest in Bataan people"'],
          ['Firma doing CIK missions endorsed by PESO', '"Government trusts them"'],
          ['Firma HQ as a PESO-endorsed community hub', '"They are here to stay"'],
        ]
      }
    ]
  },
  {
    id: 'land-plan',
    title: 'LAND ACQUISITION PLAN',
    section: 'Legal & Land',
    badge: 'Legal',
    subtitle: '60/40 Corporate Structure & TCT Transfer',
    description: 'The only legal path for Firma to hold land in the Philippines',
    thesis: 'Foreign entities cannot own private land in the Philippines. The path is a Philippine domestic corporation structured 60% Filipino / 40% Firma — with the right legal instruments executed before any land purchase.',
    blocks: [
      {
        type: 'context',
        content: 'This is a constitutional restriction under Article XII, Section 7 of the 1987 Constitution. It applies to Firma regardless of AFAB registration status, CRTE issuance, or any freeport classification. SEC registration alone does not confer land ownership rights. The only legal path: a Philippine domestic corporation structured 60% Filipino / 40% Firma holds the Transfer Certificate of Title (TCT).'
      },
      {
        type: 'key-insight',
        title: 'CRITICAL: TWO SEPARATE LEGAL ENTITIES REQUIRED',
        content: 'Corp #1 operates on the land. Corp #2 owns the land. Neither function can be combined without violating constitutional restrictions. The shareholder agreement for Corp #2 must be executed before any land purchase — not after.'
      },
      {
        type: 'two-col',
        title: 'THE TWO CORPORATIONS FIRMA NEEDS',
        cols: [
          {
            title: 'CORP #1 — AFAB LOCATOR ENTITY',
            bullets: [
              'Purpose: Run Firma operations, hold AFAB Certificate, activate tax benefits',
              'Ownership: Can be majority foreign-owned',
              'Tax benefits: Yes — 0% ITH, then 5% GIT',
              'Holds land title: No',
            ]
          },
          {
            title: 'CORP #2 — LAND-HOLDING CORPORATION',
            bullets: [
              'Purpose: Hold the TCT (land title) only',
              'Ownership: 60% Filipino / 40% Firma',
              'Tax benefits: No — standard Philippine corporate tax',
              'Holds land title: Yes',
            ]
          }
        ]
      },
      {
        type: 'section',
        title: 'PROTECTING FIRMA\'S CONTROL',
        content: 'Holding only 40% does not mean losing control — if the right legal instruments are in place before any land purchase.',
        bullets: [
          'Shareholder Agreement — Board control, voting rights, buyout provisions, exit rights, drag-along and tag-along clauses',
          'Usufruct Agreement — Firma\'s right to use and develop the land regardless of who holds the title',
          'Management Contract — Firma manages all operations conducted on the land',
          'Right of First Refusal — Firma buys out Filipino shareholders first if they exit',
        ]
      },
      {
        type: 'table',
        title: 'LAND PURCHASE PROCESS',
        headers: ['Step', 'Action', 'Duration'],
        rows: [
          ['1', 'Incorporate Corp #2 — SEC registration of 60/40 domestic corp; formalize Filipino shareholders; execute shareholder agreement', '2–4 months'],
          ['2', 'Land identification — Find parcel in Dinalupihan; right size, proximity to FAB zone, willing seller', '2–6 months'],
          ['3', 'Title due diligence — Verify clean TCT; check liens, DAR clearance if agricultural land', '1–3 months'],
          ['4', 'Negotiation + Deed of Sale — Agree price; draft and notarize with Corp #2 as named buyer', '1–3 months'],
          ['5', 'BIR clearance + taxes — Pay Capital Gains Tax (6%) and Documentary Stamp Tax; secure BIR CAR', '1–4 months'],
          ['6', 'Registry of Deeds — Submit BIR CAR + Deed of Sale; new TCT issued in Corp #2\'s name', '2–6 months'],
          ['7', 'LGU transfer tax — Pay municipal transfer tax; update Tax Declaration at the Assessor\'s Office', '1–2 months'],
        ]
      },
      {
        type: 'table',
        title: 'TIMELINE & TRANSACTION COSTS',
        headers: ['Scenario / Item', 'Detail'],
        rows: [
          ['Best case timeline', '10–14 months'],
          ['Realistic timeline', '14–18 months'],
          ['Slow / complications', '20–28 months'],
          ['Capital Gains Tax', '6% of sale price or BIR zonal value (whichever is higher)'],
          ['Documentary Stamp Tax', '1.5%'],
          ['Registration fee', '~0.25%'],
          ['Transfer tax', '0.5–0.75%'],
          ['Notarial fee', '~1%'],
          ['Total over land price', '~9–10%'],
        ]
      }
    ]
  },
  {
    id: 'afab-vs-sbfz',
    title: 'AFAB vs. SBFZ',
    section: 'Regulatory',
    badge: 'Regulatory',
    subtitle: 'Locator Comparison — Two Complementary Zones',
    description: 'Freeport Area of Bataan (RA 11453) · Subic Bay Freeport Zone (RA 7227)',
    thesis: 'These two zones are not competitors for Firma — they are complementary. AFAB is the sovereign build environment; SBFZ is the logistics and international gateway.',
    blocks: [
      {
        type: 'context',
        content: 'Firma\'s optimal structure is a dual-zone registration — an AFAB virtual office for blockchain/fintech licensing and a potential SBFZ locator entity for tech-industry operations. Each zone has structural advantages the other cannot replicate. Understanding these distinctions is essential before making licensing and investment decisions.'
      },
      {
        type: 'table',
        title: 'ZONE COMPARISON',
        headers: ['Category', 'AFAB', 'SBFZ'],
        rows: [
          ['Governing Law', 'RA 11453', 'RA 7227'],
          ['Zone Authority', 'AFAB Board', 'SBMA'],
          ['Locator Certificate', 'Certificate of Registration', 'CRTE (Certificate of Registration and Tax Exemption)'],
          ['Blockchain / AI Authorization', 'Explicitly authorized under RA 11453', 'Grey area — no explicit coverage'],
          ['Income Tax — Years 1–8', '0% (Income Tax Holiday)', '5% GIT from day one'],
          ['Income Tax — After Holiday', '5% GIT', '5% GIT (no change)'],
          ['Import Duties', '0%', '0%'],
          ['VAT', 'Exempt', 'Exempt'],
          ['Land Purchase', 'Yes — via 60/40 Philippine domestic corp', 'No — SBMA owns all land (lease only)'],
          ['Own Zone Pathway', 'Yes — FAB Extension via Presidential Proclamation', 'No equivalent'],
          ['Port Access', 'Mariveles port (small, Manila Bay)', 'Deep-water port — 13.7m draft, 600K TEU capacity'],
          ['Airport', 'None nearby', 'International airport — 2,745m runway, FBO access'],
          ['Primary Role for Firma', 'Operations, own zone, Settlemint anchor', 'Logistics gateway, hardware imports, international arrivals'],
        ]
      },
      {
        type: 'key-insight',
        title: 'AFAB\'S CRITICAL EDGE: INCOME TAX HOLIDAY',
        content: 'Zero income tax for up to 8 years from the Certificate of Registration date, reverting to 5% GIT thereafter. SBFZ starts at 5% GIT from day one with no holiday period. For a capital-intensive early-stage build like Firma\'s, that ITH period is the single most significant financial advantage in the comparison.'
      },
      {
        type: 'section',
        title: 'OWN-ZONE PLAY EXISTS ONLY IN AFAB',
        content: 'The FAB Extension pathway — AFAB Board approval → Presidential Proclamation — has no SBFZ equivalent. SBMA owns all land and operates all zones; there is no mechanism for a locator to become a zone operator within SBFZ. This makes AFAB the only viable Settlemint territory anchor of the two.'
      },
      {
        type: 'outcome',
        title: 'DUAL-ZONE STRATEGY',
        content: 'Firma can operate a dual-zone registration: AFAB virtual office for blockchain/fintech licensing under RA 11453, and a SBFZ locator entity for tech-industry operations and hardware imports. This gives Firma a legally compliant, incentivized structure across both freeports simultaneously — maximizing the ITH at AFAB while leveraging Subic\'s deep-water port for equipment logistics.'
      }
    ]
  },
  {
    id: 'fab-sbfz-priorities',
    title: 'FAB & SBFZ: CURRENT PRIORITIES',
    section: 'Regulatory',
    badge: 'Strategy',
    subtitle: 'How Firma\'s Sovereign Layer Can Align',
    description: 'FAB/AFAB and SBFZ/SBMA strategic priorities 2025–2026 + Bataan LGU alignment',
    thesis: 'Firma enters not just as a registered business entity, but as a civic infrastructure partner — which aligns with AFAB\'s inclusive innovation mandate, SBMA\'s sustainability vision, and Governor Garcia\'s digital Bataan agenda simultaneously.',
    blocks: [
      {
        type: 'section',
        title: 'FAB / AFAB — CURRENT PRIORITIES (2025–2026)',
        bullets: [
          'Digital & Blockchain Hub Expansion — AFAB launched Virtual Office for Fintech, Blockchain, and Digital-Based Enterprises (Oct 2025). Only investment promotion agency in the Philippines legally empowered to license blockchain and emerging tech under RA 11453.',
          'Industrial & Territorial Expansion — 17+ FAB Expansion Areas (FEAs) across Bataan municipalities. Samal Economic Zone newly declared (March 2025) — 275,000+ sqm of industrial expansion land.',
          'Named Asia-Pacific Industrial Zone of the Year by fDi Intelligence in 2025.',
          'Investor Facilitation — 5% gross income tax for registered locators; streamlined one-stop registration; sectors: fintech, blockchain, AI, BPO, traditional industry.',
        ]
      },
      {
        type: 'section',
        title: 'SBFZ / SBMA — CURRENT PRIORITIES (2025–2026)',
        bullets: [
          'Green Port City & Carbon Neutrality — Vision: first carbon-neutral port by 2030. Shore Power Connection project: Phase 1 at New Container Terminal (2025), Phase 2 at Naval Supply Depot (2026–2027).',
          'Regional Cruise & Trade Hub — Dedicated cruise terminal development; sister port agreements with Port of San Diego, Osaka Port; ₱600 billion in investments secured in 2025.',
          'Digital Infrastructure & Tech Sector — Expansion of digital infrastructure; port modernization and digitalization.',
        ]
      },
      {
        type: 'table',
        title: 'HOW FIRMA\'S SOVEREIGN LAYER CAN ALIGN',
        headers: ['Zone Priority', 'Firma\'s Alignment'],
        rows: [
          ['AFAB — Blockchain/Fintech licensing hub', 'Register as AFAB Virtual Office locator — legal blockchain operating status under RA 11453 without physical office in Mariveles'],
          ['AFAB — Province-wide FEA expansion', 'As FAB expands into Samal, Hermosa, and other municipalities, Firma\'s presence can grow with it'],
          ['AFAB — Inclusive innovation mandate', 'Firma\'s community-building and grassroots education model aligns with AFAB\'s i3S mandate'],
          ['SBFZ — Green tech & sustainability', 'Position as partner in SBFZ\'s sustainable/green industries hub — especially for renewable energy, ESG tokenization'],
          ['SBFZ — Digital infrastructure push', 'Firma\'s digital governance tools can serve as models for SBMA\'s digitalization push'],
        ]
      },
      {
        type: 'table',
        title: 'BATAAN LGU DIGITAL GAPS FIRMA CAN SOLVE',
        headers: ['Gap', 'Firma\'s Solution'],
        rows: [
          ['Digital Governance — BIMS rollout has capacity gaps across municipalities', 'Web3-based governance tools, digital identity systems, transparent fund tracking for barangay-level operations'],
          ['Flooding & Infrastructure — 1st District municipalities need disaster-resilient planning tools', 'GIS/mapping data layers, community reporting platforms, participatory urban planning tools'],
          ['Farmers & Fisherfolk empowerment — cooperative tokenization needed', 'Supply chain transparency tools, cooperative tokenization, direct market access platforms'],
          ['Smart City & E-Governance — Balanga City 2030 smart city target; LGU capacity limited', 'Modular digital service infrastructure, open-source civic tools, Web3-enabled transparency dashboards'],
          ['Coastal Zone Management — 9 municipalities under Ordinance No. 03 S. 2025', 'Environmental data platforms, coastal monitoring dashboards, ESG reporting tools'],
        ]
      },
      {
        type: 'outcome',
        title: 'STRATEGIC ENTRY POINTS',
        bullets: [
          'AFAB/FAB — Register as Virtual Office Fintech/Blockchain Locator under RA 11453',
          'SBFZ/SBMA — Position in Green Tech / Digital Infrastructure sectors',
          'Province of Bataan + Municipalities — Provide digital governance, agri-tech, mapping, civic platforms',
          'Sovereign Narrative — Firma as Web3-native infrastructure layer bridging freeport investment zones and local community needs — a sovereign builder, not just a tenant',
        ]
      }
    ]
  },
  {
    id: 'what-is-fab',
    title: 'WHAT IS A FAB?',
    section: 'Regulatory',
    badge: 'Reference',
    subtitle: 'Freeport Area of Bataan — Complete Zone Registry & History',
    description: 'Philippines Special Economic Zone · RA 9728 (2009) · RA 11453 (2019)',
    thesis: 'The FAB is the Philippines\' oldest export processing zone — now a province-wide freeport network of 17 expansion areas offering full fiscal incentives, duty-free importation, and a one-stop regulatory system under AFAB.',
    blocks: [
      {
        type: 'context',
        content: 'The Freeport Area of Bataan (FAB) was originally established as the Mariveles Free Trade Zone in 1969 — the country\'s first export processing zone. It was later renamed the Bataan Export Processing Zone (BEPZ), then the Bataan Economic Zone (BEZ), before being converted into the FAB via Republic Act No. 9728 in October 2009. In 2019, RA 11453 amended AFAB\'s charter, allowing the FAB to expand anywhere within Bataan (excluding SBMA-governed portions) through designated Freeport Expansion Areas (FEAs). There are currently 17 approved expansion areas province-wide, with 10 already in operation.'
      },
      {
        type: 'key-insight',
        title: 'GOVERNING AUTHORITY: AFAB',
        content: 'The FAB is managed by the Authority of the Freeport Area of Bataan (AFAB) — a government corporation attached to the Office of the President. It operates as a decentralized, self-sustaining industrial, commercial-trading, agro-industrial, tourism, and investment center. Key benefits for locators in any FEA include: tax exemptions, streamlined customs, duty-free importation, and a one-stop-shop regulatory system.'
      },
      {
        type: 'section',
        title: 'LEGAL FOUNDATION',
        bullets: [
          'RA 9728 (Oct 2009) — Converted BEZ into the Freeport Area of Bataan; established AFAB as governing authority',
          'RA 11453 (2019) — Expanded AFAB\'s mandate province-wide via Freeport Expansion Areas (FEAs), excluding SBMA-governed zones',
          '17 FEAs approved across Bataan municipalities; 10 currently in operation',
          'AFAB is the only investment promotion agency in the Philippines legally empowered to license blockchain and emerging tech under RA 11453',
        ]
      },
      {
        type: 'table',
        title: 'ALL FAB ZONES — VALIDATED COORDINATES',
        headers: ['#', 'Location', 'Zone Name', 'Coordinates', 'Status'],
        rows: [
          ['1', 'Mariveles', 'FAB Main Zone (Brgy. Maligaya, Malaya, Sisiman, Baseco, Alasasin)', '14.4408°N, 120.5149°E', '✅ Operational'],
          ['2', 'Mariveles', '+6 Freeport Expansion Areas within Mariveles', '~14.43°N, ~120.48°E', '✅ Various'],
          ['3', 'Dinalupihan', 'DWEZ — Dinalupihan Woodlands Economic Zone (42.77 ha Ph1 + 110 ha Ph2, 389 ha total)', '14.8527°N, 120.3964°E', '✅ Operational'],
          ['4', 'Dinalupihan', 'San Benito Warehousing Zone — 60 ha', '14.8477°N, 120.4253°E', '✅ Operational'],
          ['5', 'Hermosa', 'HEIP — Hermosa Ecozone Industrial Park (162 ha industrial / 478 ha total)', '14.8425°N, 120.4702°E', '✅ Operational'],
          ['6', 'Orani', 'Orani FEA — coastal, aquaculture / agri-industrial (Manila Bay)', '14.8018°N, 120.5366°E', '✅ Operational'],
          ['7', 'Samal', 'Samal Ecozone — 27.53 ha (Brgy. Lalawigan & Tabing-Ilog)', '14.7799°N, 120.5417°E', '🔄 Groundbroken Mar 2023'],
          ['8', 'Abucay', 'Abucay FEA — agri-industrial, Manila Bay coast', '14.7222°N, 120.5354°E', '✅ Operational'],
          ['9', 'Balanga City', 'Balanga City FEA — BPO, IT, leisure, real estate', '14.6774°N, 120.5279°E', '✅ Operational'],
          ['10', 'Pilar', 'Pilar FEA — tourism, heritage (near Mt. Samat / Dambana ng Kagitingan)', '14.6040°N, 120.5096°E', '✅ Operational'],
          ['11', 'Orion', 'Port Capinpin FEA — port services, industrial', '14.5865°N, 120.5920°E', '✅ Operational'],
          ['12', 'Limay', 'Petron Bataan Refinery Complex — 238 ha (country\'s largest oil refinery)', '14.5290°N, 120.6001°E', '✅ Operational'],
          ['13', 'Bagac', 'Bagac FEA — tourism, heritage (Las Casas Filipinas de Acuzar)', '14.6027°N, 120.3853°E', '✅ Operational'],
        ]
      },
      {
        type: 'section',
        title: 'ZONE HIGHLIGHTS',
        bullets: [
          'MARIVELES (Main Zone) — OSM Relation #12907825; centroid 14.4408°N, 120.5149°E; 6 additional FEAs within the municipality',
          'DINALUPIHAN (DWEZ) — 223 Olongapo-Bataan Road, Brgy. Pinulot / Happy Valley; OSM-confirmed industrial area; 389 ha total buildout',
          'HERMOSA (HEIP) — 162 ha industrial / 478 ha total; connected via spur road to Dinalupihan Interchange of SCTEX',
          'SAMAL — Developer: High Tech Global Cement Corporation; AFAB agreement Apr 2025; groundbreaking Mar 10, 2023',
          'BALANGA CITY — Provincial capital; anchored by SM City Balanga and Vista Mall; positioned for BPO, IT, and lifestyle industries',
          'PILAR — Home of Dambana ng Kagitingan (Shrine of Valor) atop Mt. Samat; leverages highland heritage and tourism assets',
          'ORION (Port Capinpin) — RoRo ferry link to Manila (Esplanade Seaside Terminal); key multimodal logistics node',
          'LIMAY (Petron) — Country\'s largest oil refinery; SMC committed ₱10.6B for food processing and power generation expansion',
          'BAGAC — Las Casas Filipinas de Acuzar: Asia-Pacific\'s Best Historic Hotel (2021); West Philippine Sea coastal access',
        ]
      },
      {
        type: 'section',
        title: 'FISCAL INCENTIVES FOR ALL FAB LOCATORS',
        bullets: [
          '5% gross income tax (GIT) in lieu of all national and local taxes',
          'Duty-free importation of capital equipment, raw materials, and consumer goods',
          'VAT zero-rating on local purchases',
          'No local business taxes, real property taxes, or other local impositions',
          'One-stop-shop regulatory system (AFAB handles all permits)',
          'Streamlined customs processing via AFAB\'s customs authority',
        ]
      },
      {
        type: 'section',
        title: 'KEY SOURCES (74 TOTAL)',
        bullets: [
          'Official / Government: foi.gov.ph/agencies/afab, invest.bataan.gov.ph, bataan.gov.ph, elibrary.judiciary.gov.ph',
          'Wikipedia / Wikimedia: FAB, AFAB, Mariveles, Dinalupihan, Orani, Abucay, Samal, Orion, Bataan Refinery, Las Casas, Mt. Samat',
          'OpenStreetMap: OSM Relation #12907825 (FAB Main), DWEZ, HEIP, Petron Refinery, Port Capinpin',
          'Maps & Coordinates: Mapcarta, Waze, Maplogs, PhilAtlas, Geloky, Tageo, FindLatitudeLongitude',
          'News & Media: InsiderPH, Port Calls, Tribune, Punto.com.ph',
          'Industrial / Technical: GEM Wiki (Petron), ShipNext (Port Capinpin), Science Park PH',
          'Tourism / Heritage: Las Casas Filipinas, Lakad Pilipinas, Dambana ng Kagitingan',
        ]
      },
      {
        type: 'outcome',
        title: 'FIRMA\'S RELEVANCE TO FAB',
        bullets: [
          'AFAB is the only PH investment body legally licensed to host blockchain/fintech enterprises under RA 11453 — direct Firma entry pathway',
          'Province-wide FEA expansion means Firma\'s presence can scale across 17 zones as operations grow',
          'Samal, Hermosa, and DWEZ are active expansion areas where Firma\'s infrastructure stack can be piloted',
          'Port Capinpin (Orion) provides maritime logistics access for physical hardware and EDGE device deployment',
          'Balanga City FEA aligns with Firma\'s BPO and digital governance tools for the provincial capital',
        ]
      }
    ]
  }
]

const FONT_FAMILIES = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Inter', 'Fraunces']
const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
const TEXT_STYLES = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3']

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'planner', label: 'Planner' },
  { key: 'notes', label: 'Notes' },
  { key: 'email', label: 'Email' },
  { key: 'atlas', label: 'Architecture Index' },
]

// ── ATLAS DOCUMENT RENDERER ───────────────────────────────────────────────────
function AtlasDocRenderer({ doc }) {
  if (!doc.blocks || doc.blocks.length === 0) {
    return <div className="atlas-doc-content">{doc.content}</div>
  }

  const renderBlock = (block, i) => {
    switch (block.type) {

      case 'context':
        return <p key={i} className="adr-context">{block.content}</p>

      case 'key-insight':
        return (
          <div key={i} className="adr-key-insight">
            <div className="adr-key-insight-title">{block.title}</div>
            <div className="adr-key-insight-body">{block.content}</div>
          </div>
        )

      case 'sequence':
        return (
          <div key={i} className="adr-sequence">
            <span className="adr-seq-label">{block.label}:</span>
            {block.steps.map((s, j) => (
              <span key={j} className="adr-seq-item">
                {s}{j < block.steps.length - 1 && <span className="adr-seq-arrow">→</span>}
              </span>
            ))}
          </div>
        )

      case 'phase':
        return (
          <div key={i} className="adr-phase">
            <h2 className="adr-phase-title">{block.title} <em>({block.period})</em></h2>
            {block.theme && <div className="adr-phase-theme">Theme: {block.theme}</div>}
            <table className="adr-table">
              <thead>
                <tr><th>Step</th><th>Action</th><th>Est. Time</th></tr>
              </thead>
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j}>
                    <td className="adr-td-step">{row.step}</td>
                    <td><strong>{row.action}</strong>{row.detail ? ` — ${row.detail}` : ''}</td>
                    <td className="adr-td-time">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(block.exit || block.timeline) && (
              <div className="adr-phase-footer">
                {block.exit && <span>Exit Criteria: {block.exit}</span>}
                {block.timeline && <span>Realistic Total: {block.timeline}</span>}
              </div>
            )}
          </div>
        )

      case 'section':
        return (
          <div key={i} className="adr-section">
            <h3 className="adr-section-title">{block.title}</h3>
            {block.content && <p className="adr-section-content">{block.content}</p>}
            {block.bullets && (
              <ul className="adr-bullets">
                {block.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            )}
          </div>
        )

      case 'table':
        return (
          <div key={i} className="adr-table-wrap">
            {block.title && <h3 className="adr-section-title">{block.title}</h3>}
            <table className="adr-table">
              <thead>
                <tr>{block.headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row, j) => (
                  <tr key={j}>
                    {row.map((cell, k) => <td key={k}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'layers':
        return (
          <div key={i} className="adr-layers">
            {block.title && <h3 className="adr-section-title">{block.title}</h3>}
            {block.layers.map((layer, j) => (
              <div key={j} className="adr-layer">
                <div className="adr-layer-label">Layer {j + 1} — {layer.title}</div>
                {layer.content && <p className="adr-layer-body">{layer.content}</p>}
                {layer.bullets && (
                  <ul className="adr-bullets">
                    {layer.bullets.map((b, k) => <li key={k}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )

      case 'two-col':
        return (
          <div key={i} className="adr-two-col-wrap">
            {block.title && <h3 className="adr-section-title">{block.title}</h3>}
            <div className="adr-two-col">
              {block.cols.map((col, j) => (
                <div key={j} className="adr-col">
                  <div className="adr-col-title">{col.title}</div>
                  {col.content && <p>{col.content}</p>}
                  {col.bullets && (
                    <ul className="adr-bullets">
                      {col.bullets.map((b, k) => <li key={k}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'outcome':
        return (
          <div key={i} className="adr-outcome">
            {block.title && <div className="adr-outcome-title">{block.title}</div>}
            {block.content && <p className="adr-outcome-body">{block.content}</p>}
            {block.bullets && (
              <ul className="adr-bullets">
                {block.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="atlas-doc-renderer">
      {/* Header */}
      <div className="adr-header">
        <div className="adr-header-badge">{doc.badge}</div>
        <h1 className="adr-title">{doc.title}</h1>
        {doc.subtitle && <div className="adr-subtitle">{doc.subtitle}</div>}
        {doc.description && <div className="adr-description">{doc.description}</div>}
        {doc.thesis && <div className="adr-thesis">{doc.thesis}</div>}
      </div>

      <div className="adr-divider" />

      {/* Blocks */}
      <div className="adr-body">
        {doc.blocks.map((block, i) => renderBlock(block, i))}
      </div>
    </div>
  )
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const [showPicker, setShowPicker] = useState(false)
  const [otherEmail, setOtherEmail] = useState('')
  const [showOtherInput, setShowOtherInput] = useState(false)

  const loginAs = useCallback((name, email) => {
    const norm = email.toLowerCase().trim()
    setUser({ name, email })
    setIsAdmin(WHITELISTED.has(norm))
    setShowOtherInput(false)
    setOtherEmail('')
  }, [])

  const loginOther = useCallback(() => {
    const e = otherEmail.trim()
    if (!e) return
    loginAs(e.split('@')[0], e)
  }, [otherEmail, loginAs])

  const [activeNav, setActiveNav] = useState('dashboard')
  const [unlocked, setUnlocked] = useState(false)
  const [lockInput, setLockInput] = useState('')
  const [lockAttempts, setLockAttempts] = useState(0)
  const [lockError, setLockError] = useState(false)
  const [pendingNav, setPendingNav] = useState(null)

  // Reset lock only when page is restored via browser back/forward (not on tab switch)
  useEffect(() => {
    const resetLock = () => {
      setUnlocked(false)
      setLockInput('')
      setLockAttempts(0)
      setLockError(false)
      setPendingNav(null)
      setActiveNav('dashboard')
    }
    const onPageShow = (e) => { if (e.persisted) resetLock() }
    window.addEventListener('pageshow', onPageShow)
    return () => { window.removeEventListener('pageshow', onPageShow) }
  }, [])

  const gateNav = useCallback(async (key) => {
    if (!PROTECTED.has(key) || unlocked || isAdmin) { setActiveNav(key); return }
    setPendingNav(key)
  }, [unlocked, isAdmin])

  const submitLock = useCallback(async () => {
    const h = await sha256(lockInput)
    if (h === ACCESS_HASH) {
      setUnlocked(true)
      setLockInput('')
      setLockAttempts(0)
      setLockError(false)
      if (pendingNav) { setActiveNav(pendingNav); setPendingNav(null) }
    } else {
      const next = lockAttempts + 1
      setLockInput('')
      if (next >= 2) {
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1'
      } else {
        setLockAttempts(next)
        setLockError(true)
      }
    }
  }, [lockInput, lockAttempts, pendingNav])

  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [newTask, setNewTask] = useState({ title: '', category: '', priority: 'medium', assignee: '', date: '', status: 'backlog' })

  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [docTitle, setDocTitle] = useState('')
  const [docSearch, setDocSearch] = useState('')
  const editorRef = useRef(null)

  const [emailForm, setEmailForm] = useState({ senderId: 'gmail-1', to: '', subject: '', body: '' })
  const [emailSent, setEmailSent] = useState(false)
  const [emailLog, setEmailLog] = useState([])
  const [senderProfiles, setSenderProfiles] = useState([
    { id: 'gmail-1', name: 'Gmail', email: '', provider: 'gmail' },
    { id: 'outlook-1', name: 'Outlook', email: '', provider: 'outlook' },
  ])
  const [showAddSender, setShowAddSender] = useState(false)
  const [newSender, setNewSender] = useState({ name: '', email: '', provider: 'gmail' })

  const [archDocs, setArchDocs] = useState(INITIAL_ARCH_DOCS)
  const [selectedAtlasDoc, setSelectedAtlasDoc] = useState(null)
  const [atlasSearch, setAtlasSearch] = useState('')
  const [showAddAtlas, setShowAddAtlas] = useState(false)
  const [newAtlasDoc, setNewAtlasDoc] = useState({ title: '', section: '', badge: '', subtitle: '', description: '', thesis: '', context: '', insightTitle: '', insightContent: '', notes: '' })
  const [editingAtlasDoc, setEditingAtlasDoc] = useState(null)
  const [editAtlasForm, setEditAtlasForm] = useState({ title: '', section: '', badge: '', subtitle: '', description: '', thesis: '', blocksJson: '' })
  const [editBlocksError, setEditBlocksError] = useState(false)

  const backlogTasks = tasks.filter(t => t.status === 'backlog')
  const inprogressTasks = tasks.filter(t => t.status === 'inprogress')
  const reviewTasks = tasks.filter(t => t.status === 'review')
  const doneTasks = tasks.filter(t => t.status === 'done')
  const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0
  const overdueTasks = tasks.filter(t => t.date && new Date(t.date) < new Date() && t.status !== 'done')
  const upcomingTasks = [...inprogressTasks, ...reviewTasks, ...backlogTasks]
    .filter(t => t.date).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
  const selectedSender = senderProfiles.find(s => s.id === emailForm.senderId) || senderProfiles[0]

  const filteredAtlas = archDocs.filter(d =>
    atlasSearch === '' ||
    d.title.toLowerCase().includes(atlasSearch.toLowerCase()) ||
    (d.subtitle || '').toLowerCase().includes(atlasSearch.toLowerCase()) ||
    d.section.toLowerCase().includes(atlasSearch.toLowerCase())
  )
  const atlasSections = {}
  filteredAtlas.forEach(d => {
    if (!atlasSections[d.section]) atlasSections[d.section] = []
    atlasSections[d.section].push(d)
  })

  const addTask = () => {
    if (!newTask.title) return
    setTasks([...tasks, { ...newTask, id: Date.now() }])
    setNewTask({ title: '', category: '', priority: 'medium', assignee: '', date: '', status: 'backlog' })
  }
  const removeTask = id => setTasks(tasks.filter(t => t.id !== id))
  const moveTask = (id, status) => setTasks(tasks.map(t => t.id === id ? { ...t, status } : t))

  const createDocument = () => {
    const doc = { id: Date.now(), title: 'New Document', category: 'General', badge: 'NOTES', date: new Date().toISOString().split('T')[0], htmlContent: '' }
    setDocuments([doc, ...documents])
    setSelectedDocument(doc)
    setDocTitle(doc.title)
    if (editorRef.current) editorRef.current.innerHTML = ''
  }
  const updateDocument = (id, updates) => {
    const updated = { ...updates, date: new Date().toISOString().split('T')[0] }
    setDocuments(docs => docs.map(d => d.id === id ? { ...d, ...updated } : d))
    if (selectedDocument?.id === id) setSelectedDocument(prev => ({ ...prev, ...updated }))
  }
  const deleteDocument = id => {
    setDocuments(docs => docs.filter(d => d.id !== id))
    if (selectedDocument?.id === id) { setSelectedDocument(null); setDocTitle(''); if (editorRef.current) editorRef.current.innerHTML = '' }
  }
  const selectDocument = doc => {
    if (selectedDocument && editorRef.current) updateDocument(selectedDocument.id, { title: docTitle, htmlContent: editorRef.current.innerHTML })
    setSelectedDocument(doc)
    setDocTitle(doc.title)
    if (editorRef.current) editorRef.current.innerHTML = doc.htmlContent || ''
  }
  const handleEditorInput = () => {
    if (selectedDocument && editorRef.current) updateDocument(selectedDocument.id, { title: docTitle, htmlContent: editorRef.current.innerHTML })
  }
  const execCmd = (command, value = null) => { document.execCommand(command, false, value); editorRef.current?.focus() }
  const handleStyleChange = e => {
    const s = e.target.value
    if (s === 'Normal') execCmd('formatBlock', 'p')
    else if (s === 'Heading 1') execCmd('formatBlock', 'h1')
    else if (s === 'Heading 2') execCmd('formatBlock', 'h2')
    else if (s === 'Heading 3') execCmd('formatBlock', 'h3')
  }

  const sendEmail = () => {
    if (!emailForm.to || !emailForm.subject) return
    const { to, subject, body } = emailForm
    if (selectedSender?.provider === 'gmail') window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    else window.open(`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    setEmailLog(log => [{ id: Date.now(), to, subject, provider: selectedSender?.provider || 'gmail', sentAt: new Date().toLocaleString() }, ...log])
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 2500)
  }
  const addSenderProfile = () => {
    if (!newSender.name || !newSender.email) return
    setSenderProfiles(p => [...p, { ...newSender, id: `${newSender.provider}-${Date.now()}` }])
    setNewSender({ name: '', email: '', provider: 'gmail' })
    setShowAddSender(false)
  }
  const addAtlasDoc = () => {
    if (!newAtlasDoc.title.trim()) return
    const blocks = []
    if (newAtlasDoc.context.trim()) {
      blocks.push({ type: 'context', content: newAtlasDoc.context.trim() })
    }
    if (newAtlasDoc.insightTitle.trim() || newAtlasDoc.insightContent.trim()) {
      blocks.push({ type: 'key-insight', title: newAtlasDoc.insightTitle.trim() || 'KEY INSIGHT', content: newAtlasDoc.insightContent.trim() })
    }
    if (newAtlasDoc.notes.trim()) {
      const bullets = newAtlasDoc.notes.split('\n').map(l => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)
      blocks.push({ type: 'section', title: 'Notes', bullets })
    }
    setArchDocs(d => [...d, {
      id: `custom-${Date.now()}`,
      title: newAtlasDoc.title.trim().toUpperCase(),
      section: newAtlasDoc.section.trim() || 'General',
      badge: newAtlasDoc.badge.trim() || 'Doc',
      subtitle: newAtlasDoc.subtitle.trim(),
      description: newAtlasDoc.description.trim(),
      thesis: newAtlasDoc.thesis.trim(),
      blocks,
    }])
    setNewAtlasDoc({ title: '', section: '', badge: '', subtitle: '', description: '', thesis: '', context: '', insightTitle: '', insightContent: '', notes: '' })
    setShowAddAtlas(false)
  }

  const openEditAtlas = (doc) => {
    setEditingAtlasDoc(doc)
    setEditAtlasForm({
      title: doc.title || '',
      section: doc.section || '',
      badge: doc.badge || '',
      subtitle: doc.subtitle || '',
      description: doc.description || '',
      thesis: doc.thesis || '',
      blocksJson: JSON.stringify(doc.blocks || [], null, 2),
    })
    setEditBlocksError(false)
  }

  const saveEditAtlas = () => {
    let blocks
    try {
      blocks = JSON.parse(editAtlasForm.blocksJson)
      setEditBlocksError(false)
    } catch {
      setEditBlocksError(true)
      return
    }
    const updated = {
      ...editingAtlasDoc,
      title: editAtlasForm.title.trim() || editingAtlasDoc.title,
      section: editAtlasForm.section.trim() || editingAtlasDoc.section,
      badge: editAtlasForm.badge.trim(),
      subtitle: editAtlasForm.subtitle.trim(),
      description: editAtlasForm.description.trim(),
      thesis: editAtlasForm.thesis.trim(),
      blocks,
    }
    setArchDocs(d => d.map(doc => doc.id === editingAtlasDoc.id ? updated : doc))
    setSelectedAtlasDoc(updated)
    setEditingAtlasDoc(null)
  }

  const KANBAN_COLS = [
    { key: 'backlog', label: 'BACKLOG', tasks: backlogTasks, color: '#888', next: 'inprogress', nextLabel: 'Start' },
    { key: 'inprogress', label: 'IN PROGRESS', tasks: inprogressTasks, color: '#84A7F7', next: 'review', nextLabel: 'Review' },
    { key: 'review', label: 'REVIEW', tasks: reviewTasks, color: '#FF855C', next: 'done', nextLabel: 'Approve' },
    { key: 'done', label: 'DONE', tasks: doneTasks, color: '#5CB85C', next: null },
  ]
  const prevStatus = { inprogress: 'backlog', review: 'inprogress', done: 'review' }

  if (!user) return (
    <div className="login-screen">
      {!showPicker ? (
        /* ── Step 1: Sign-in landing ── */
        <div className="login-landing">
          <div className="login-logo"><img src="/leaf.svg" alt="Firma" className="login-logo-leaf" /></div>
          <div className="login-eyebrow">FIRMA · WORKSPACE</div>
          <h1 className="login-title">Nation of <em>Heaven</em></h1>
          <p className="login-sub">Sign in to access your workspace.</p>
          <button className="login-google-btn" onClick={() => setShowPicker(true)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <p className="login-footer">Access is granted to authorized members only.</p>
        </div>
      ) : (
        /* ── Step 2: Account picker ── */
        <div className="login-card">
          <div className="login-card-left">
            <div className="login-logo"><img src="/leaf.svg" alt="Firma" className="login-logo-leaf" /></div>
            <div className="login-eyebrow">FIRMA · WORKSPACE</div>
            <h1 className="login-title">Sign in<br />with <em>Google</em></h1>
            <p className="login-sub">to continue to<br /><strong>firma-team-system</strong></p>
          </div>
          <div className="login-card-right">
            {!showOtherInput ? (
              <>
                <div className="login-picker-title">Choose an account</div>
                {KNOWN_ACCOUNTS.map(acc => (
                  <button key={acc.email} className="login-account-row" onClick={() => loginAs(acc.name, acc.email)}>
                    <div className="login-avatar" style={{ background: acc.color }}>{acc.initials}</div>
                    <div className="login-account-info">
                      <div className="login-account-name">{acc.name}</div>
                      <div className="login-account-email">{acc.email}</div>
                    </div>
                  </button>
                ))}
                <button className="login-account-row login-other-row" onClick={() => setShowOtherInput(true)}>
                  <div className="login-avatar login-avatar-other">⊕</div>
                  <div className="login-account-info">
                    <div className="login-account-name">Use another account</div>
                  </div>
                </button>
              </>
            ) : (
              <div className="login-other-form">
                <div className="login-picker-title">Enter your email</div>
                <input
                  className="login-email-input"
                  type="email"
                  placeholder="you@example.com"
                  value={otherEmail}
                  onChange={e => setOtherEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && loginOther()}
                  autoFocus
                />
                <div className="login-other-actions">
                  <button className="login-back-btn" onClick={() => { setShowOtherInput(false); setOtherEmail('') }}>← Back</button>
                  <button className="login-next-btn" onClick={loginOther}>Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-eyebrow">FIRMA · WORKSPACE</div>
          <h2 className="brand-name">Nation of <em>Heaven</em></h2>
          <div className="brand-meta">March 2026 · Canonical</div>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map(({ key, label }) => (
            <button key={key} className={`nav-btn ${activeNav === key ? 'active' : ''}`} onClick={() => gateNav(key)}>
              <span className="nav-label">{label}</span>
              {activeNav === key && <span className="nav-chevron">›</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar-init" style={{ background: KNOWN_ACCOUNTS.find(a => a.email.toLowerCase() === user.email.toLowerCase())?.color || '#FF855C' }}>{initials(user.name)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{isAdmin ? 'Admin' : 'Guest'}</div>
            </div>
            <button className="sidebar-signout" onClick={() => { setUser(null); setIsAdmin(false); setUnlocked(false); setActiveNav('dashboard') }} title="Sign out">↩</button>
          </div>
        </div>
      </div>

      <main className={`main ${activeNav === 'notes' ? 'main-docs' : ''}`}>

        {/* ── DASHBOARD ── */}
        {activeNav === 'dashboard' && (
          <div className="view-scroll">
            <div className="breadcrumb">OVERVIEW · 04.23.2026</div>
            <h1 className="page-title">Today's <em>signal</em></h1>
            <p className="page-desc">Live snapshot of active work, documents in motion, and upcoming commitments across the Foundation.</p>
            <div className="dash-metrics">
              {[
                { label: 'TOTAL TASKS', value: tasks.length, sub: `${inprogressTasks.length} active` },
                { label: 'COMPLETION', value: `${completionRate}%`, sub: `${doneTasks.length} / ${tasks.length} done`, accent: true },
                { label: 'DOCUMENTS', value: documents.length, sub: 'canonical' },
                { label: 'EMAILS', value: emailLog.length, sub: 'sent' },
                { label: 'OVERDUE', value: overdueTasks.length, sub: overdueTasks.length === 0 ? 'clear' : 'needs attention' },
              ].map(({ label, value, sub, accent }) => (
                <div key={label} className="dash-metric-card">
                  <div className="dash-metric-label">{label}</div>
                  <div className={`dash-metric-value ${accent ? 'accent' : ''}`}>{value}</div>
                  <div className="dash-metric-sub">{sub}</div>
                </div>
              ))}
            </div>
            <div className="dash-mid">
              <div className="dash-pipeline-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Pipeline</span>
                  <span className="dash-card-label">BY STATUS</span>
                </div>
                {[
                  { label: 'Backlog', count: backlogTasks.length, color: '#888' },
                  { label: 'In Progress', count: inprogressTasks.length, color: '#84A7F7' },
                  { label: 'Review', count: reviewTasks.length, color: '#FF855C' },
                  { label: 'Done', count: doneTasks.length, color: '#5CB85C' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="pipeline-row">
                    <div className="pipeline-lbl">{label}</div>
                    <div className="pipeline-bar-wrap">
                      <div className="pipeline-bar" style={{ width: tasks.length > 0 ? `${(count / tasks.length) * 100}%` : '0%', background: color }} />
                    </div>
                    <div className="pipeline-count" style={{ color }}>{count}</div>
                  </div>
                ))}
              </div>
              <div className="dash-recent-card">
                <div className="dash-card-header">
                  <span className="dash-card-title">Recent docs</span>
                  <button className="dash-link" onClick={() => gateNav('notes')}>OPEN →</button>
                </div>
                {documents.slice(0, 3).map(doc => (
                  <div key={doc.id} className="recent-doc-row" onClick={() => gateNav('notes')}>
                    <span className="recent-doc-icon">⊡</span>
                    <div>
                      <div className="recent-doc-title">{doc.title}</div>
                      <div className="recent-doc-meta">{doc.category} · {doc.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-upcoming">
              <div className="dash-upcoming-hdr">
                <span className="dash-upcoming-title">Upcoming — <em>this week</em></span>
                <button className="dash-link" onClick={() => gateNav('planner')}>PLANNER →</button>
              </div>
              {upcomingTasks.length === 0 ? <div className="empty">No upcoming tasks</div> : upcomingTasks.map(t => (
                <div key={t.id} className="upcoming-row">
                  <div className={`upcoming-dot upcoming-dot--${t.status}`} />
                  <div className="upcoming-info">
                    <div className="upcoming-task-title">{t.title}</div>
                    <div className="upcoming-task-meta">{t.assignee} · {t.category}</div>
                  </div>
                  <span className={`upcoming-priority prio-${t.priority}`}>{t.priority}</span>
                  <span className="upcoming-date">{t.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PLANNER ── */}
        {activeNav === 'planner' && (
          <div className="view-scroll">
            <div className="breadcrumb">PLANNER · KANBAN</div>
            <h1 className="page-title">Work in <em>motion</em></h1>
            <div className="planner-sub">Drag cards between columns · {tasks.length} tasks</div>
            <div className="planner-add-form">
              <input className="input" placeholder="Task title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              <input className="input" placeholder="Category" value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })} />
              <input className="input" placeholder="Assignee" value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} />
              <input className="input" type="date" value={newTask.date} onChange={e => setNewTask({ ...newTask, date: e.target.value })} />
              <select className="input" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
              <select className="input" value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>
                <option value="backlog">Backlog</option><option value="inprogress">In Progress</option>
                <option value="review">Review</option><option value="done">Done</option>
              </select>
              <button className="btn-primary" onClick={addTask}>Add Task</button>
            </div>
            <div className="kanban-board-4">
              {KANBAN_COLS.map(col => (
                <div key={col.key} className="kanban-col" style={{ '--col-color': col.color }}>
                  <div className="kanban-col-hdr">
                    <span className="kanban-col-label">{col.label} <span className="kanban-col-count">{col.tasks.length}</span></span>
                  </div>
                  <div className="kanban-col-tasks">
                    {col.tasks.map(t => (
                      <div key={t.id} className="kanban-card">
                        <div className="kanban-card-badges">
                          {t.category && <span className="kanban-tag">{t.category}</span>}
                          <span className={`kanban-priority prio-dot-${t.priority}`}>◆ {t.priority}</span>
                        </div>
                        <div className="kanban-card-title">{t.title}</div>
                        <div className="kanban-card-meta">{t.assignee && <span>{t.assignee}</span>}{t.date && <span>· {t.date}</span>}</div>
                        <div className="kanban-card-actions">
                          {col.next && <button className="kaction-btn" onClick={() => moveTask(t.id, col.next)}>{col.nextLabel}</button>}
                          {col.key !== 'backlog' && <button className="kaction-btn secondary" onClick={() => moveTask(t.id, prevStatus[col.key])}>← Back</button>}
                          <button className="kaction-remove" onClick={() => removeTask(t.id)}>×</button>
                        </div>
                      </div>
                    ))}
                    <button className="kanban-add-task-btn" onClick={() => setNewTask({ ...newTask, status: col.key })}>+ ADD TASK</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {activeNav === 'notes' && (
          <div className="docs-layout">
            <div className="docs-list-panel">
              <button className="docs-new-btn" onClick={createDocument}>+ NEW DOCUMENT</button>
              <div className="docs-search-wrap">
                <input className="docs-search" placeholder="Search" value={docSearch} onChange={e => setDocSearch(e.target.value)} />
              </div>
              <div className="docs-list">
                {documents.filter(d => docSearch === '' || d.title.toLowerCase().includes(docSearch.toLowerCase())).map(doc => (
                  <div key={doc.id} className={`docs-list-item ${selectedDocument?.id === doc.id ? 'active' : ''}`} onClick={() => selectDocument(doc)}>
                    <div className="docs-item-badge">{doc.badge}</div>
                    <div className="docs-item-title">{doc.title}</div>
                    <div className="docs-item-meta">{doc.category} · {doc.date}</div>
                  </div>
                ))}
                {documents.length === 0 && <div className="empty" style={{ padding: '20px 16px' }}>No documents yet.</div>}
              </div>
            </div>
            <div className="docs-editor-panel">
              {!selectedDocument ? (
                <div className="docs-editor-empty">
                  <div style={{ fontSize: 48, marginBottom: 16, color: '#ddd' }}>⊡</div>
                  <div className="docs-editor-empty-text">Select a document to view</div>
                  <div className="docs-editor-empty-sub">or click + to create a new one</div>
                  <button className="btn-primary" style={{ marginTop: 20 }} onClick={createDocument}>New Document</button>
                </div>
              ) : (
                <div className="docs-editor-inner">
                  <div className="docs-editor-topbar">
                    <span className="docs-editor-cat">{selectedDocument.category?.toUpperCase()}</span>
                    <div className="docs-editor-topbar-right">
                      <span className="docs-editor-saved">Saved · {selectedDocument.date}</span>
                      <button className="docs-editor-del" onClick={() => deleteDocument(selectedDocument.id)}>🗑</button>
                    </div>
                  </div>
                  <input className="docs-title-input" value={docTitle}
                    onChange={e => { setDocTitle(e.target.value); updateDocument(selectedDocument.id, { title: e.target.value, htmlContent: editorRef.current?.innerHTML || '' }) }}
                    placeholder="Document title" />
                  <div className="docs-rich-toolbar">
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={() => execCmd('bold')}><b>B</b></button>
                      <button className="toolbar-btn" onClick={() => execCmd('italic')}><i>I</i></button>
                      <button className="toolbar-btn" onClick={() => execCmd('underline')}><u>U</u></button>
                    </div>
                    <div className="toolbar-divider" />
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={() => execCmd('formatBlock', 'h1')}>H₁</button>
                      <button className="toolbar-btn" onClick={() => execCmd('formatBlock', 'h2')}>H₂</button>
                    </div>
                    <div className="toolbar-divider" />
                    <div className="toolbar-group">
                      <button className="toolbar-btn" onClick={() => execCmd('insertUnorderedList')}>≡</button>
                      <button className="toolbar-btn" onClick={() => execCmd('insertOrderedList')}>1.</button>
                      <button className="toolbar-btn" onClick={() => execCmd('formatBlock', 'blockquote')}>❝</button>
                    </div>
                    <div className="toolbar-divider" />
                    <div className="toolbar-group">
                      <select className="toolbar-select" onChange={handleStyleChange}>{TEXT_STYLES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                      <select className="toolbar-select" onChange={e => execCmd('fontName', e.target.value)}>{FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}</select>
                      <select className="toolbar-select" onChange={e => execCmd('fontSize', e.target.value.replace('px', ''))}>{FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                    </div>
                    <span className="docs-toolbar-hint">SELECT TEXT, THEN FORMAT</span>
                  </div>
                  <div ref={editorRef} className="docs-rich-content rich-editor-content" contentEditable onInput={handleEditorInput} suppressContentEditableWarning />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EMAIL ── */}
        {activeNav === 'email' && (
          <div className="view-scroll">
            <div className="breadcrumb">EMAIL COMPOSER</div>
            <h1 className="page-title">Draft a <em>message</em></h1>
            <p className="page-desc">Compose here and hand off to your mail client via Gmail or Outlook.</p>
            <div className="email-layout">
              <div className="email-compose">
                <div className="email-field-label">FROM</div>
                <div className="email-sender-row">
                  <select className="input" value={emailForm.senderId} onChange={e => setEmailForm({ ...emailForm, senderId: e.target.value })}>
                    {senderProfiles.map(s => <option key={s.id} value={s.id}>{s.name}{s.email ? ` — ${s.email}` : ''}</option>)}
                  </select>
                </div>
                <div className="email-field-label">TO</div>
                <input className="input" placeholder="recipient@example.com" value={emailForm.to} onChange={e => setEmailForm({ ...emailForm, to: e.target.value })} />
                <div className="email-field-label">SUBJECT</div>
                <input className="input" placeholder="Subject line" value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} />
                <div className="email-field-label">MESSAGE</div>
                <textarea className="textarea" placeholder="Write your message..." value={emailForm.body} onChange={e => setEmailForm({ ...emailForm, body: e.target.value })} />
                <button className="btn-primary" onClick={sendEmail}>Send via {selectedSender?.provider === 'gmail' ? 'Gmail' : 'Outlook'}</button>
                {emailSent && <div className="success-msg">Email client opened!</div>}
              </div>
              <div className="email-sidebar-panel">
                <div className="email-accounts-card">
                  <div className="email-panel-hdr">Sender Accounts</div>
                  {senderProfiles.map(s => (
                    <div key={s.id} className={`email-account-item ${emailForm.senderId === s.id ? 'active' : ''}`} onClick={() => setEmailForm({ ...emailForm, senderId: s.id })}>
                      <div className={`email-account-icon ${s.provider}`}>{s.provider === 'gmail' ? 'G' : 'O'}</div>
                      <div><div className="email-account-name">{s.name}</div><div className="email-account-addr">{s.email || 'No email set'}</div></div>
                    </div>
                  ))}
                  <button className="email-add-btn" onClick={() => setShowAddSender(true)}>+ Add Account</button>
                </div>
                {emailLog.length > 0 && (
                  <div className="email-log-card">
                    <div className="email-panel-hdr">Sent Log</div>
                    {emailLog.slice(0, 5).map(log => (
                      <div key={log.id} className="email-log-item">
                        <div className="email-log-to">To: {log.to}</div>
                        <div className="email-log-subj">{log.subject}</div>
                        <div className="email-log-meta">{log.provider} · {log.sentAt}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {showAddSender && (
              <div className="modal-overlay" onClick={() => setShowAddSender(false)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-title">Add Sender Account</div>
                  <input className="input" placeholder="Account name (e.g. Work Gmail)" value={newSender.name} onChange={e => setNewSender({ ...newSender, name: e.target.value })} />
                  <input className="input" placeholder="Email address" value={newSender.email} onChange={e => setNewSender({ ...newSender, email: e.target.value })} />
                  <select className="input" value={newSender.provider} onChange={e => setNewSender({ ...newSender, provider: e.target.value })}>
                    <option value="gmail">Gmail</option><option value="outlook">Outlook</option>
                  </select>
                  <div className="modal-actions">
                    <button className="btn-primary" onClick={addSenderProfile}>Add Account</button>
                    <button className="btn-remove" onClick={() => setShowAddSender(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ARCHITECTURE ATLAS ── */}
        {activeNav === 'atlas' && !selectedAtlasDoc && (
          <div className="view-scroll">
            <div className="breadcrumb">FIRMA · CANONICAL INDEX</div>
            <div className="atlas-hdr-row">
              <h1 className="page-title" style={{ marginBottom: 0 }}>Architecture <em>atlas</em></h1>
              <button className="btn-primary" onClick={() => setShowAddAtlas(true)}>+ Add</button>
            </div>
            <p className="page-desc" style={{ marginTop: 12 }}>Every layer serves the decree. All documents referenced from the canonical foundation — search to locate, click to open.</p>
            <div className="atlas-stats">
              <span className="atlas-stat-num">{archDocs.length}</span>
              <span className="atlas-stat-lbl">DOCUMENTS</span>
              <span className="atlas-stat-num">{Object.keys(atlasSections).length}</span>
              <span className="atlas-stat-lbl">SECTIONS</span>
            </div>
            <div className="atlas-search-wrap">
              <input className="atlas-search" placeholder="Search the index..." value={atlasSearch} onChange={e => setAtlasSearch(e.target.value)} />
            </div>
            {Object.entries(atlasSections).map(([section, docs]) => (
              <div key={section} className="atlas-section">
                <div className="atlas-section-hdr">
                  <span className="atlas-section-label">{section.toUpperCase()}</span>
                  <span className="atlas-section-count">{docs.length}</span>
                </div>
                <div className="atlas-doc-grid">
                  {docs.map(doc => (
                    <div key={doc.id} className="atlas-card" onClick={() => doc.externalUrl ? window.open(doc.externalUrl, '_blank', 'noopener,noreferrer') : setSelectedAtlasDoc(doc)}>
                      <div className="atlas-card-top">
                        <span className="atlas-badge">{doc.badge}</span>
                        <span className="atlas-card-arrow">↗</span>
                      </div>
                      <div className="atlas-card-title">{doc.title}</div>
                      <div className="atlas-card-sub">{doc.subtitle || doc.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {showAddAtlas && (
              <div className="modal-overlay" onClick={() => setShowAddAtlas(false)}>
                <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ gap: 0 }}>
                  <div className="modal-title">New Atlas Document</div>
                  <div className="add-atlas-section-label">HEADER</div>
                  <div className="add-atlas-row">
                    <input className="input" placeholder="Title *" value={newAtlasDoc.title} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, title: e.target.value })} style={{ flex: 2 }} />
                    <input className="input" placeholder="Badge (e.g. Framework)" value={newAtlasDoc.badge} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, badge: e.target.value })} style={{ flex: 1 }} />
                    <input className="input" placeholder="Section (e.g. Foundation)" value={newAtlasDoc.section} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, section: e.target.value })} style={{ flex: 1 }} />
                  </div>
                  <div className="add-atlas-row">
                    <input className="input" placeholder="Subtitle (e.g. Firma Sovereign Foundation · Asia-Pacific)" value={newAtlasDoc.subtitle} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, subtitle: e.target.value })} style={{ flex: 2 }} />
                    <input className="input" placeholder="Description (e.g. West Luzon · 2026)" value={newAtlasDoc.description} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, description: e.target.value })} style={{ flex: 1 }} />
                  </div>
                  <textarea className="textarea" style={{ minHeight: 60 }} placeholder="Thesis — one-sentence strategic position for this document" value={newAtlasDoc.thesis} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, thesis: e.target.value })} />
                  <div className="add-atlas-section-label">CONTEXT BLOCK</div>
                  <textarea className="textarea" style={{ minHeight: 80 }} placeholder="What is this? Why does it exist? How does it fit into the broader system?" value={newAtlasDoc.context} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, context: e.target.value })} />
                  <div className="add-atlas-section-label">KEY INSIGHT <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— optional highlighted callout</span></div>
                  <input className="input" placeholder="Insight label (e.g. KEY STRUCTURAL DECISION: 60/40 OWNERSHIP)" value={newAtlasDoc.insightTitle} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, insightTitle: e.target.value })} />
                  <textarea className="textarea" style={{ minHeight: 70 }} placeholder="Insight body — the single most important thing to know" value={newAtlasDoc.insightContent} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, insightContent: e.target.value })} />
                  <div className="add-atlas-section-label">NOTES <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— one item per line, becomes bullet list</span></div>
                  <textarea className="textarea" style={{ minHeight: 90 }} placeholder={"- First point\n- Second point\n- Third point"} value={newAtlasDoc.notes} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, notes: e.target.value })} />
                  <div className="modal-actions" style={{ marginTop: 8 }}>
                    <button className="btn-primary" onClick={addAtlasDoc}>Add Document</button>
                    <button className="btn-remove" onClick={() => setShowAddAtlas(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeNav === 'atlas' && selectedAtlasDoc && (
          <div className="view-scroll">
            <div className="atlas-detail-toolbar">
              <button className="btn-back" onClick={() => setSelectedAtlasDoc(null)}>← Back to Atlas</button>
              <button className="btn-edit-atlas" onClick={() => openEditAtlas(selectedAtlasDoc)}>✎ Edit</button>
            </div>
            <AtlasDocRenderer doc={selectedAtlasDoc} />
            {editingAtlasDoc && (
              <div className="modal-overlay" onClick={() => setEditingAtlasDoc(null)}>
                <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ gap: 0 }}>
                  <div className="modal-title">Edit Document</div>
                  <div className="add-atlas-section-label">HEADER</div>
                  <div className="add-atlas-row">
                    <input className="input" placeholder="Title" value={editAtlasForm.title} onChange={e => setEditAtlasForm({ ...editAtlasForm, title: e.target.value })} style={{ flex: 2 }} />
                    <input className="input" placeholder="Badge" value={editAtlasForm.badge} onChange={e => setEditAtlasForm({ ...editAtlasForm, badge: e.target.value })} style={{ flex: 1 }} />
                    <input className="input" placeholder="Section" value={editAtlasForm.section} onChange={e => setEditAtlasForm({ ...editAtlasForm, section: e.target.value })} style={{ flex: 1 }} />
                  </div>
                  <div className="add-atlas-row">
                    <input className="input" placeholder="Subtitle" value={editAtlasForm.subtitle} onChange={e => setEditAtlasForm({ ...editAtlasForm, subtitle: e.target.value })} style={{ flex: 2 }} />
                    <input className="input" placeholder="Description" value={editAtlasForm.description} onChange={e => setEditAtlasForm({ ...editAtlasForm, description: e.target.value })} style={{ flex: 1 }} />
                  </div>
                  <textarea className="textarea" style={{ minHeight: 56 }} placeholder="Thesis" value={editAtlasForm.thesis} onChange={e => setEditAtlasForm({ ...editAtlasForm, thesis: e.target.value })} />
                  <div className="add-atlas-section-label">BLOCKS <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— edit JSON directly</span></div>
                  <textarea
                    className="textarea atlas-blocks-editor"
                    style={{ minHeight: 300, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5 }}
                    value={editAtlasForm.blocksJson}
                    onChange={e => { setEditAtlasForm({ ...editAtlasForm, blocksJson: e.target.value }); setEditBlocksError(false) }}
                    spellCheck={false}
                  />
                  {editBlocksError && <div className="lock-error">Invalid JSON — check the blocks array and try again.</div>}
                  <div className="modal-actions" style={{ marginTop: 8 }}>
                    <button className="btn-primary" onClick={saveEditAtlas}>Save Changes</button>
                    <button className="btn-remove" onClick={() => setEditingAtlasDoc(null)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ── LOCK GATE ── */}
      {pendingNav && !unlocked && (
        <div className="lock-overlay">
          <div className="lock-modal">
            <div className="lock-icon">🔒</div>
            <div className="lock-title">Protected Area</div>
            <div className="lock-sub">This section requires authorization to access.</div>
            <input
              className="input lock-input"
              type="password"
              placeholder="Enter access code"
              value={lockInput}
              onChange={e => setLockInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitLock()}
              autoFocus
            />
            {lockError && (
              <div className="lock-error">Incorrect code. {2 - lockAttempts === 1 ? '1 attempt remaining.' : ''}</div>
            )}
            <div className="lock-actions">
              <button className="btn-primary" onClick={submitLock}>Unlock</button>
              <button className="btn-remove" onClick={() => { setPendingNav(null); setLockInput(''); setLockAttempts(0); setLockError(false) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
