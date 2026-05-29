import React from "react";
import { useState } from "react";
import {
  CreditCard,
  ClipboardCheck,
  Truck,
  XCircle,
  Tag,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import "../genericPageStyles.scss";
import faqContentJson from "../../Content/faq.json";
import { parseContent } from "../../utils/parseContent";

interface FaqItem {
  q: string;
  a: string[];
  bullets?: string[];
  footer?: string[];
}

interface FaqSection {
  id: string;
  label: string;
  items: FaqItem[];
}

const faqContent = faqContentJson as FaqSection[];

const sectionIcons: Record<string, React.JSX.Element> = {
  payments: <CreditCard size={16} />,
  rentals: <ClipboardCheck size={16} />,
  delivery: <Truck size={16} />,
  cancellations: <XCircle size={16} />,
  sellers: <Tag size={16} />,
  safety: <ShieldCheck size={16} />,
  feedback: <MessageSquare size={16} />,
  general: <HelpCircle size={16} />,
};

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState(faqContent[0].id);
  const [openItem, setOpenItem] = useState<number | null>(0);

  const currentSection = faqContent.find((s) => s.id === activeTab)!;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setOpenItem(0);
  };

  return (
    <div className="wrapper">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>These are the most commonly asked questions about ASO WA.</p>
      </div>

      <div className="faq-tabs" role="tablist">
        {faqContent.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={activeTab === s.id}
            className={`faq-tab ${activeTab === s.id ? "active" : ""}`}
            onClick={() => handleTabChange(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="faq-accordion">
        {currentSection.items.map((item, i) => (
          <div
            key={i}
            className={`accordion-item ${openItem === i ? "open" : ""}`}
          >
            <button
              className="accordion-header"
              onClick={() => setOpenItem(openItem === i ? null : i)}
              aria-expanded={openItem === i}
            >
              <span className="acc-icon">
                {sectionIcons[currentSection.id]}
              </span>
              <span className="acc-title">{item.q}</span>
              <ChevronDown className="chevron" size={16} />
            </button>
            {openItem === i && (
              <div className="accordion-body">
                {item.a?.map((p, j) => (
                  <p key={j}>{parseContent(p)}</p>
                ))}
                {item.bullets && (
                  <ul>
                    {item.bullets.map((b, j) => (
                      <li key={j}>{parseContent(b)}</li>
                    ))}
                  </ul>
                )}
                {item.footer?.map((f, j) => (
                  <p key={j}>{parseContent(f)}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
