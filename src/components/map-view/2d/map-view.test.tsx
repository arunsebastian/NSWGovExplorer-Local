import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapView from './map-view';

test('renders learn react link', () => {
    render(<MapView />);
    const linkElement = screen.getByText(/powered by esri/i);
    expect(linkElement).toBeInTheDocument();
});
