import "../genericPageStyles.scss";

const CookiePolicyPage = () => {
  return (
    <div className="wrapper">
      <h2>ASO WA Cookie Policy</h2>
      <p>
        <h2>What Are Cookies?</h2>
      </p>

      <p>
        Cookies are small data files stored on your device when you visit a
        website.
      </p>

      <h2>How We Use Cookies</h2>
      <p> We use cookies to:</p>
      <ul>
        <li>Ensure website functionality</li>
        <li>Analyse traffic</li>
        <li>Improve performance</li>
        <li>Remember preferences</li>
      </ul>

      <p>
        <h2>Types of Cookies Used</h2>
      </p>
      <ul>
        <li>Essential cookies (required for operation)</li>
        <li>Performance/analytics cookies</li>
        <li>Functional cookies</li>
      </ul>

      <p>We do not use cookies to process payments.</p>
      <p>
        <h2>Managing Cookies</h2>
      </p>
      <p>
        You can manage or disable cookies via your browser settings. Disabling
        certain cookies may affect website functionality.
      </p>
    </div>
  );
};

export default CookiePolicyPage;
