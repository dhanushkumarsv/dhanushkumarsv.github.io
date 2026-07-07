/* ============================================================
   Structured resume data for Dhanush Kumar S V
   Used by the portfolio UI and the resume chatbot.
   ============================================================ */

const RESUME = {
  name: "Dhanush Kumar S V",
  title: "Process Engineer",
  location: "Taichung, Taiwan",
  phone: "+886-0909505486",
  email: "dhanushkumar795@gmail.com",
  linkedin: "https://linkedin.com/in/dhanush-kumar-772274213",

  summary:
    "Process Engineer skilled in process simulation, optimization, and manufacturing improvement. " +
    "Experienced in using Aspen Plus, Aspen HYSYS, and MATLAB for modeling chemical and semiconductor processes. " +
    "Strong understanding of yield improvement, defect reduction, and process integration. " +
    "Dedicated to enhancing production efficiency and product quality through data-driven analysis and continuous improvement.",

  education: [
    {
      school: "National Chung Hsing University",
      place: "Taichung, Taiwan",
      degree: "M.S. in Chemical Engineering",
      years: "2024 – Present",
      gpa: "3.95 / 4.3"
    },
    {
      school: "Anna University",
      place: "Chennai, India",
      degree: "B.Tech in Chemical Engineering",
      years: "2019 – 2023",
      gpa: "7.84 / 10"
    }
  ],

  skills: {
    "Process Simulation": ["Aspen Plus", "Aspen HYSYS", "MATLAB", "GAMS", "Ansys (Fluent)"],
    "Process Integration": ["Electrochemical coating", "Surface process modeling", "Yield optimization"],
    "Data Analysis": ["Origin", "Excel", "ImageJ", "Python"],
    "Documentation": ["Process flow reports", "Design of experiments", "Technical writing"]
  },

  research: [
    {
      title: "Hybrid VMD–MED / MSF–MED Process Modeling for Phosphogypsum Wastewater Treatment",
      points: [
        "Modeled hybrid VMD–MED and MSF–MED systems for phosphogypsum wastewater purification using process simulation.",
        "Integrated microbial electrochemical cell (MEC) for enhanced phosphorus recovery and energy-efficient treatment.",
        "Performed process optimization and energy analysis to improve water recovery, phosphorus yield, and overall system efficiency."
      ],
      tags: ["Aspen Plus", "Desalination", "Energy Analysis", "MEC"]
    },
    {
      title: "MILP-Based Optimization of Cooperative Dairy Milk Supply Chain",
      points: [
        "Formulated a GAMS-based MILP model for integrated village–BMC–plant milk procurement under capacity, flow balance, and service constraints.",
        "Conducted sensitivity and scenario analyses on BMC capacity and penalty parameters to evaluate cost–service trade-offs.",
        "Achieved ~17% total cost reduction, up to ~30% decrease in unserved milk, and identified key capacity thresholds."
      ],
      tags: ["GAMS", "MILP", "Optimization", "Supply Chain"]
    },
    {
      title: "Hydrogen Production using the Photocatalytic Method",
      points: [
        "Designed and built a 4 L trapezoidal photocatalytic reactor for solar-driven hydrogen production from sulphuric wastewater.",
        "Achieved ~300 mL h⁻¹ L⁻¹ hydrogen production using TiO₂ photocatalyst under direct sunlight.",
        "Optimized catalyst loading and sulphide concentration to maximize hydrogen yield and process efficiency."
      ],
      tags: ["Green Hydrogen", "Photocatalysis", "Reactor Design", "TiO₂"]
    }
  ],

  internships: [
    {
      role: "University Teaching Assistant",
      org: "National Chung Hsing University, Taiwan",
      period: "Sep 2025 – Dec 2025",
      points: [
        "Guided students in process simulation using Aspen Plus, troubleshooting modeling and convergence issues.",
        "Supported design and optimization of chemical processes through hands-on simulation exercises.",
        "Assisted in teaching optimization concepts using GAMS, including constraints and objective functions.",
        "Developed structured problem-solving approaches for process design and analysis."
      ]
    },
    {
      role: "Quality Assurance Trainee",
      org: "Steel Authority of India Limited (SAIL), Salem",
      period: "Oct 2022 – Nov 2022",
      points: [
        "Analyzed production data from hot and cold rolling lines to identify factors affecting steel yield and quality.",
        "Investigated manufacturing defects and contributed to root cause analysis for process improvement."
      ]
    },
    {
      role: "CFD Research Intern",
      org: "Indian Institute of Technology, Indore",
      period: "Nov 2021 – Jan 2022",
      points: [
        "Performed computational fluid dynamics analysis for chemical processes, learning parameter optimization and reporting techniques."
      ]
    },
    {
      role: "Surface Coating Intern",
      org: "RK Metals",
      period: "Aug 2021",
      points: [
        "Studied electrochemical coating and metallization methods used in industrial surface treatment.",
        "Evaluated coating performance factors including thickness, adhesion, and corrosion resistance."
      ]
    }
  ],

  publications: [
    {
      title: "Location Selection and Purification Process Simulation for a Glycerol Plant",
      venue: "ICATES 2024"
    },
    {
      title: "Production of Hydrogen Gas Using Photo-catalytic Method",
      venue: "ICATS 2023"
    }
  ],

  languages: [
    { name: "English", level: "Fluent" },
    { name: "Chinese", level: "Basic" },
    { name: "Tamil", level: "Native" }
  ]
};
