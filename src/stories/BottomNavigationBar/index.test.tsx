import { render } from '@testing-library/react';
import BottomNavigationBar from '.';

describe('Bottom navigation bar', () => {

    it('snapshot', () => {
        const { container } = render(
            <BottomNavigationBar />
        );

        expect(container).toMatchSnapshot()
    });
});