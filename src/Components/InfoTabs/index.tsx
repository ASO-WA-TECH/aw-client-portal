import { useState } from "react";
import { parseContent } from "../../utils/parseContent";
import "./index.scss";

export interface InfoTabItem {
  id: string;
  label: string;
  paragraphs?: string[];
  bullets?: string[];
  secondaryParagraphs?: string[];
}

interface InfoTabsProps {
  content: InfoTabItem[];
}

const InfoTabs = ({ content }: InfoTabsProps) => {
  const [activeTab, setActiveTab] = useState(content[0].id);
  const currentTab = content.find((t) => t.id === activeTab)!;

  return (
    <div className="info-tabs">
      <div className="info-tabs__nav" role="tablist">
        {content.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`info-tabs__nav__btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="info-tabs__content" role="tabpanel">
        {currentTab.paragraphs?.map((p, i) => (
          <p key={i}>{parseContent(p)}</p>
        ))}
        {currentTab.bullets && (
          <ul>
            {currentTab.bullets.map((b, i) => (
              <li key={i}>{parseContent(b)}</li>
            ))}
          </ul>
        )}
        {currentTab.secondaryParagraphs?.map((p, i) => (
          <p key={i}>{parseContent(p)}</p>
        ))}
      </div>
    </div>
  );
};

export default InfoTabs;
