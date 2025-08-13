

export interface LogoProps {
  /** Logo color*/
  variant?: 'green' | 'yellow' | 'black'
  /** Logo custom styling */
  customStyle?: string
  /** Determines width of image.
  FYI: ratio of width to height is 367:320, then for every 367 units of width, there are 320 units of height*/
  width?: number,
  /** Determines height of image.
  FYI: ratio of width to height is 367:320, then for every 367 units of width, there are 320 units of height*/
  height?: number
}

/** UI component for Logo*/
const Logo = ({
  variant = 'green',
  customStyle = '',
  width = 184,
  height = 160,
  ...props
}: LogoProps) => {
  return (
    <img
      className={[customStyle].join(' ')}
      data-testid='logo-image'
      src={`/logos/${variant}Logo.png`}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default Logo
