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

const sections = [
  {
    id: "payments",
    label: "Payments",
    items: [
      {
        q: "Do you handle payments?",
        icon: "payments",
        a: (
          <p>
            No. ASO WA does not process or facilitate payments. All financial
            transactions take place directly between users outside of the
            platform.
          </p>
        ),
      },
      {
        q: "When should payments be made?",
        icon: "payments",
        a: (
          <p>
            We recommend that full rental payment is completed before the item
            is dispatched or collected. Payment timing must be clearly agreed in
            writing before any item is released. ASO WA does not enforce payment
            structures.
          </p>
        ),
      },
      {
        q: "What payment methods should I use?",
        icon: "payments",
        a: (
          <>
            <p>
              ASO WA does not process or facilitate payments. All financial
              transactions take place directly between users.
            </p>
            <p>
              We encourage users to choose secure, traceable payment methods
              that offer buyer and seller protection. Some users choose
              platforms such as PayPal ("Goods & Services") or similar
              third-party providers. Others may agree to bank transfers or
              digital payment services.
            </p>
            <ul>
              <li>Avoid cash payments where possible</li>
              <li>
                Avoid "Friends & Family" transfers when transacting with someone
                you do not know
              </li>
              <li>
                Keep written confirmation of agreed terms before making payment
              </li>
            </ul>
            <p>
              All payment arrangements are made at the users' own discretion and
              risk.
            </p>
          </>
        ),
      },
      {
        q: "Is ASO WA responsible if I am not paid?",
        icon: "payments",
        a: (
          <p>
            No. ASO WA is not involved in financial transactions and is not
            responsible for non-payment, fraud, or disputes.
          </p>
        ),
      },
      {
        q: "Will ASO WA introduce in-platform payments?",
        icon: "payments",
        a: (
          <p>
            We may explore integrated payment functionality in future versions
            of the platform. Any updates will be clearly communicated.
          </p>
        ),
      },
    ],
  },
  {
    id: "rentals",
    label: "Rentals & Deposits",
    items: [
      {
        q: "Should I take a security deposit?",
        icon: "rentals",
        a: (
          <>
            <p>
              Users may choose to request a refundable security deposit to cover
              damage, loss, or late return.
            </p>
            <p>
              Deposit amounts and terms should be clearly agreed in writing
              before payment. ASO WA does not hold or manage deposits.
            </p>
          </>
        ),
      },
      {
        q: "When should a deposit be returned?",
        icon: "rentals",
        a: (
          <>
            <p>
              Deposit return timing and conditions must be agreed before the
              rental begins.
            </p>
            <ul>
              <li>Expected condition on return</li>
              <li>Inspection timeframe</li>
              <li>Return deadline</li>
              <li>Refund timeline</li>
            </ul>
            <p>ASO WA does not enforce deposit returns.</p>
          </>
        ),
      },
      {
        q: "What if an item is returned damaged?",
        icon: "rentals",
        a: (
          <>
            <p>
              Condition expectations should be agreed before the transaction.
            </p>
            <ul>
              <li>Taking clear photos before dispatch</li>
              <li>Taking photos upon return</li>
              <li>Agreeing in writing how damage will be assessed</li>
            </ul>
            <p>
              Disputes must be resolved directly between users. ASO WA is not
              responsible for damage claims.
            </p>
          </>
        ),
      },
      {
        q: "What if an item is not returned?",
        icon: "rentals",
        a: (
          <p>
            Return dates and late terms should be agreed in writing before the
            rental begins. ASO WA does not enforce returns and is not
            responsible for non-return of items.
          </p>
        ),
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery & Collection",
    items: [
      {
        q: "Do you arrange delivery?",
        icon: "delivery",
        a: <p>No. Users must arrange delivery or collection directly.</p>,
      },
      {
        q: "How should I deliver an item?",
        icon: "delivery",
        a: (
          <>
            <p>
              Delivery arrangements are agreed between users. Common options
              include:
            </p>
            <ul>
              <li>Royal Mail</li>
              <li>Tracked parcel services</li>
              <li>Courier services</li>
              <li>Collection in a mutually agreed public location</li>
            </ul>
            <p>
              We recommend using tracked and insured services where appropriate.
              ASO WA does not manage or insure deliveries.
            </p>
          </>
        ),
      },
      {
        q: "What if an item is lost or damaged during delivery?",
        icon: "delivery",
        a: (
          <p>
            ASO WA is not responsible once the item leaves the lister's
            possession. Users should agree on responsibility and insurance
            before shipping.
          </p>
        ),
      },
    ],
  },
  {
    id: "cancellations",
    label: "Cancellations & Disputes",
    items: [
      {
        q: "What if I need to cancel?",
        icon: "cancellations",
        a: (
          <p>
            Cancellation terms must be agreed between users before payment. ASO
            WA does not issue refunds or manage cancellations.
          </p>
        ),
      },
      {
        q: "Does ASO WA mediate disputes?",
        icon: "cancellations",
        a: (
          <p>
            No. ASO WA provides a platform for connection but is not a party to
            transactions and does not mediate disputes.
          </p>
        ),
      },
    ],
  },
  {
    id: "sellers",
    label: "Sellers & Listings",
    items: [
      {
        q: "How do I create a strong listing?",
        icon: "sellers",
        a: (
          <>
            <ul>
              <li>Clear, well-lit images</li>
              <li>Front and back views</li>
              <li>Close-up fabric details</li>
              <li>
                Accurate sizing information (including corset measurements if
                needed)
              </li>
              <li>Details of alterations</li>
              <li>Condition (e.g. new, worn once, good condition, tailored)</li>
            </ul>
            <p>Clear listings reduce misunderstandings and improve trust.</p>
          </>
        ),
      },
      {
        q: "How should I price my item?",
        icon: "sellers",
        a: (
          <>
            <p>
              Pricing is at the seller's discretion. Consider the following:
            </p>
            <ul>
              <li>Original purchase price</li>
              <li>Condition</li>
              <li>Brand or designer</li>
              <li>Demand</li>
              <li>Rental duration</li>
            </ul>
            <p>ASO WA does not regulate pricing.</p>
          </>
        ),
      },
      {
        q: "What if the item doesn't fit?",
        icon: "sellers",
        a: (
          <p>
            Fit expectations and refund terms must be agreed before completing
            the transaction. ASO WA does not issue refunds.
          </p>
        ),
      },
    ],
  },
  {
    id: "safety",
    label: "Safety",
    items: [
      {
        q: "How can I stay safe?",
        icon: "safety",
        a: (
          <ul>
            <li>Verifying user details before payment</li>
            <li>Keeping written agreements</li>
            <li>Meeting in public places for collection</li>
            <li>Using tracked delivery</li>
          </ul>
        ),
      },
      {
        q: "How do I report inappropriate behaviour?",
        icon: "safety",
        a: (
          <p>
            Please contact:{" "}
            <a href="mailto:hello@aso-wa.com">hello@aso-wa.com</a>
          </p>
        ),
      },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    items: [
      {
        q: "Where can I leave feedback?",
        icon: "feedback",
        a: (
          <>
            <p>We are building ASO WA in phases and value community input.</p>
            <p>
              Send feedback or suggestions to:{" "}
              <a href="mailto:hello@aso-wa.com">hello@aso-wa.com</a>
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "general",
    label: "General",
    items: [
      {
        q: "Is ASO WA responsible for disputes?",
        icon: "general",
        a: (
          <p>
            No. ASO WA is not a party to transactions and does not mediate
            disputes.
          </p>
        ),
      },
    ],
  },
];

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [openItem, setOpenItem] = useState<number | null>(0);

  const currentSection = sections.find((s) => s.id === activeTab)!;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setOpenItem(0);
  };

  return (
    <div className="wrapper">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>
          These are the most commonly asked questions about ASO WA. Can't find
          what you're looking for?{" "}
          <a href="mailto:hello@aso-wa.com">Chat to our friendly team</a>.
        </p>
      </div>

      <div className="faq-tabs" role="tablist">
        {sections.map((s) => (
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
              <span className="acc-icon">{sectionIcons[item.icon]}</span>
              <span className="acc-title">{item.q}</span>
              <ChevronDown className="chevron" size={16} />
            </button>
            {openItem === i && <div className="accordion-body">{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
