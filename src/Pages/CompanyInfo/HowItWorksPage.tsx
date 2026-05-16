import "../genericPageStyles.scss";

const steps = [
  {
    number: 1,
    title: "Create your account",
    description: "Sign up and set up your profile",
  },
  {
    number: 2,
    title: "Upload your item",
    description:
      "Add clear photos, size, fit, condition and a short description",
  },
  {
    number: 3,
    title: "Set your price",
    description: "Choose your rental price per day",
  },
  {
    number: 4,
    title: "Connect with renters",
    description:
      "Respond to messages and agree details. Payment and delivery are arranged directly.",
  },
  {
    number: 5,
    title: "Finalise & deliver",
    description:
      "Arrange collection or delivery and make sure both sides are clear on timing and return",
  },
];

const HowItWorks = () => {
  return (
    <div className="how-it-works">
      <div className="how-it-works__inner">
        {/* Heading */}
        <h2 className="how-it-works__heading">
          <span className="heading-accent">List your traditional wear</span>
          <span className="heading-accent"> in 5 simple steps</span>
        </h2>

        {/* Steps */}
        <div className="how-it-works__steps">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <div className="step-card__number">{step.number}</div>
              <div className="step-card__content">
                <span className="step-card__dot" />
                <div>
                  <h2 className="step-card__title">{step.title}</h2>
                  <p className="step-card__description">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="how-it-works__cta">
          <p>
            Start{" "}
            <a href="/my-account" target="_blank" rel="noreferrer">
              listing
            </a>{" "}
            and{" "}
            <a href="/listings" target="_blank" rel="noreferrer">
              renting
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
