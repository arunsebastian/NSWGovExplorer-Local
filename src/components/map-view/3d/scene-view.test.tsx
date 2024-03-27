import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SceneView from './scene-view';

test('renders learn react link', () => {
    render(<SceneView />);
    const linkElement = screen.getByText(/powered by esri/i);
    expect(linkElement).toBeInTheDocument();
});
