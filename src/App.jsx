import { useState, useRef } from 'react'

const INITIAL_TASKS = [
  { id: 1, title: 'Bataan HQ Visit', category: 'DEPLOYMENT', priority: 'high', assignee: '@Karl', date: '2026-04-30', status: 'inprogress' },
]

const INITIAL_DOCUMENTS = [
  { id: 1, title: 'Q2 Strategic Priorities', category: 'Strategy', badge: 'BRIEF', date: '2026-04-22', htmlContent: '<h2>Q2 Strategic Priorities</h2><p>This quarter we focus on three tracks: <strong>deployment</strong>, <strong>partnerships</strong>, and <strong>canonical documentation</strong>.</p><h3>Deployment</h3><p>Bataan Freeport activation, Africa corridor progress.</p><h3>Partnerships</h3><p>SRI integration, NSS co-development, Base membrane.</p>' },
  { id: 2, title: 'Partnership Outreach Playbook', category: 'BizDev', badge: 'PLAYBOOK', date: '2026-04-20', htmlContent: '<h2>Partnership Outreach Playbook</h2><p>Framework for establishing and maintaining key partnerships across the Firma network.</p>' },
  { id: 3, title: 'Weekly Team Notes — Apr 20', category: 'Ops', badge: 'NOTES', date: '2026-04-21', htmlContent: '<h2>Weekly Team Notes — Apr 20</h2><p>Team sync notes covering active deployments, blockers, and next steps.</p>' },
]

const INITIAL_ARCH_DOCS = [
  {
    id: 'bataan-framework',
    title: 'BATAAN FRAMEWORK',
    section: 'Foundation',
    badge: 'Framework',
    subtitle: 'Firma Sovereign Foundation · Asia-Pacific Deployment Strategy',
    description: 'West Luzon Corridor · 2026–2028 · V1.0',
    content: `CORE MISSION\nEstablish Bataan as Firma's primary Asia-Pacific operational headquarters — a sovereign-grade zone corridor that functions as a Settlemint anchor, logistics gateway, and compliance-ready base for all Southeast Asian operations. Three sites: Dinalupihan (HQ), Mariveles/AFAB (zone operations), and SBFZ (logistics and international gateway).\n\nKEY STRUCTURAL DECISION: 60/40 OWNERSHIP\nForeign corporations cannot purchase land in the Philippines. Land ownership is restricted to Filipino citizens and corporations with at least 60% Filipino equity. The corporation must be structured 60% Filipino / 40% foreign from day one.\n\nREGISTRATION SEQUENCE: SEC → SBFZ → Office Setup → FAB → Land Acquisition\n\n────────────────────────────────────\nPHASE 1 — FOUNDATION (Month 0–3)\nTheme: Legal entity formation — SEC first, SBFZ second\nRealistic Total: 2.5–3 months\n────────────────────────────────────\n\n1. SEC Registration — File Articles of Incorporation under RA 11232 with 60/40 ownership structure. Authorized capital: ₱20,000,000. Appoint Corporate Secretary (must be Filipino resident). Est. Time: 2–4 weeks\n\n2. Open Corporate Bank Account — Required for capitalization proof before SBMA application. Est. Time: 1–2 weeks\n\n3. Prepare SBMA Application Package — LOI to SBMA Chairman, business plan + financial projections, company profile, risk & safety assessment, SEC cert + Articles, bank capitalization proof. Est. Time: 2–3 weeks\n\n4. Submit SBMA Application — File via One-Stop Shop or online portal. Fee: ₱5,000. Est. Time: 1–3 months\n\n5. Obtain CRTE — Certificate of Registration and Tax Exemption. Unlocks 5% GIT, duty-free imports, VAT zero-rating. Issued upon SBMA approval.\n\n6. BIR Registration — TIN, COR, authority to print invoices via BIR Form 1903. Fee: ₱500. Est. Time: 2–4 weeks\n\n7. SSS / PhilHealth / Pag-IBIG — Register for all employees. Under 10 employees = simplified remittance. Est. Time: 1–2 weeks\n\n8. Secure SBFZ Physical Lease (HQ Office) — SBMA requires actual presence. Rate: ~₱50–200/sqm/month. Est. Time: 1–2 weeks\n\nExit Criteria: CRTE received, BIR COR issued, all agency registrations complete.\n\n────────────────────────────────────\nPHASE 2 — EXPANSION (Month 3–12)\nTheme: HQ office live, operations structured, FAB registered\nRealistic Total: 4–6 months\n────────────────────────────────────\n\n1. Office Setup (Design → Build) — Hire licensed architect, design HQ layout, fit-out the leased space, set up IT infrastructure, utilities, and signage. Est. Time: 1–2 months\n\n2. Bookkeeping & Accounting Setup — Hire or contract a CPA/bookkeeper. Set up accounting system (QuickBooks, Xero, or local alternative). Est. Time: 3–4 weeks\n\n3. Payroll System — Set up payroll aligned with SSS, PhilHealth, Pag-IBIG contribution schedules. Define pay cycle and pay slips. Est. Time: 2–3 weeks\n\n4. Begin Quarterly BIR Filings — File and pay 5% GIT quarterly. Lock in compliance calendar (due dates: Apr 30, Jul 31, Oct 31, Jan 31). Ongoing.\n\n5. FAB Registration (Freeport Area of Bataan) — Once SBFZ office is active and operations are established, register with AFAB as a locator for Bataan-side operations. Requires separate AFAB application and locator agreement. Est. Time: 1–3 months\n\n6. SBMA Annual Report Prep — Start collecting employment data and financial statements for first annual SBMA submission. Ongoing.\n\nExit Criteria: SBFZ HQ operational (occupancy permit secured), bookkeeping system live, FAB registration filed or approved.\n\n────────────────────────────────────\nPHASE 3 — LAND ACQUISITION (After FAB is Secured)\nTheme: Secure land — the hardest and longest part\nRealistic Total: 12–24 months from start of land search\n────────────────────────────────────\n\n1. Identify Target Land — Prospect lots near SBFZ/Bataan corridor. Engage licensed broker (PRC-registered). Factor in zoning, SBMA perimeter rules, flood maps, access roads. Est. Time: 2–4 months\n\n2. Due Diligence — Verify clean OCT/TCT at Registry of Deeds; no encumbrances, liens, or adverse claims. Check agricultural classification (may require DAR clearance), DENR classification, and real property tax status. Est. Time: 2–3 months\n\n3. DAR Clearance (if agricultural) — If land is classified agricultural, secure Department of Agrarian Reform clearance before any sale can proceed. This is the longest possible blocker. Est. Time: 3–6 months if required.\n\n4. Negotiate and Execute Deed of Absolute Sale — Notarized; buyer listed as Firma corporation. Lock in price, payment terms, and turn-over conditions. Est. Time: 2–4 weeks\n\n5. Pay Transfer Taxes — Capital Gains Tax: 6% (seller's obligation, often negotiated); Documentary Stamp Tax: 1.5% (buyer); Transfer Tax at LGU: 0.5–0.75%. Real Property Tax clearance required. Est. Time: 1–2 months\n\n6. Obtain CAR from BIR — Certificate Authorizing Registration. BIR issues after all taxes are paid. Required before title can transfer. Est. Time: 3–6 weeks\n\n7. Title Transfer at Registry of Deeds — New TCT issued in Firma corporation's name. Final step. Est. Time: 2–4 weeks\n\nExit Criteria: Clean TCT issued in Firma corporation's name.\n\n────────────────────────────────────\nPHASE 4 — FAB EXTENSION / OWN ECONOMIC ZONE (Long-Term)\nTheme: Firma becomes the zone — sovereign economic territory\n────────────────────────────────────\n\nOption A — FAB Extension\nPetition AFAB to formally include Firma's land within the FAB perimeter. Less control — AFAB remains authority. No revenue upside. Unlocks tax exemptions, duty-free, 100% foreign ownership for locators on Firma land. Timeline: 1–2 years after land secured.\n\nOption B — Own PEZA Zone\nApply with PEZA to establish a private economic zone on Firma-owned land. Full control — Firma is the zone operator. Revenue upside from locator fees and zone admin. Firma sub-leases space to locators; hosts other companies inside its perimeter. Timeline: 2–4 years after land secured.\n\nRECOMMENDED FIRST MOVE: Pursue FAB Extension while simultaneously scoping the PEZA zone application — they are not mutually exclusive. FAB Extension accelerates the credibility needed for a PEZA application.`
  },
  {
    id: 'priority-hq',
    title: 'PRIORITY: FIT HQ Setup',
    section: 'Priority Actions',
    badge: 'Priority',
    subtitle: 'Physical HQ & Compliance Foundation',
    description: 'MSpace Balanga + Freeport Area options — securing the base of operations',
    content: `FIT HQ PRIORITY\n\nWe're set to look at MSpace in Balanga and a couple other options inside the Freeport Area. We would love to get a small fund as support so that when we go to visit in person, it's proper and on time — photos, feel the space, not just a price sheet. Whatever we lock down must feel like a base of operations, not just desks with a logo slapped on.\n\n────────────────────────────────────\nFOR SECURING THE PHYSICAL HQ\n────────────────────────────────────\n\n• Business lease agreement review (commercial use and events rights)\n• Barangay clearance for business operations in Balanga City\n• Mayor's Business Permit (City of Balanga) — required before we can operate FIT HQ officially\n• BIR registration (if FIRMA / FIT will be billing or transacting out of this address)\n• DOLE compliance if we're onboarding local staff working out of this location\n• Fire safety inspection certificate and occupancy clearance\n• Coordination with the Freeport Authority of Bataan (FAB) if we go the Freeport Area route — they have their own permitting layer separate from the city\n\n────────────────────────────────────\nFOR ESTABLISHING FIRMA IP IN THE PHILIPPINES\n────────────────────────────────────\n\n• Trademark registration with IPOPHL — covering FIRMA, FIT, SEEDBASE, and Nation of Heaven marks across key classes:\n  - Class 9: tech/software\n  - Class 35: business services\n  - Class 36: financial/token-related\n  - Class 41: events and education\n• Trade name registration with SEC (if setting up a local entity under the FIRMA brand)\n• Copyright filing for original creative assets — visual identity, documents, content, architectural frameworks\n• Domain and brand protection sweep (lock all key URLs, handles, and variations before going public)\n• If tokenizing anything locally — early coordination with the SEC Philippines on token/digital asset classification\n• NDA and IP assignment agreements for all local contractors, crew, and staff from day one\n\nSTRATEGY: Do this clean from the start in Bataan so when we replicate the model in other countries, we already have a working compliance template to hand off. No scrambling, no retrofitting.\n\n────────────────────────────────────\nKEY CONTACT: RECURRA\n────────────────────────────────────\n\nPrimary contact for event logistics, film crew, and agencies.\nNote: Clarky personally knows the Owner.\n\nFacebook: https://www.facebook.com/recurraph\nWebsite: https://www.recurraph.com/\n\nSub-services: Event Logistics · Film Crew · Agencies`
  },
  {
    id: 'events-calendar',
    title: 'FIT 2026 EVENT CALENDAR',
    section: 'Events',
    badge: 'Events',
    subtitle: 'SEA & Asia Event Scouting — 2026',
    description: 'No PBW. Only high-impact, high-visibility events worth showing up to like a movement.',
    content: `FIT — 2026 SEA & ASIA EVENT SCOUTING CALENDAR\nNo PBW. Only high-impact, high-visibility events worth showing up to like a movement.\n\n════════════════════════════════════\nTIER 1 — MUST BE THERE (Non-negotiables)\n════════════════════════════════════\n\n1. TOKEN2049 SINGAPORE\nDate: October 7–8, 2026 (After2049 afterparty: October 9)\nLocation: Marina Bay Sands, Singapore\nScale: World's largest crypto event — 25,000+ attendees, 7,000+ companies, 160+ countries\n\nWhy FIT needs to be here: This is THE event. OKX is a title sponsor, Base shows up heavy, every major exchange and protocol has a booth, side events, and afterparties running the whole week. The Singapore F1 Grand Prix overlaps the same week — the city is electric. FIT needs a booth, a side event, and a presence all week — not just the 2 conference days.\n\nFIT Play: Sponsor a side event during Token2049 week, run a booth on the main floor, host an afterparty that becomes a talking point.\nBudget category: Major activation — Tier 1 spend.\n\n────────────────────────────────────\n2. COINFEST ASIA — BALI\nDate: August 20–21, 2026\nLocation: Nuanu Juice Center, Bali, Indonesia\nScale: World's largest crypto festival — 10,000+ attendees in a tropical, open-air festival format\n\nWhy FIT needs to be here: Coinfest isn't a conference — it's a cultural moment. It's the most vibe-driven, community-first event in Asia. No suits, no stiff panels — just builders, creators, and degens in Bali. This aligns directly with FIT's belonging-first, movement energy.\n\nFIT Play: Activation booth with merch drops, a SEEDBASE pop-up, and a side event or community beach meetup. Hire a local Bali crew for content capture.\nBudget category: Mid-tier — high community impact per dollar.\n\n────────────────────────────────────\n3. KOREA BLOCKCHAIN WEEK (KBW) — SEOUL\nDate: September 29 – October 1, 2026\nLocation: Seoul, South Korea\nScale: 7,000+ registered attendees, 120+ speakers\n\nWhy FIT needs to be here: KBW happens the week before TOKEN2049 — meaning the crypto world is traveling from Seoul to Singapore in one continuous run. FIT can be present at both back-to-back, maximizing one travel window. Seoul's Web3 scene is massive and underserved by Western brands trying to break into Asia.\n\nFIT Play: Side event or executive dinner during KBW week. Coordinate with Hype3's local Korea team for ground support.\nBudget category: Mid-tier — strong ROI when stacked with Token2049 travel.\n\n════════════════════════════════════\nTIER 2 — HIGH PRIORITY (Go if activation is right)\n════════════════════════════════════\n\n4. SOUTHEAST ASIA BLOCKCHAIN WEEK (SEABW) — BANGKOK\nDate: May 18–24, 2026 (Main Conference: May 20–21)\nLocation: True Icon Hall, Bangkok, Thailand\nScale: 3,000+ participants\n\nWhy FIT should be here: Bangkok is the most Web3-friendly city in SEA right now. SEABW is purpose-built for the SEA circuit — the audience is exactly FIT's target: regional builders and community leaders. Test ground before the larger Token2049 activation.\n\nFIT Play: Booth presence, community panel or side event. Contract CH3 Bangkok team for local production support.\nBudget category: Mid-tier.\n\n────────────────────────────────────\n5. AIBC ASIA / SiGMA ASIA — MANILA\nDate: June 1–3, 2026\nLocation: SMX Convention Center, Manila, Philippines\nScale: Multi-day expo covering AI, blockchain, Web3, iGaming, fintech\n\nWhy FIT should be here: Home ground — it's Manila, it's at SMX, and it's an international summit coming to your doorstep. FIT's presence here signals it's the go-to local infrastructure for anyone coming into the PH market.\n\nFIT Play: Local anchor activation — booth, brand presence, host a side event or dinner for international delegates.\nBudget category: Lower cost (home ground) — high strategic value.\n\n────────────────────────────────────\n6. WebX — TOKYO, JAPAN\nDate: July 13–14, 2026\nLocation: Tokyo, Japan\n\nWhy FIT should consider it: Japan is one of the most regulated and respected crypto markets in Asia. Being visible at WebX builds credibility with institutional and serious builder audiences.\n\nFIT Play: Speaking slot or brand presence. Coordinate with Hype3's Japan team.\nBudget category: Selective — prioritize if there's a specific partnership or announcement tied to Japan.\n\n────────────────────────────────────\n7. NETWORK SCHOOL — FOREST CITY, MALAYSIA\nDate: Monthly cohorts (January 2026 cohort confirmed)\nLocation: Forest City, Johor, Malaysia\n\nWhy this is different: Network School was founded by Balaji Srinivasan (former Coinbase exec, author of The Network State) — the exact ideological overlap with FIT's Nation of Heaven vision. This is THE ideological home base for the vision FIT is building.\n\nFIT Play: Send Karl and/or Clarky to a cohort as participants — not exhibitors. Build relationships inside the room. The people here are the builders, thinkers, and founders who will understand FIT's vision at the deepest level.\nBudget category: Low cost — extremely high strategic value.\n\n════════════════════════════════════\nFIT'S 2026 EVENT RUN SUMMARY\n════════════════════════════════════\n\nJune      AIBC / SiGMA Asia          Manila, PH           PRIORITY 2\nJuly      WebX                       Tokyo, Japan         PRIORITY 2\nAugust    Coinfest Asia              Bali, Indonesia      PRIORITY 1\nSeptember Korea Blockchain Week      Seoul, South Korea   PRIORITY 1\nOctober   TOKEN2049 Singapore        Singapore            PRIORITY 1 — FLAGSHIP\nOngoing   Network School             Forest City, MY      PARTICIPATION — STRATEGIC\n\n5–6 events across 5 countries from June to October. Each event feeds the next one's hype. Every city gets content. Every activation proves the blueprint.`
  },
  {
    id: 'peso-partnership',
    title: 'FIRMA × PESO BATAAN',
    section: 'Partnerships',
    badge: 'Partnership',
    subtitle: 'Community & Government Partnership Framework',
    description: "Leverage Clarky's relationship with PESO Bataan head for employment and community engagement",
    content: `FIRMA × PESO BATAAN — PARTNERSHIP FRAMEWORK\nLeverage: Clarky's existing relationship with PESO Bataan head\nGoal: Build Firma's name in Bataan through social good, employment, and community service\n\nWHAT PESO IS AND WHY IT MATTERS FOR FIRMA\nPESO (Public Employment Service Office) is a government-operated employment and livelihood office under DOLE. In Bataan, PESO organizes job fairs, connects employers to workers, facilitates skills training, and is the primary channel companies use for ESR (Employee Social Responsibility) and community outreach. It has direct relationships with barangay officials, schools, and local government — exactly the network Firma needs to be trusted in.\n\n════════════════════════════════════\nHOW FIRMA ORGANIZES WITH PESO — 3 LAYERS\n════════════════════════════════════\n\nLAYER 1 — FIRMA AS AN EMPLOYER PARTNER\nThe most natural and fastest entry point.\n\n• Job Fair Participation — Firma sets up a booth at PESO Bataan job fairs. Benefit: Brand visibility to hundreds of local applicants in one day.\n• Post Job Listings — Firma submits open roles (ops, tech, community, trades) to PESO's database. Benefit: Pipeline for the 93% local hire mandate.\n• Skills Matching — PESO identifies candidates for TESDA blockchain training cohorts. Benefit: Feeds directly into Firma's Phase 2 workforce buildout.\n\nLAYER 2 — FIRMA AS A TRAINING PARTNER\nPESO regularly coordinates with TESDA and employers to run livelihood and upskilling programs.\n\n• Blockchain Literacy Bootcamp — Co-hosted by Firma + PESO + TESDA; PESO recruits participants from local barangays.\n• Freelancer Upskilling — Digital skills (remote work, crypto wallets, Web3 basics) — PESO promotes, Firma delivers at HQ.\n• Youth Tech Track — For students — intro to agentic AI, SeedBase, and FIG — co-branded with PESO.\n\nLAYER 3 — FIRMA AS AN ESR PARTNER\nWhere Firma builds its public name and government goodwill.\n\n• Livelihood Fair — SeedBase merchant onboarding, FIG wallet setup, solar energy demo. PESO provides: venue, community mobilization, LGU endorsement.\n• Job Readiness Seminar — Firma team facilitates; focus on Web3 careers and remote work.\n• Community Solar / Power Demo — EDGE solar pod showcase. PESO coordinates media coverage.\n• CIK Mission Day — Food, medical, digital literacy pack. PESO facilitates coordination with DSWD and barangay captains.\n\n════════════════════════════════════\nTHE IMMEDIATE ASK — HOW TO START\n════════════════════════════════════\n\n1. Clarky sets a coffee meeting with the PESO head — introduce Firma, share the plain-language one-pager, and ask: "What does PESO need right now that Firma can help with?"\n\n2. Propose a co-hosted Job Fair booth at the next PESO Bataan job fair as the first official collaboration — low commitment, high visibility.\n\n3. Sign a simple MOU between Firma Sovereign Foundation and PESO Bataan — formalizes the partnership, gives Firma a government-recognized relationship on record.\n\n4. Cross-promote — PESO promotes HQ open house to their network; Firma promotes PESO's job fair at the PBN event.\n\n════════════════════════════════════\nWHY THIS BUILDS FIRMA'S NAME\n════════════════════════════════════\n\n• Firma at the PESO job fair → "They create local jobs"\n• Firma running blockchain training with TESDA → "They invest in Bataan people"\n• Firma doing CIK missions endorsed by PESO → "Government trusts them"\n• Firma HQ as a PESO-endorsed community hub → "They are here to stay"\n\nBy the time Firma applies for AFAB licensing and approaches the Governor's office, PESO's endorsement is already social proof that the Foundation is a legitimate community partner — not just another foreign crypto company.`
  },
  {
    id: 'land-plan',
    title: 'LAND ACQUISITION PLAN',
    section: 'Legal & Land',
    badge: 'Legal',
    subtitle: '60/40 Corporate Structure & TCT Transfer',
    description: 'The only legal path for Firma to hold land in the Philippines',
    content: `WHY FIRMA CANNOT BUY LAND DIRECTLY\nForeign entities cannot own private land in the Philippines — constitutional restriction under Article XII, Section 7 of the 1987 Constitution. This applies to Firma regardless of AFAB registration status, CRTE issuance, or any freeport classification. SEC registration alone does not confer land ownership rights.\n\nThe only legal path: a Philippine domestic corporation structured 60% Filipino / 40% Firma. That corporation purchases and holds the Transfer Certificate of Title (TCT).\n\n════════════════════════════════════\nTHE TWO CORPORATIONS FIRMA NEEDS\n════════════════════════════════════\n\nCORP #1 — AFAB LOCATOR ENTITY\n• Purpose: Run Firma operations, hold AFAB Certificate, activate tax benefits\n• Ownership: Can be majority foreign-owned\n• Tax benefits: Yes — 0% ITH, then 5% GIT\n• Holds land title: No\n\nCORP #2 — LAND-HOLDING CORPORATION\n• Purpose: Hold the TCT (land title) only\n• Ownership: 60% Filipino / 40% Firma\n• Tax benefits: No — standard Philippine corporate tax\n• Holds land title: Yes\n\nThese are two separate legal entities. Corp #1 operates on the land. Corp #2 owns the land. Neither function can be combined without violating constitutional restrictions.\n\n════════════════════════════════════\nPROTECTING FIRMA'S CONTROL\n════════════════════════════════════\n\nHolding only 40% in Corp #2 does not mean losing control — if the right legal instruments are in place BEFORE any land purchase.\n\n• Shareholder Agreement — Board control, voting rights, buyout provisions, exit rights, drag-along and tag-along clauses\n• Usufruct Agreement — Firma's right to use and develop the land regardless of who holds the title\n• Management Contract — Firma manages all operations conducted on the land\n• Right of First Refusal — Firma buys out Filipino shareholders first if they exit\n\nCRITICAL: The shareholder agreement must be executed before any land purchase — not after.\n\n════════════════════════════════════\nLAND PURCHASE PROCESS\n════════════════════════════════════\n\n1. Incorporate Corp #2 — SEC registration of 60/40 domestic corp; formalize Filipino shareholders; execute shareholder agreement. Duration: 2–4 months\n\n2. Land identification — Find parcel in Dinalupihan — right size, proximity to FAB zone, willing seller. Duration: 2–6 months\n\n3. Title due diligence — Verify clean TCT; check liens, DAR clearance if agricultural land, confirm zonal classification. Duration: 1–3 months\n\n4. Negotiation + Deed of Sale — Agree price; draft and notarize Deed of Absolute Sale with Corp #2 as named buyer. Duration: 1–3 months\n\n5. BIR clearance + taxes — Pay Capital Gains Tax (6%) and Documentary Stamp Tax; secure BIR Certificate Authorizing Registration (CAR). Duration: 1–4 months\n\n6. Registry of Deeds — Submit BIR CAR + Deed of Sale; new TCT issued in Corp #2's name. Duration: 2–6 months\n\n7. LGU transfer tax — Pay municipal transfer tax; update Tax Declaration at the Assessor's Office. Duration: 1–2 months\n\n════════════════════════════════════\nREALISTIC TIMELINE\n════════════════════════════════════\n\nBest case: 10–14 months\nRealistic: 14–18 months\nSlow / complications: 20–28 months\n\nSteps 1–4 can partially overlap. Steps 5–7 are strictly sequential after the Deed of Sale is executed.\n\n════════════════════════════════════\nTRANSACTION COSTS (~9–10% on top of land price)\n════════════════════════════════════\n\nCapital Gains Tax: 6% of sale price or BIR zonal value (whichever is higher)\nDocumentary Stamp Tax: 1.5%\nRegistration fee: ~0.25%\nTransfer tax: 0.5–0.75%\nNotarial fee: ~1%\nLegal fees: Negotiated\nTotal over land price: ~9–10%`
  },
  {
    id: 'afab-vs-sbfz',
    title: 'AFAB vs. SBFZ',
    section: 'Regulatory',
    badge: 'Regulatory',
    subtitle: 'Locator Comparison — Two Complementary Zones',
    description: 'Freeport Area of Bataan (RA 11453) · Subic Bay Freeport Zone (RA 7227)',
    content: `AFAB vs. SBFZ — LOCATOR COMPARISON\nThese two zones are NOT competitors for Firma — they are complementary. AFAB is the sovereign build environment; SBFZ is the logistics and international gateway.\n\n════════════════════════════════════\nCOMPARISON TABLE\n════════════════════════════════════\n\nGoverning Law\n  AFAB: RA 11453\n  SBFZ: RA 7227\n\nZone Authority\n  AFAB: AFAB Board\n  SBFZ: SBMA\n\nLocator Certificate\n  AFAB: Certificate of Registration\n  SBFZ: CRTE (Certificate of Registration and Tax Exemption)\n\nBlockchain / AI Authorization\n  AFAB: Explicitly authorized under RA 11453\n  SBFZ: Grey area — no explicit coverage\n\nIncome Tax — Years 1–8\n  AFAB: 0% (Income Tax Holiday)\n  SBFZ: 5% GIT from day one\n\nIncome Tax — After Holiday\n  AFAB: 5% GIT\n  SBFZ: 5% GIT (no change)\n\nImport Duties: Both = 0%\nVAT: Both = Exempt\nLocal Business Tax: Both = Exempt\n\nLand Purchase\n  AFAB: Yes — via 60/40 Philippine domestic corp\n  SBFZ: No — SBMA owns all land (lease only)\n\nOwn Zone Pathway\n  AFAB: Yes — FAB Extension via Presidential Proclamation\n  SBFZ: No equivalent\n\nPort Access\n  AFAB: Mariveles port (small, Manila Bay)\n  SBFZ: Deep-water port — 13.7m draft, 600K TEU capacity\n\nAirport\n  AFAB: None nearby\n  SBFZ: International airport — 2,745m runway, FBO access\n\nDistance from Dinalupihan\n  AFAB: ~45 min south\n  SBFZ: ~35 min west via SCTEx\n\nPrimary Role for Sovereign Build\n  AFAB: ✅ Operations, own zone, Settlemint anchor\n  SBFZ: Logistics gateway, hardware imports, international arrivals\n\n════════════════════════════════════\nKEY DIFFERENTIATORS\n════════════════════════════════════\n\nAFAB'S STRUCTURAL EDGE: Income Tax Holiday — zero income tax for up to 8 years from the Certificate of Registration date, reverting to 5% GIT thereafter. For a capital-intensive early-stage build like Firma's, that ITH period is the single most significant financial advantage in the comparison.\n\nSBFZ'S STRUCTURAL EDGE: Infrastructure depth — a 600K TEU deep-water port and an international-capable runway in the same perimeter is a combination no other Philippine economic zone replicates. For duty-free import of Bitcoin mining hardware, EDGE compute nodes, and ModPod fabrication equipment at scale, the Subic port is the superior receiving point.\n\nOWN-ZONE PLAY EXISTS ONLY IN AFAB: The FAB Extension pathway — AFAB Board approval → Presidential Proclamation — has no SBFZ equivalent. SBMA owns all land and operates all zones; there is no mechanism for a locator to become a zone operator within SBFZ. This makes AFAB the only viable Settlemint territory anchor of the two.\n\n════════════════════════════════════\nDUAL-ZONE STRATEGY\n════════════════════════════════════\n\nFirma can operate a dual-zone registration:\n• AFAB virtual office for blockchain/fintech licensing (FAB)\n• SBFZ locator entity for tech-industry operations\n\nThis gives Firma a legally compliant, incentivized structure across both freeports simultaneously.`
  },
  {
    id: 'fab-sbfz-priorities',
    title: 'FAB & SBFZ: PRIORITIES',
    section: 'Regulatory',
    badge: 'Strategy',
    subtitle: "How Firma's Sovereign Layer Can Align",
    description: 'FAB/AFAB and SBFZ/SBMA strategic priorities 2025–2026 + Bataan LGU alignment',
    content: `FAB (FREEPORT AREA OF BATAAN) — CURRENT PRIORITIES 2025–2026\nManaged by AFAB (Authority of the Freeport Area of Bataan)\n\nA. DIGITAL & BLOCKCHAIN HUB EXPANSION\n• AFAB launched the first-ever Virtual Office for Fintech, Blockchain, and Digital-Based Enterprises (Oct 2025) — allowing firms to register and operate legally without needing a physical office\n• Under RA 11453, AFAB is the only investment promotion agency in the Philippines legally empowered to license blockchain, fintech, and emerging tech enterprises\n• AFAB actively scouted investments at the Singapore FinTech Festival 2025 and joined the Global Emerging Tech Summit (GETS) 2025 in Balanga City\n\nB. INDUSTRIAL & TERRITORIAL EXPANSION\n• Expanding FAB Expansion Areas (FEAs) province-wide — 17+ FEAs across Bataan municipalities under RA 11453\n• Samal Economic Zone was newly declared (March 2025) — over 275,000 sqm of industrial expansion land\n• Named Asia-Pacific Industrial Zone of the Year by fDi Intelligence in 2025\n\nC. INVESTOR FACILITATION & TAX INCENTIVES\n• 5% gross income tax scheme for registered locators\n• Streamlined one-stop registration processes\n• Attraction of sectors: traditional industry, fintech, blockchain, AI, BPO\n\n────────────────────────────────────\nSBFZ (SUBIC BAY FREEPORT ZONE) — CURRENT PRIORITIES 2025–2026\nManaged by SBMA (Subic Bay Metropolitan Authority)\n────────────────────────────────────\n\nA. GREEN PORT CITY & CARBON NEUTRALITY\n• Vision: Become the country's first carbon-neutral port and lead in green tourism by 2030\n• 12-pronged sustainability program including carbon neutral framework, EV adoption, energy efficiency, shore power systems\n• Shore Power Connection project: Phase 1 at New Container Terminal (2025), Phase 2 at Naval Supply Depot (2026–2027)\n\nB. REGIONAL CRUISE & TRADE HUB\n• Developing a dedicated cruise terminal for regional cruise industry\n• Sister port agreements with Port of San Diego, Osaka Port\n• ₱600 billion in investments secured in 2025\n\nC. DIGITAL INFRASTRUCTURE & TECH SECTOR\n• Expansion of digital infrastructure to support growing tech sector\n• Port modernization, digitalization, sustainability\n\n════════════════════════════════════\nHOW FIRMA'S SOVEREIGN LAYER CAN ALIGN\n════════════════════════════════════\n\nALIGNMENT WITH FAB/AFAB:\n• Firma can register as an AFAB Virtual Office locator — gaining legal blockchain operating status under RA 11453 without needing a physical office in Mariveles\n• Firma's Web3 operations, token/community infrastructure, and digital asset activities can be structured under FAB's fintech license pathway\n• As FAB expands into Samal, Hermosa, and other municipalities, Firma's presence can grow with it\n• Firma's community-building and grassroots education model aligns with AFAB's inclusive innovation mandate\n\nALIGNMENT WITH SBFZ/SBMA:\n• Firma can position as a partner in SBFZ's sustainable/green industries hub\n• Firma's digital governance tools can serve as models for SBMA's digitalization push\n• Firma's international network can bring investor attention to SBFZ alongside SBMA's cruise and trade expansion\n\n════════════════════════════════════\nBATAAN LGU GAPS FIRMA CAN SOLVE\n════════════════════════════════════\n\nBataan has 1 city and 11 municipalities: Balanga City (Capital), Mariveles, Hermosa, Orani, Samal, Abucay, Orion, Limay, Morong, Dinalupihan, Bagac, Pilar.\n\nA. DIGITAL GOVERNANCE GAPS\n• Bataan is rolling out BIMS (Barangay Information Management System) province-wide but many municipalities still face digital capacity gaps\n• Firma can provide: Web3-based governance tools, digital identity systems, transparent fund tracking\n\nB. FLOODING & INFRASTRUCTURE (1st District)\n• Hermosa, Orani, Samal, Abucay urgently need disaster-resilient infrastructure planning\n• Firma can provide: GIS/mapping data layers, community reporting platforms, participatory urban planning tools\n\nC. FARMERS & FISHERFOLK EMPOWERMENT\n• Bataan designated Farmers' and Fisherfolk's Week (SP Ordinance 09, 2025)\n• Firma can provide: Supply chain transparency tools, cooperative tokenization, direct market access platforms\n\nD. SMART CITY & E-GOVERNANCE\n• Balanga City targets becoming a smart university town and global tech center by 2030\n• Firma can provide: Modular digital service infrastructure, open-source civic tools, Web3-enabled transparency dashboards\n\nE. COASTAL ZONE MANAGEMENT\n• Ordinance No. 03 S. 2025 designating Local Coastal Greenbelt Zones covers 9 municipalities\n• Firma can provide: Environmental data platforms, coastal monitoring dashboards, ESG reporting tools\n\n════════════════════════════════════\nSTRATEGIC ENTRY POINTS SUMMARY\n════════════════════════════════════\n\nAFAB/FAB: Register as Virtual Office Fintech/Blockchain Locator under RA 11453\nSBFZ/SBMA: Position in Green Tech / Digital Infrastructure sectors\nProvince of Bataan: Provide digital governance, agri-tech, mapping, civic platforms\nSovereign Narrative: Firma as Web3-native infrastructure layer bridging freeport investment zones and local community needs — a sovereign builder, not just a tenant`
  }
]

const FONT_FAMILIES = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Inter', 'Fraunces']
const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
const TEXT_STYLES = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3']

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'planner', label: 'Planner' },
  { key: 'notes', label: 'Documents' },
  { key: 'email', label: 'Email' },
  { key: 'atlas', label: 'Architecture Index' },
]

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')

  // Tasks
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [newTask, setNewTask] = useState({ title: '', category: '', priority: 'medium', assignee: '', date: '', status: 'backlog' })

  // Documents
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [docTitle, setDocTitle] = useState('')
  const [docSearch, setDocSearch] = useState('')
  const editorRef = useRef(null)

  // Email
  const [emailForm, setEmailForm] = useState({ senderId: 'gmail-1', to: '', subject: '', body: '' })
  const [emailSent, setEmailSent] = useState(false)
  const [emailLog, setEmailLog] = useState([])
  const [senderProfiles, setSenderProfiles] = useState([
    { id: 'gmail-1', name: 'Gmail', email: '', provider: 'gmail' },
    { id: 'outlook-1', name: 'Outlook', email: '', provider: 'outlook' },
  ])
  const [showAddSender, setShowAddSender] = useState(false)
  const [newSender, setNewSender] = useState({ name: '', email: '', provider: 'gmail' })

  // Architecture Atlas
  const [archDocs, setArchDocs] = useState(INITIAL_ARCH_DOCS)
  const [selectedAtlasDoc, setSelectedAtlasDoc] = useState(null)
  const [atlasSearch, setAtlasSearch] = useState('')
  const [showAddAtlas, setShowAddAtlas] = useState(false)
  const [newAtlasDoc, setNewAtlasDoc] = useState({ title: '', section: '', badge: '', subtitle: '', content: '' })

  // Computed
  const backlogTasks = tasks.filter(t => t.status === 'backlog')
  const inprogressTasks = tasks.filter(t => t.status === 'inprogress')
  const reviewTasks = tasks.filter(t => t.status === 'review')
  const doneTasks = tasks.filter(t => t.status === 'done')
  const completionRate = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0
  const overdueTasks = tasks.filter(t => t.date && new Date(t.date) < new Date() && t.status !== 'done')
  const upcomingTasks = [...inprogressTasks, ...reviewTasks, ...backlogTasks]
    .filter(t => t.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

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

  // Task actions
  const addTask = () => {
    if (!newTask.title) return
    setTasks([...tasks, { ...newTask, id: Date.now() }])
    setNewTask({ title: '', category: '', priority: 'medium', assignee: '', date: '', status: 'backlog' })
  }
  const removeTask = id => setTasks(tasks.filter(t => t.id !== id))
  const moveTask = (id, status) => setTasks(tasks.map(t => t.id === id ? { ...t, status } : t))

  // Document actions
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
    if (selectedDocument?.id === id) {
      setSelectedDocument(null)
      setDocTitle('')
      if (editorRef.current) editorRef.current.innerHTML = ''
    }
  }
  const selectDocument = doc => {
    if (selectedDocument && editorRef.current) {
      updateDocument(selectedDocument.id, { title: docTitle, htmlContent: editorRef.current.innerHTML })
    }
    setSelectedDocument(doc)
    setDocTitle(doc.title)
    if (editorRef.current) editorRef.current.innerHTML = doc.htmlContent || ''
  }
  const handleEditorInput = () => {
    if (selectedDocument && editorRef.current) {
      updateDocument(selectedDocument.id, { title: docTitle, htmlContent: editorRef.current.innerHTML })
    }
  }
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }
  const handleStyleChange = e => {
    const s = e.target.value
    if (s === 'Normal') execCmd('formatBlock', 'p')
    else if (s === 'Heading 1') execCmd('formatBlock', 'h1')
    else if (s === 'Heading 2') execCmd('formatBlock', 'h2')
    else if (s === 'Heading 3') execCmd('formatBlock', 'h3')
  }

  // Email actions
  const sendEmail = () => {
    if (!emailForm.to || !emailForm.subject) return
    const { to, subject, body } = emailForm
    if (selectedSender?.provider === 'gmail') {
      window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    } else {
      window.open(`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    }
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

  // Atlas actions
  const addAtlasDoc = () => {
    if (!newAtlasDoc.title || !newAtlasDoc.section) return
    setArchDocs(d => [...d, { ...newAtlasDoc, id: `custom-${Date.now()}` }])
    setNewAtlasDoc({ title: '', section: '', badge: '', subtitle: '', content: '' })
    setShowAddAtlas(false)
  }

  const KANBAN_COLS = [
    { key: 'backlog', label: 'BACKLOG', tasks: backlogTasks, color: '#888', next: 'inprogress', nextLabel: 'Start' },
    { key: 'inprogress', label: 'IN PROGRESS', tasks: inprogressTasks, color: '#84A7F7', next: 'review', nextLabel: 'Review' },
    { key: 'review', label: 'REVIEW', tasks: reviewTasks, color: '#FF855C', next: 'done', nextLabel: 'Approve' },
    { key: 'done', label: 'DONE', tasks: doneTasks, color: '#5CB85C', next: null },
  ]
  const prevStatus = { inprogress: 'backlog', review: 'inprogress', done: 'review' }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-eyebrow">FIRMA · WORKSPACE</div>
          <h2 className="brand-name">Nation of <em>Heaven</em></h2>
          <div className="brand-meta">March 2026 · Canonical</div>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map(({ key, label }) => (
            <button key={key} className={`nav-btn ${activeNav === key ? 'active' : ''}`} onClick={() => setActiveNav(key)}>
              <span className="nav-label">{label}</span>
              {activeNav === key && <span className="nav-chevron">›</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">FIRMA SOVEREIGN FOUNDATION</div>
      </div>

      {/* MAIN */}
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
                  <button className="dash-link" onClick={() => setActiveNav('notes')}>OPEN →</button>
                </div>
                {documents.slice(0, 3).map(doc => (
                  <div key={doc.id} className="recent-doc-row" onClick={() => { setActiveNav('notes'); setTimeout(() => selectDocument(doc), 50) }}>
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
                <button className="dash-link" onClick={() => setActiveNav('planner')}>PLANNER →</button>
              </div>
              {upcomingTasks.length === 0 ? <div className="empty">No upcoming tasks</div> : upcomingTasks.map(t => (
                <div key={t.id} className="upcoming-row">
                  <div className="upcoming-dot" />
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
              <input className="input" placeholder="Category (e.g. STRATEGY)" value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })} />
              <input className="input" placeholder="Assignee (e.g. @Karl)" value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} />
              <input className="input" type="date" value={newTask.date} onChange={e => setNewTask({ ...newTask, date: e.target.value })} />
              <select className="input" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select className="input" value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>
                <option value="backlog">Backlog</option>
                <option value="inprogress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
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
                        <div className="kanban-card-meta">
                          {t.assignee && <span>{t.assignee}</span>}
                          {t.date && <span>· {t.date}</span>}
                        </div>
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
                {documents
                  .filter(d => docSearch === '' || d.title.toLowerCase().includes(docSearch.toLowerCase()))
                  .map(doc => (
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
                  <input
                    className="docs-title-input"
                    value={docTitle}
                    onChange={e => { setDocTitle(e.target.value); updateDocument(selectedDocument.id, { title: e.target.value, htmlContent: editorRef.current?.innerHTML || '' }) }}
                    placeholder="Document title"
                  />
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
                      <select className="toolbar-select" onChange={handleStyleChange}>
                        {TEXT_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select className="toolbar-select" onChange={e => execCmd('fontName', e.target.value)}>
                        {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                      <select className="toolbar-select" onChange={e => execCmd('fontSize', e.target.value.replace('px', ''))}>
                        {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <span className="docs-toolbar-hint">SELECT TEXT, THEN FORMAT</span>
                  </div>
                  <div
                    ref={editorRef}
                    className="docs-rich-content rich-editor-content"
                    contentEditable
                    onInput={handleEditorInput}
                    suppressContentEditableWarning
                  />
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
                    {senderProfiles.map(s => (
                      <option key={s.id} value={s.id}>{s.name}{s.email ? ` — ${s.email}` : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="email-field-label">TO</div>
                <input className="input" placeholder="recipient@example.com" value={emailForm.to} onChange={e => setEmailForm({ ...emailForm, to: e.target.value })} />
                <div className="email-field-label">SUBJECT</div>
                <input className="input" placeholder="Subject line" value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} />
                <div className="email-field-label">MESSAGE</div>
                <textarea className="textarea" placeholder="Write your message..." value={emailForm.body} onChange={e => setEmailForm({ ...emailForm, body: e.target.value })} />
                <button className="btn-primary" onClick={sendEmail}>
                  Send via {selectedSender?.provider === 'gmail' ? 'Gmail' : 'Outlook'}
                </button>
                {emailSent && <div className="success-msg">Email client opened!</div>}
              </div>

              <div className="email-sidebar-panel">
                <div className="email-accounts-card">
                  <div className="email-panel-hdr">Sender Accounts</div>
                  {senderProfiles.map(s => (
                    <div key={s.id} className={`email-account-item ${emailForm.senderId === s.id ? 'active' : ''}`} onClick={() => setEmailForm({ ...emailForm, senderId: s.id })}>
                      <div className={`email-account-icon ${s.provider}`}>{s.provider === 'gmail' ? 'G' : 'O'}</div>
                      <div>
                        <div className="email-account-name">{s.name}</div>
                        <div className="email-account-addr">{s.email || 'No email set'}</div>
                      </div>
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
                    <option value="gmail">Gmail</option>
                    <option value="outlook">Outlook</option>
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
                    <div key={doc.id} className="atlas-card" onClick={() => setSelectedAtlasDoc(doc)}>
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
                <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                  <div className="modal-title">Add New Document to Atlas</div>
                  <input className="input" placeholder="Title" value={newAtlasDoc.title} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, title: e.target.value })} />
                  <input className="input" placeholder="Section (e.g. Foundation, Events, Legal)" value={newAtlasDoc.section} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, section: e.target.value })} />
                  <input className="input" placeholder="Badge (e.g. Framework, Strategy)" value={newAtlasDoc.badge} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, badge: e.target.value })} />
                  <input className="input" placeholder="Subtitle" value={newAtlasDoc.subtitle} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, subtitle: e.target.value })} />
                  <textarea className="textarea" style={{ minHeight: 160 }} placeholder="Content..." value={newAtlasDoc.content} onChange={e => setNewAtlasDoc({ ...newAtlasDoc, content: e.target.value })} />
                  <div className="modal-actions">
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
            <button className="btn-back" onClick={() => setSelectedAtlasDoc(null)}>← Back to Atlas</button>
            <div className="atlas-badge" style={{ display: 'inline-block', marginBottom: 16 }}>{selectedAtlasDoc.badge}</div>
            <h1 className="page-title" style={{ marginBottom: 8 }}>{selectedAtlasDoc.title}</h1>
            {selectedAtlasDoc.subtitle && <div className="page-desc" style={{ marginBottom: 4 }}>{selectedAtlasDoc.subtitle}</div>}
            {selectedAtlasDoc.description && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#aaa', marginBottom: 24 }}>{selectedAtlasDoc.description}</div>}
            <div style={{ borderTop: '1px solid rgba(255,133,92,0.15)', marginBottom: 32 }} />
            <div className="atlas-doc-content">{selectedAtlasDoc.content}</div>
          </div>
        )}

      </main>
    </div>
  )
}
