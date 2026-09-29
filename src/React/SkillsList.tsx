import { useState } from "react";

const CategoryIcons = {
  "Data Science & ML": (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-brain-circuit text-[var(--sec)]"><path d="M9.5 2v2"/><path d="M14.5 2v2"/><path d="M16 5.5h-1.5"/><path d="M9.5 5.5H8"/><path d="M7.5 8.5a2.5 2.5 0 0 1 5 0v1.5a2.5 2.5 0 0 1-5 0Z"/><path d="M16.5 8.5a2.5 2.5 0 0 1 5 0v1.5a2.5 2.5 0 0 1-5 0Z"/><path d="M11 14h2"/><path d="M12 13v2"/><path d="M3 12.5a2.5 2.5 0 0 1 2.5-2.5h1.5"/><path d="M21 12.5a2.5 2.5 0 0 0-2.5-2.5h-1.5"/><path d="M8 19.5h8"/><path d="M10 16.5h4"/></svg>
  ),
  "Analytics & BI": (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bar-chart-3 text-[var(--sec)]"><path d="M3 3v18h18"/><path d="M7 15V9"/><path d="M12 15V5"/><path d="M17 15v-7"/></svg>
  ),
  "SaaS & Automation": (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-cpu text-[var(--sec)]"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/><path d="M5 9h-2"/><path d="M5 15h-2"/><path d="M19 9h2"/><path d="M19 15h2"/><path d="M9 5V3"/><path d="M15 5V3"/><path d="M9 21v-2"/><path d="M15 21v-2"/></svg>
  ),
};

const SkillsList = () => {
  const [openItem, setOpenItem] = useState<string | null>("Data Science & ML");

  const skills = {
    "Data Science & ML": [
      "Build predictive models for forecasting, classification, and decision support",
      "Design end-to-end ML pipelines from data cleaning to deployment and monitoring",
      "Apply computer vision and OCR to automate document-heavy workflows",
    ],
    "Analytics & BI": [
      "Create SQL-powered analysis and ETL workflows for business reporting",
      "Build executive dashboards in Power BI that turn metrics into actions",
      "Translate raw operational data into clear insights for performance improvement",
    ],
    "SaaS & Automation": [
      "Develop Flask-based products and internal tools that reduce manual work",
      "Design document intelligence systems for invoice extraction and process automation",
      "Ship scalable AI workflows that improve efficiency across business operations",
    ],
  };

  const toggleItem = (item: string) => {
    setOpenItem(openItem === item ? null : item);
  };

  return (
    <div className="text-left pt-3 md:pt-9 w-full max-w-[470px]">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[var(--sec)] text-xs font-medium uppercase tracking-[0.2em]">What I do</span>
        <span className="h-px flex-1 bg-gradient-to-r from-[var(--sec)]/60 to-transparent" />
      </div>

      <ul className="mt-2 space-y-4 text-lg">
        {Object.entries(skills).map(([category, items]) => (
          <li key={category} className="w-full">
            <button
              type="button"
              onClick={() => toggleItem(category)}
              className="w-full bg-[#1414149c] rounded-2xl text-left hover:bg-opacity-80 transition-all border border-[var(--white-icon-tr)] cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                {CategoryIcons[category as keyof typeof CategoryIcons]}
                <div className="flex items-center gap-2 flex-grow justify-between">
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <span className="block truncate text-[var(--white)] text-lg font-medium">
                      {category}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-6 h-6 text-[var(--white)] transform transition-transform flex-shrink-0 ${
                      openItem === category ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                  </svg>
                </div>
              </div>

              <div
                className={`transition-all duration-300 px-4 overflow-hidden ${
                  openItem === category
                    ? "max-h-[500px] pb-4 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <ul className="space-y-2 text-[var(--white-icon)] text-sm leading-relaxed">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 text-[var(--sec)]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsList;
