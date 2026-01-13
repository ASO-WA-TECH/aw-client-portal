import { render, screen, fireEvent, act } from '@testing-library/react';
import Details from './Details';
import type { ListingFields } from '../ListingPage/types';

const mockListing: ListingFields = {
    Title: 'Test Jacket',
    Price: 120,
    Description: 'Warm jacket',
    Images: [],
    Gender: 'Man',
    'Listing ID': 0,
    Owner: [],
    Category: '',
    Size: '',
    Status: 'Available',
    'Creation Date': '',
    Location: ''
};

const ownerEmail = 'owner@test.com';

const STORAGE_KEY = `enquiry:${mockListing.Title}`;

describe('Details – enquiry localStorage sync', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('shows enquiry button when no enquiry exists', () => {
        render(<Details listing={mockListing} ownerEmail={ownerEmail} />);

        expect(
            screen.getByText(/make an enquiry/i)
        ).toBeInTheDocument();
    });

    test('clicking enquiry stores value and disables button', () => {
        render(<Details listing={mockListing} ownerEmail={ownerEmail} />);

        const enquiryLink = screen.getByText(/make an enquiry/i);

        fireEvent.click(enquiryLink);

        expect(localStorage.getItem(STORAGE_KEY)).toBe('true');

        expect(
            screen.getByText(/enquiry sent/i)
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', { name: /enquiry sent/i })
        ).toBeDisabled();
    });

    test('updates UI when storage event fires (cross-tab sync)', () => {
        render(<Details listing={mockListing} ownerEmail={ownerEmail} />);

        act(() => {
            localStorage.setItem(STORAGE_KEY, 'true');

            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: STORAGE_KEY,
                    newValue: 'true',
                })
            );
        });

        expect(
            screen.getByText(/enquiry sent/i)
        ).toBeInTheDocument();
    });
});
