/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencyInput } from './CurrencyInput';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('CurrencyInput', () => {
    it('accepts valid numeric input', () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="Test Input" value={0} onChange={handleChange} />);

        const input = screen.getByLabelText('Test Input');
        fireEvent.change(input, { target: { value: '123' } });

        expect(handleChange).toHaveBeenCalled();
        // Should not show error
        expect(screen.queryByText(/Invalid character/i)).not.toBeInTheDocument();
    });

    it('accepts math expressions', () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="Math Input" value={0} onChange={handleChange} />);

        const input = screen.getByLabelText('Math Input');
        fireEvent.change(input, { target: { value: '100 + 50' } });

        expect(handleChange).toHaveBeenCalled();
        expect(screen.queryByText(/Invalid character/i)).not.toBeInTheDocument();
    });

    it('rejects invalid characters and shows error', () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="Error Input" value={0} onChange={handleChange} />);

        const input = screen.getByLabelText('Error Input');
        fireEvent.change(input, { target: { value: '100abc' } });

        // Should show error message
        expect(screen.getByText(/Invalid character/i)).toBeInTheDocument();

        // Should still call onChange (with 0 or fallback as per implementation)
        expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('clears error when input becomes valid and correct accessibility attributes', async () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="Repair Input" value={0} onChange={handleChange} />);

        const input = screen.getByLabelText('Repair Input');

        // Invalid first
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(screen.getByText(/Invalid character/i)).toBeInTheDocument();
        expect(input).toHaveAttribute('aria-invalid', 'true');

        // Fix it
        fireEvent.change(input, { target: { value: '123' } });

        // Wait for error to be removed from DOM (framer-motion exit animation)
        await waitFor(() => {
            expect(screen.queryByText(/Invalid character/i)).not.toBeInTheDocument();
        });
        expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('maintains basic accessibility attributes', () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="A11y Input" value={100} onChange={handleChange} />);

        const input = screen.getByLabelText('A11y Input');

        // Check for accessible name association
        expect(input).toHaveAttribute('id', 'A11y Input');

        // Check for correct type
        expect(input).toHaveAttribute('type', 'text');

        // Check formatted value presence (now shows with commas for values > 999)
        expect(input).toHaveValue('100');
    });

    // === Comma Input Tests (Issue #60) ===

    it('accepts comma-separated values and parses them correctly', () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="Comma Input" value={0} onChange={handleChange} />);

        const input = screen.getByLabelText('Comma Input');
        fireEvent.change(input, { target: { value: '50,000' } });

        // Should not show error
        expect(screen.queryByText(/Invalid character/i)).not.toBeInTheDocument();
        // Should call onChange with the stripped numeric value
        expect(handleChange).toHaveBeenCalledWith(50000);
    });

    it('accepts values with multiple commas', () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="Multi Comma" value={0} onChange={handleChange} />);

        const input = screen.getByLabelText('Multi Comma');
        fireEvent.change(input, { target: { value: '1,250,000' } });

        expect(screen.queryByText(/Invalid character/i)).not.toBeInTheDocument();
        expect(handleChange).toHaveBeenCalledWith(1250000);
    });

    it('handles comma-separated values with decimals', () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="Comma Decimal" value={0} onChange={handleChange} />);

        const input = screen.getByLabelText('Comma Decimal');
        fireEvent.change(input, { target: { value: '1,250,000.50' } });

        expect(screen.queryByText(/Invalid character/i)).not.toBeInTheDocument();
        expect(handleChange).toHaveBeenCalledWith(1250000.50);
    });

    it('auto-formats with commas on blur', async () => {
        const Wrapper = () => {
            const [val, setVal] = useState(0);
            return <CurrencyInput label="Blur Format" value={val} onChange={setVal} />;
        };
        const user = userEvent.setup();
        render(<Wrapper />);

        const input = screen.getByLabelText('Blur Format');
        await user.click(input);
        await user.type(input, '50000');
        // Tab away to trigger blur
        await user.tab();

        // After blur, the display value should be comma-formatted
        expect(input).toHaveValue('50,000');
    });

    it('displays externally set values with comma formatting', () => {
        const handleChange = vi.fn();
        render(<CurrencyInput label="External Value" value={1250000} onChange={handleChange} />);

        const input = screen.getByLabelText('External Value');
        // Initial render should show comma-formatted
        expect(input).toHaveValue('1,250,000');
    });
});
