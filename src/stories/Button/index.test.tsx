
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button, { type ButtonProps } from '.';

describe('Button component', () => {
    const defaultProps: ButtonProps = {
        text: 'Click me',
        handleClick: jest.fn(),
    };

    it('renders with default props', () => {
        render(<Button {...defaultProps} />);
        const button = screen.getByTestId('button');

        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Click me');
        expect(button).toHaveAttribute('type', 'button');
        expect(button).not.toBeDisabled();
        expect(button).toHaveClass('button button--emeraldGreen--primary button--primary');
    });

    it('renders with provided optional props', () => {
        render(
            <Button
                {...defaultProps}
                color="mustardYellow"
                variant="secondary"
                type="submit"
                isDisabled={true}
                text="Submit"
            />
        );
        const button = screen.getByTestId('button');

        expect(button).toHaveTextContent('Submit');
        expect(button).toHaveAttribute('type', 'submit');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('button button--mustardYellow--secondary button--secondary');
    });

    it('calls handleClick when clicked', () => {
        render(<Button {...defaultProps} />);
        const button = screen.getByTestId('button');

        fireEvent.click(button);
        expect(defaultProps.handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call handleClick when disabled', () => {
        const mockClick = jest.fn();
        render(<Button {...defaultProps} isDisabled={true} handleClick={mockClick} />);
        const button = screen.getByTestId('button');

        fireEvent.click(button);
        expect(mockClick).not.toHaveBeenCalled();
    });
});