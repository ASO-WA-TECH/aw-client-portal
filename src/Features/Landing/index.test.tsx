import "@testing-library/jest-dom";
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react'
import Landing from '.'

describe('Landing', () => {
    it('renders the landing', () => {
        render(<Landing />)

        expect(screen.getByText('aso wa')).toBeInTheDocument()
    })
})