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

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlaidMethod } from '../PlaidMethod';

// Mock the hooks
const mockOpenPlaidLink = vi.fn();
const mockReset = vi.fn();
const mockUsePlaidLink = vi.fn(() => ({
    openPlaidLink: mockOpenPlaidLink,
    reset: mockReset,
    isLoading: false,
    error: null as string | null,
    status: 'idle'
}));

vi.mock('@/hooks/usePlaidLink', () => ({
    usePlaidLink: () => mockUsePlaidLink()
}));

// Mock react-router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    onDataExtracted: (data: unknown) => {
        // This is an example of how onDataExtracted might be used
        // In a real scenario, this would likely be part of the Plaid hook mock
        console.log('Data extracted:', data);
    }
}));

describe('PlaidMethod', () => {
    it('renders correctly', () => {
        render(<PlaidMethod onSuccess={() => { }} onCancel={() => { }} />);
        expect(screen.getByText('Connect Bank')).toBeInTheDocument();
        expect(screen.getByText('Connect Your Bank')).toBeInTheDocument();
    });

    it('handles connect button click', async () => {
        mockOpenPlaidLink.mockResolvedValue({ success: true });
        const onSuccess = vi.fn();

        render(<PlaidMethod onSuccess={onSuccess} onCancel={() => { }} />);

        const button = screen.getByText('Connect Your Bank');
        fireEvent.click(button);

        expect(mockOpenPlaidLink).toHaveBeenCalled();
        // Note: We need to wait for the promise to resolve in the component
        // Since the effect is async, we might need waitFor or similar if checking onSuccess check
    });

    it('shows loading state properly', () => {
        mockUsePlaidLink.mockReturnValue({
            openPlaidLink: mockOpenPlaidLink,
            reset: mockReset,
            isLoading: true,
            error: null,
            status: 'exchanging'
        });

        render(<PlaidMethod onSuccess={() => { }} onCancel={() => { }} />);

        expect(screen.getByText('Connecting...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /connecting/i })).toBeDisabled();
    });

    it('displays error message', () => {
        mockUsePlaidLink.mockReturnValue({
            openPlaidLink: mockOpenPlaidLink,
            reset: mockReset,
            isLoading: false,
            error: 'Test Error Message',
            status: 'idle'
        });

        render(<PlaidMethod onSuccess={() => { }} onCancel={() => { }} />);

        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
    });

    it('calls onCancel when back button is clicked', () => {
        mockUsePlaidLink.mockReturnValue({
            openPlaidLink: mockOpenPlaidLink,
            reset: mockReset,
            isLoading: false,
            error: null,
            status: 'idle'
        });

        const onCancel = vi.fn();
        render(<PlaidMethod onSuccess={() => { }} onCancel={onCancel} />);

        const backButton = screen.getByText('← Back to options');
        fireEvent.click(backButton);

        expect(onCancel).toHaveBeenCalled();
    });
});
