import "./index.scss";

export interface ButtonProps {
  text: string;

  handleClick: () => void;
  isDisabled?: boolean;
  type: "button" | "submit";
  color?: "emeraldGreen" | "mustardYellow" | "cream" | "pink";
  variant?: "primary" | "secondary" | "tertiary";
  customStyle?: string;
}

/** UI component for user interaction */
const Button = ({
  text,
  handleClick,
  isDisabled = false,
  color = "emeraldGreen",
  variant = "primary",
  type = "button",
  customStyle = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={[
        "button",
        `button--${color}--${variant}`,
        `button--${variant}`,
        isDisabled ? `button--isDisabled` : "",
        customStyle,
      ].join(" ")}
      onClick={handleClick}
      disabled={isDisabled}
      data-testid="button"
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
