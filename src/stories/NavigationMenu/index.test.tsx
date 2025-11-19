

import { render, screen, fireEvent } from '@testing-library/react';
import NavigationMenu from '.';

describe('NavigationMenu', () => {
    test('snapshot', () => {
        const { container } = render(<NavigationMenu toggleDarkMode={jest.fn} darkMode={false} />);

        expect(container).toMatchSnapshot()
    })
    test('renders desktop menu ', () => {
        render(<NavigationMenu toggleDarkMode={jest.fn} darkMode={false} />);
        expect(screen.getByTestId('desktop-menu')).toBeInTheDocument();
    });

    test('renders hamburger button', () => {
        render(<NavigationMenu toggleDarkMode={jest.fn} darkMode={false} />);
        expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    });

    test('shows mobile menu after hamburger is clicked', () => {
        render(<NavigationMenu toggleDarkMode={jest.fn} darkMode={false} />);
        const hamburgerButton = screen.getByTestId('menu-button');
        fireEvent.click(hamburgerButton);
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });

    test('closes mobile menu when "Close" is clicked inside it', () => {
        render(<NavigationMenu toggleDarkMode={jest.fn} darkMode={false} />);
        fireEvent.click(screen.getByTestId('menu-button')); // open mobile menu
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

        const closeButton = screen.getByText('X');
        fireEvent.click(closeButton);

        // Mobile menu should now be gone
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });
});
