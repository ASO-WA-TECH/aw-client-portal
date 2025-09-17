

import { render, screen, fireEvent } from '@testing-library/react';
import NavigationMenu from '.';

describe('NavigationMenu', () => {
    test('snapshot', () => {
        const { container } = render(<NavigationMenu />);

        expect(container).toMatchSnapshot()
    })
    test('renders desktop menu ', () => {
        render(<NavigationMenu />);
        expect(screen.getByTestId('desktop-menu')).toBeInTheDocument();
    });

    test('renders hamburger button', () => {
        render(<NavigationMenu />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('shows mobile menu after hamburger is clicked', () => {
        render(<NavigationMenu />);
        const hamburgerButton = screen.getByRole('button');
        fireEvent.click(hamburgerButton);
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });

    test('closes mobile menu when "Close" is clicked inside it', () => {
        render(<NavigationMenu />);
        fireEvent.click(screen.getByRole('button')); // open mobile menu
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

        const closeButton = screen.getByText('X');
        fireEvent.click(closeButton);

        // Mobile menu should now be gone
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });
});
