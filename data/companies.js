/*
  Exhibitors, by year.
  -------------------------------------------------------------------------------------
  - PHIRED_EXHIBITORS[2027]: the 2027 tab on companies.html. Add companies here as they confirm.
  - PHIRED_EXHIBITORS[2026]: the 2026 tab, and the "2026 exhibitors" wall on the front page.

  To add an exhibitor, copy one { ... } block (keep the comma between blocks).
  - sponsor: "Silver sponsor", "Bronze sponsor" ... or "" for none. Sponsors are listed first.
  - type:    short label such as Company, Start-up, Research institute, Funder, Public agency.
  - areas:   tags used for the filter buttons. Reuse existing spellings so filters stay short.
  - logo:    optional, e.g. "images/exhibitors/abb.svg". Without it, the name (or initials) is shown.
  - short:   optional shorter name for the front-page logo ticker.
  - Any text field can be left "" and is then hidden.
*/
window.PHIRED_EXHIBITORS = {};

/* 2027: empty until the first exhibitors confirm. The tab then shows a short "coming soon" note. */
window.PHIRED_EXHIBITORS[2027] = [
];

/* 2026 line-up */
window.PHIRED_EXHIBITORS[2026] = [
  {
    name: "FOI",
    logo: "images/exhibitors/foi.png",
    sponsor: "Silver sponsor",
    type: "Government research agency",
    areas: ["Defence and security", "AI and data", "Physics and electronics"],
    oneLiner: "The Swedish Defence Research Agency: research supporting Sweden's military and civil defence.",
    about: "Research from basic natural science to technology: physics, electronics, chemistry and materials, plus marine technology, cybersecurity, AI, signal processing and space. Also defence economics and security policy.",
    meet: "",
    lookingFor: "FOI is growing and hiring PhDs in several fields, with paths to deepen your research, broaden it or move into project management.",
    links: { website: "https://www.foi.se/en/foi.html", linkedin: "https://www.linkedin.com/company/foi/" }
  },
  {
    name: "Westinghouse",
    logo: "images/exhibitors/westinghouse.svg",
    sponsor: "Silver sponsor",
    type: "Company",
    areas: ["Energy and nuclear"],
    oneLiner: "Nuclear technology: reactors, fuel, services and decommissioning.",
    about: "From the AP1000 reactor and AP300 small modular reactor to the eVinci microreactor. About 11,000 employees in over 20 countries, around 1,200 of them in Sweden, including a fuel fabrication plant.",
    meet: "",
    lookingFor: "",
    links: { website: "", linkedin: "https://www.linkedin.com/company/westinghouse-electric-company/" }
  },
  {
    name: "Siemens Energy",
    logo: "images/exhibitors/siemens-energy.svg",
    sponsor: "Bronze sponsor",
    type: "Company",
    areas: ["Energy and nuclear", "Industry and manufacturing"],
    oneLiner: "Energy technology across generation, grids, storage and industrial electrification.",
    about: "About 100,000 employees worldwide. In Sweden: Finspång, Trollhättan, Karlstad, Västerås, Örebro, Solna, Sundsvall and Malmö.",
    meet: "",
    lookingFor: "Roles in technology, manufacturing, project management, IT, field service and more.",
    links: { website: "", linkedin: "https://www.linkedin.com/company/siemens-energy/" }
  },
  {
    name: "ABB",
    logo: "images/exhibitors/abb.svg",
    type: "Company",
    areas: ["Energy and nuclear", "Industry and manufacturing"],
    oneLiner: "Electrification and automation technology.",
    links: { linkedin: "https://www.linkedin.com/company/abb/" }
  },
  {
    name: "Alstom",
    logo: "images/exhibitors/alstom.svg",
    type: "Company",
    areas: ["Industry and manufacturing"],
    oneLiner: "Rail transport: trains, signalling and services.",
    links: { linkedin: "https://www.linkedin.com/company/alstom/" }
  },
  {
    name: "Blykalla",
    logo: "images/exhibitors/blykalla.png",
    type: "Start-up",
    areas: ["Energy and nuclear", "Materials and metals"],
    oneLiner: "Developing SEALER, a compact lead-cooled nuclear reactor, from KTH research.",
    about: "Built on more than 25 years of research at KTH, where the founders solved the corrosion challenges of lead-cooled reactors. The 55 MW SEALER uses corrosion-tolerant steels to deliver safe, high-temperature clean energy for AI infrastructure and electrified industry.",
    links: { linkedin: "https://www.linkedin.com/company/blykalla/" }
  },
  {
    name: "BrainZell",
    logo: "images/exhibitors/brainzell.png",
    type: "Start-up",
    areas: ["Life science", "AI and data"],
    oneLiner: "Human brain models from patient-derived stem cells, for drug discovery.",
    about: "Combines stem-cell brain models with AI-driven computational modelling, high-content imaging and functional readouts, turning complex biological data into targets for treating neurological disorders.",
    links: { linkedin: "https://www.linkedin.com/company/brainzell/" }
  },
  {
    name: "COMSOL",
    logo: "images/exhibitors/comsol.svg",
    type: "Company",
    areas: ["Simulation and software"],
    oneLiner: "Multiphysics modelling and simulation software, founded in 1986 by two KTH students.",
    about: "Development centre in central Stockholm. Teams work on algorithms and applied maths, numerical analysis, high-performance computing, distributed systems, graphics and visualisation, user interfaces and many physics disciplines, in Java, C++ and C#.",
    links: { linkedin: "https://www.linkedin.com/company/comsol-inc-/" }
  },
  {
    name: "Electrolux Group",
    logo: "images/exhibitors/electrolux.svg",
    type: "Company",
    areas: ["Industry and manufacturing"],
    oneLiner: "Home appliances sold in about 120 markets under Electrolux, AEG and Frigidaire.",
    about: "More than 100 years of appliances for cooking, care and wellbeing, with a focus on sustainability. About 41,000 employees.",
    links: { website: "https://www.electroluxgroup.com", linkedin: "https://www.linkedin.com/company/electroluxgroup/" }
  },
  {
    name: "Ericsson",
    logo: "images/exhibitors/ericsson.svg",
    type: "Company",
    areas: ["Telecom and networks"],
    oneLiner: "Communications technology and mobile networks.",
    about: "Cross-disciplinary teams collaborating across borders and continents on technology for people, industries and society.",
    links: { linkedin: "https://www.linkedin.com/company/ericsson/" }
  },
  {
    name: "EURES Sweden, Arbetsförmedlingen",
    logo: "images/exhibitors/eures.png",
    short: "EURES Sweden",
    type: "Public agency",
    areas: ["Careers and mobility"],
    oneLiner: "Free help to find work across the EU/EEA and Switzerland.",
    about: "Part of the European EURES network for over 30 years, with more than 30 advisers across Sweden. Guidance from job searching to living and working conditions abroad.",
    links: { linkedin: "https://www.linkedin.com/company/arbetsformedlingen/" }
  },
  {
    name: "Huawei Sweden R&D",
    logo: "images/exhibitors/huawei.png",
    short: "Huawei R&D",
    type: "Company",
    areas: ["Telecom and networks"],
    oneLiner: "5G and beyond: standardisation, research and pre-development.",
    about: "Huawei's first overseas R&D office, opened in 2000. More than 200 R&D engineers in Stockholm, Gothenburg and Lund.",
    links: { linkedin: "https://www.linkedin.com/company/huawei-sweden-r-d/" }
  },
  {
    name: "KTH Career",
    logo: "images/exhibitors/kth.png",
    type: "KTH",
    areas: ["Careers and mobility"],
    oneLiner: "Career support for KTH students and researchers.",
    links: { website: "https://www.kth.se/en" }
  },
  {
    name: "KTH Innovation",
    logo: "images/exhibitors/kth-innovation.png",
    type: "KTH",
    areas: ["Innovation and start-ups", "Funding and grants"],
    oneLiner: "Helps researchers turn their research into start-ups, industry collaboration or societal impact.",
    about: "Tailored coaching, funding opportunities and access to KTH's innovation ecosystem, without compromising on academic excellence.",
    links: { linkedin: "https://www.linkedin.com/company/kth-innovation/" }
  },
  {
    name: "KTH Relocation and EURAXESS",
    logo: "images/exhibitors/euraxess.png",
    short: "KTH Relocation",
    type: "KTH",
    areas: ["Careers and mobility"],
    oneLiner: "Moving to, or within, Europe as a researcher.",
    about: "Part of EURAXESS, the European Commission's network for researcher mobility, career development, researchers' rights and vacancies. Also informs about Unite!, an alliance of nine European technical universities.",
    links: { linkedin: "https://www.linkedin.com/company/euraxess-sweden/" }
  },
  {
    name: "NKT",
    logo: "images/exhibitors/nkt.svg",
    type: "Company",
    areas: ["Energy and nuclear", "Industry and manufacturing"],
    oneLiner: "Low-, medium- and high-voltage power cables for the energy transition.",
    about: "Designing, manufacturing and installing power cables since 1891. Headquartered in Denmark, with more than 30 locations and about 6,000 employees.",
    links: { website: "https://www.nkt.com", linkedin: "https://www.linkedin.com/company/nkt-cables/" }
  },
  {
    name: "RISE",
    logo: "images/exhibitors/rise.svg",
    type: "Research institute",
    areas: ["Applied research"],
    oneLiner: "Research Institutes of Sweden: applied research with industry and the public sector.",
    links: { linkedin: "https://www.linkedin.com/company/rise-research-institutes-of-sweden/" }
  },
  {
    name: "SEI",
    logo: "images/exhibitors/sei.png",
    type: "Research institute",
    areas: ["Climate and environment"],
    oneLiner: "Stockholm Environment Institute: international non-profit research on climate, environment and sustainable development.",
    about: "Headquarters in Stockholm, with 150 staff from 35 countries, and centres in Asia, Africa, Europe and the Americas. Success is measured by real-world outcomes for sustainability and social equity.",
    links: { linkedin: "https://www.linkedin.com/company/stockholm-environment-institute/" }
  },
  {
    name: "SMHI",
    logo: "images/exhibitors/smhi.svg",
    type: "Public agency",
    areas: ["Climate and environment", "Simulation and software", "AI and data"],
    oneLiner: "Sweden's expert authority on weather, water and climate.",
    about: "Numerical weather models for the Nordic region, remote sensing, climate analysis and air quality. Strong focus on high-resolution simulation, data assimilation, digital twins and machine learning.",
    meet: "Researchers from SMHI's meteorological research and development group.",
    links: { linkedin: "https://www.linkedin.com/company/smhi/" }
  },
  {
    name: "SSF",
    logo: "images/exhibitors/ssf.png",
    type: "Funder",
    areas: ["Funding and grants"],
    oneLiner: "Swedish Foundation for Strategic Research: funding for science, technology and medicine.",
    about: "Funds nearly 300 university projects, many with industry. Career grants for younger research leaders, and support for mobility between academia, institutes and industry. Funding during and after your PhD.",
    links: { linkedin: "https://www.linkedin.com/company/stiftelsen-f%C3%B6r-strategisk-forskning-ssf/" }
  },
  {
    name: "Stegra",
    logo: "images/exhibitors/stegra.png",
    type: "Company",
    areas: ["Materials and metals", "Energy and nuclear"],
    oneLiner: "Green steel made with green hydrogen (formerly H2 Green Steel).",
    about: "Building an integrated green hydrogen, iron and steel plant in Boden, with offices in Boden and Stockholm and a target of close to 1,500 employees.",
    links: { linkedin: "https://www.linkedin.com/company/stegraab/" }
  },
  {
    name: "Studsvik",
    logo: "images/exhibitors/studsvik.png",
    type: "Company",
    areas: ["Energy and nuclear", "Materials and metals"],
    oneLiner: "Technical services for the nuclear power industry.",
    about: "Fuel and materials technology, reactor analysis software and treatment of radioactive waste. More than 75 years of experience and about 520 employees in seven countries.",
    links: { linkedin: "https://www.linkedin.com/company/studsvik/" }
  },
  {
    name: "Swerim",
    logo: "images/exhibitors/swerim.png",
    type: "Research institute",
    areas: ["Materials and metals"],
    oneLiner: "Metals research institute, from raw material to finished product.",
    about: "Needs-based industrial R&D towards a fossil-free and circular industry, within a national and international network of specialists.",
    links: { linkedin: "https://www.linkedin.com/company/swerim/" }
  },
  {
    name: "Switch to Sweden",
    logo: "images/exhibitors/switch-to-sweden.png",
    type: "National initiative",
    areas: ["Careers and mobility"],
    oneLiner: "Matches international talent already in Sweden with Swedish companies.",
    about: "Led by Linköping Science Park and Vinnova. Guidance on the Swedish job market, an AI-powered matching tool, networking forums and events.",
    links: { linkedin: "https://www.linkedin.com/company/linkoping-science-park/" }
  },
  {
    name: "Swedish Research Council",
    logo: "images/exhibitors/swedish-research-council.png",
    type: "Funder",
    areas: ["Funding and grants"],
    oneLiner: "Vetenskapsrådet: Sweden's largest government funder of research.",
    links: { linkedin: "https://www.linkedin.com/company/swedish-research-council/" }
  },
  {
    name: "Vattenfall",
    logo: "images/exhibitors/vattenfall.png",
    type: "Company",
    areas: ["Energy and nuclear"],
    oneLiner: "Energy company producing and selling electricity and heat.",
    links: { linkedin: "https://www.linkedin.com/company/vattenfall/" }
  },
  {
    name: "Venture Cup",
    logo: "images/exhibitors/venture-cup.png",
    type: "Start-up support",
    areas: ["Innovation and start-ups"],
    oneLiner: "Start-up competition and support for turning ideas into companies.",
    links: { linkedin: "https://www.linkedin.com/company/venture-cup-sweden/" }
  }
];
