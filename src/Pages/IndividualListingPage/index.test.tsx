
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import IndividualListingPage from '.';
import HttpService from '../../Services/httpService';

const mockListingData = {
    Title: 'Test Product',
    Price: 49.99,
    Description: 'This is a test description.',
    Images: [{ url: 'https://example.com/test.jpg' }],
    Owner: ['owner-record-id']
};

const mockOwnerFields = {
    Email: 'owner@example.com',
    Name: 'Test Owner',

};

describe('IndividualListingPage', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('shows loading while fetching', () => {
        jest
            .spyOn(HttpService.prototype, 'fetchRecord')
            .mockReturnValueOnce(new Promise(() => { }));



        render(
            <MemoryRouter initialEntries={['/listing/123']}>
                <Routes>
                    <Route path="/listing/:id" element={<IndividualListingPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('renders listing data correctly', async () => {
        jest
            .spyOn(HttpService.prototype, 'fetchRecord')
            .mockResolvedValueOnce({ fields: mockListingData });

        render(
            <MemoryRouter initialEntries={['/listing/123']}>
                <Routes>
                    <Route path="/listing/:id" element={<IndividualListingPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() =>
            expect(screen.getByText(mockListingData.Title.toUpperCase())).toBeInTheDocument()
        );

        expect(screen.getByText('£49.99')).toBeInTheDocument();
        expect(screen.getByText(mockListingData.Description)).toBeInTheDocument();
        expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
    });

    test('shows error message on fetch failure', async () => {
        jest
            .spyOn(HttpService.prototype, 'fetchRecord')
            .mockRejectedValueOnce(new Error('Failed fetch'));

        render(
            <MemoryRouter initialEntries={['/listing/123']}>
                <Routes>
                    <Route path="/listing/:id" element={<IndividualListingPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() =>
            expect(
                screen.getByText(/unable to load listing/i)
            ).toBeInTheDocument()
        );
    });

    test.only('Add to Cart button has correct mailto link', async () => {
        jest
            .spyOn(HttpService.prototype, 'fetchRecord')
            .mockResolvedValueOnce({ fields: mockListingData }) // listing
            .mockResolvedValueOnce({ fields: mockOwnerFields }); // owner

        render(
            <MemoryRouter initialEntries={['/listing/123']}>
                <Routes>
                    <Route path="/listing/:id" element={<IndividualListingPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() =>
            expect(
                screen.getByText(mockListingData.Title.toUpperCase())
            ).toBeInTheDocument()
        );

        const button = screen.getByText(/Make an enquiry/i);

        expect(button).toHaveAttribute(
            'href',
            expect.stringContaining(`mailto:${mockOwnerFields.Email}`)
        );
    });

});
