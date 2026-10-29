/*
  Company profiles for companies.html (2027 exhibitors)
  ------------------------------------
  To add a company, copy one block { ... } and fill it in.
  - "example": true shows an "Example" label. Remove it (or set false) for real exhibitors.
  - "logo": path to an image in images/companies/ (e.g. "images/companies/acme.svg"), or "" to show initials.
  - Leave a link as "" to hide it.
  - "areas" become the filter buttons on the page, so reuse the same spelling across companies.
*/
window.PHIRED_COMPANIES = [
  {
    name: "Aurora Cell Systems",
    example: true,
    logo: "",
    location: "Västerås",
    booth: "A1",
    oneLiner: "Develops cathode materials and cell designs for longer-lasting batteries.",
    areas: ["Energy storage", "Electrochemistry", "Materials science"],
    about: "Our research group works on high-nickel cathodes, solid electrolytes and degradation modelling. Most projects run from lab-scale synthesis to pilot production, so researchers see their materials end up in real cells.",
    teams: "Two scientists from Materials R&D and one from Cell Modelling.",
    lookingFor: "PhDs in electrochemistry, inorganic chemistry, materials physics or multiphysics simulation.",
    positions: ["Research scientist", "Industrial postdoc", "Simulation engineer"],
    links: { website: "https://example.com", careers: "https://example.com", linkedin: "" }
  },
  {
    name: "Fjordline Biologics",
    example: true,
    logo: "",
    location: "Uppsala",
    booth: "A2",
    oneLiner: "Engineers proteins and antibodies for new biologic medicines.",
    areas: ["Biotechnology", "Protein engineering", "Analytical chemistry"],
    about: "We design and screen antibody candidates, then develop the analytical methods that prove they are safe and stable. Teams mix wet-lab biologists with computational protein designers.",
    teams: "A protein design lead and a scientist from Analytical Development.",
    lookingFor: "PhDs in biochemistry, structural biology, bioinformatics or mass spectrometry.",
    positions: ["Scientist, protein engineering", "Analytical scientist", "Computational biologist"],
    links: { website: "https://example.com", careers: "https://example.com", linkedin: "https://example.com" }
  },
  {
    name: "Kvantia Sensing",
    example: true,
    logo: "",
    location: "Gothenburg",
    booth: "B1",
    oneLiner: "Builds quantum and photonic sensors for navigation and medical imaging.",
    areas: ["Quantum technology", "Photonics", "Signal processing"],
    about: "A spin-off turning lab experiments with nitrogen-vacancy centres and integrated photonics into rugged sensors. Small team, short path from idea to prototype.",
    teams: "The CTO and an optical engineer.",
    lookingFor: "PhDs in quantum optics, photonics, condensed matter physics or embedded signal processing.",
    positions: ["Quantum hardware engineer", "Photonics engineer"],
    links: { website: "https://example.com", careers: "", linkedin: "https://example.com" }
  },
  {
    name: "Norrbro Steel R&D",
    example: true,
    logo: "",
    location: "Luleå",
    booth: "B2",
    oneLiner: "Researches fossil-free steelmaking using hydrogen instead of coal.",
    areas: ["Materials science", "Process modelling", "Sustainability"],
    about: "We study how iron ore behaves when reduced with hydrogen, and model the full process from pellet to finished steel to cut emissions at industrial scale.",
    teams: "Researchers from Process Metallurgy and Process Simulation.",
    lookingFor: "PhDs in metallurgy, chemical engineering, thermodynamics or CFD.",
    positions: ["Research engineer", "Process modelling specialist", "Industrial PhD supervisor roles"],
    links: { website: "https://example.com", careers: "https://example.com", linkedin: "" }
  },
  {
    name: "Ledvik Robotics",
    example: true,
    logo: "",
    location: "Stockholm",
    booth: "C1",
    oneLiner: "Makes autonomous mobile robots for warehouses and hospitals.",
    areas: ["Robotics", "Control theory", "Machine learning"],
    about: "Our robots plan routes among people in real time. Research covers motion planning, perception under poor lighting and learning from fleet data.",
    teams: "Two engineers from the Autonomy team.",
    lookingFor: "PhDs in robotics, control, computer vision or reinforcement learning.",
    positions: ["Autonomy engineer", "Perception researcher"],
    links: { website: "https://example.com", careers: "https://example.com", linkedin: "https://example.com" }
  },
  {
    name: "Klimatlabbet Analytics",
    example: true,
    logo: "",
    location: "Stockholm",
    booth: "C2",
    oneLiner: "Turns climate model output into flood and heat risk data for insurers and cities.",
    areas: ["Climate science", "Statistics", "Machine learning"],
    about: "We downscale global climate projections to street level and quantify the uncertainty, so clients can plan with numbers rather than headlines.",
    teams: "A climate scientist and a data science lead.",
    lookingFor: "PhDs in atmospheric science, hydrology, applied statistics or scientific computing.",
    positions: ["Climate risk scientist", "Data scientist"],
    links: { website: "https://example.com", careers: "", linkedin: "https://example.com" }
  }
];

/*
  Organisations at PhireD KTH 2026 (shown in the "Exhibitors 2026" wall).
  - type: "sponsor" shows them first with a "Sponsor" label.
  - logo: optional, e.g. "images/logos/abb.svg". Without it the name is shown as text.
*/
window.PHIRED_2026 = [
  { name: "FOI", type: "sponsor", url: "https://www.linkedin.com/company/foi/" },
  { name: "Westinghouse", type: "sponsor", url: "https://www.linkedin.com/company/westinghouse-electric-company/" },
  { name: "ABB", url: "https://www.linkedin.com/company/abb/" },
  { name: "Alstom", url: "https://www.linkedin.com/company/alstom/" },
  { name: "Blykalla", url: "https://www.linkedin.com/company/blykalla/" },
  { name: "BrainZell", url: "https://www.linkedin.com/company/brainzell/" },
  { name: "COMSOL", url: "https://www.linkedin.com/company/comsol-inc-/" },
  { name: "Electrolux Group", url: "https://www.linkedin.com/company/electroluxgroup/" },
  { name: "Ericsson", url: "https://www.linkedin.com/company/ericsson/" },
  { name: "EURAXESS Sweden", url: "https://www.linkedin.com/company/euraxess-sweden/" },
  { name: "EURES Sweden, Arbetsförmedlingen", url: "" },
  { name: "Huawei Sweden R&D", url: "https://www.linkedin.com/company/huawei-sweden-r-d/" },
  { name: "KTH Career", url: "" },
  { name: "KTH Innovation", url: "https://www.linkedin.com/company/kth-innovation/" },
  { name: "KTH Relocation", url: "" },
  { name: "NKT", url: "https://www.linkedin.com/company/nkt-cables/" },
  { name: "RISE", url: "https://www.linkedin.com/company/rise-research-institutes-of-sweden/" },
  { name: "SEI", url: "https://www.linkedin.com/company/stockholm-environment-institute/" },
  { name: "Siemens Energy", url: "https://www.linkedin.com/company/siemens-energy/" },
  { name: "SMHI", url: "https://www.linkedin.com/company/smhi/" },
  { name: "SSF", url: "" },
  { name: "Stegra", url: "https://www.linkedin.com/company/stegraab/" },
  { name: "Studsvik", url: "https://www.linkedin.com/company/studsvik/" },
  { name: "Swerim", url: "https://www.linkedin.com/company/swerim/" },
  { name: "Switch to Sweden", url: "https://www.linkedin.com/company/linkoping-science-park/" },
  { name: "Vattenfall", url: "https://www.linkedin.com/company/vattenfall/" },
  { name: "Venture Cup", url: "https://www.linkedin.com/company/venture-cup-sweden/" },
  { name: "Swedish Research Council", url: "https://www.linkedin.com/company/swedish-research-council/" }
];
