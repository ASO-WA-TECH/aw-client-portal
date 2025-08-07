import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Logo, { type LogoProps } from '.';

describe('Logo component', () => {
    const defaultProps: LogoProps = {}


    it('renders with default props', () => {
        const component = render(<Logo {...defaultProps} />);
        expect(component).toMatchSnapshot()
    })
})