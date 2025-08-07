import './index.scss';

export interface ButtonProps {
  /** Button contents */
  text: string;
  /** Click handler */
  handleClick: () => void;
  /** Optional disabled state - defaults to false*/
  isDisabled?: boolean;
  /** Optional tyoe state - defaults to button */
  type?: 'button' | 'submit';
  /** Which colour to use */
  color?: 'emeraldGreen' | 'mustardYellow' | 'cream' | 'pink';
  /** Button action type control */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** Button custom styling */
  customStyle?: string
}

/** UI component for user interaction */
const Button = ({
  text,
  handleClick,
  isDisabled = false,
  color = 'emeraldGreen',
  variant = 'primary',
  type = 'button',
  customStyle = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={['button', `button--${color}--${variant}`, `button--${variant}`, isDisabled ? `button--isDisabled` : '', customStyle].join(' ')}
      onClick={handleClick}
      disabled={isDisabled}
      data-testid='button'
      {...props}
    >
      {text}
    </button>
  );
};

export default Button
