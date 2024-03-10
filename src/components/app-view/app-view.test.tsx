import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppView from './app-view';

test('renders learn react link', () => {
    render(<AppView />);
    const linkElement = screen.getByText(/powered by esri/i);
    expect(linkElement).toBeInTheDocument();
});
