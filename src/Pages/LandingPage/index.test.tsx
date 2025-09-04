import { render, screen } from '@testing-library/react';
import LandingPage from '.';
import { MemoryRouter } from 'react-router-dom';

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('LandingPage', () => {


    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders buttons', () => {
        const { container } = render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/LOG IN/i)).toBeInTheDocument();
        expect(screen.getByText(/REGISTER/i)).toBeInTheDocument();
        expect(container).toMatchSnapshot()
    });
});
