import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Prescription from '../Prescription';

describe('Prescription Component', () => {
    test('renders prescription component correctly', () => {
        render(<Prescription />);

        expect(screen.getByRole('heading', { level: 4, name: 'Write Prescription' })).toBeInTheDocument();
        expect(screen.getByLabelText("Patient's Email")).toBeInTheDocument();
        expect(screen.getByLabelText('Medication')).toBeInTheDocument();
        expect(screen.getByLabelText('Dosage')).toBeInTheDocument();
        expect(screen.getByLabelText('Instructions')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Write Prescription' })).toBeInTheDocument();
    });

    test('shows validation error if fields are empty and prescribe button is clicked', () => {
        render(<Prescription />);

        const prescribeButton = screen.getByRole('button', { name: 'Write Prescription' });
        fireEvent.click(prescribeButton);

        expect(screen.getByText("Patient's email is required.")).toBeInTheDocument();
        expect(screen.getByText('Medication is required.')).toBeInTheDocument();
        expect(screen.getByText('Dosage is required.')).toBeInTheDocument();
        expect(screen.getByText('Instructions are required.')).toBeInTheDocument();
    });
});
