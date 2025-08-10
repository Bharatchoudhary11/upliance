import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation buttons', () => {
  render(<App />);
  expect(screen.getAllByRole('button', { name: /Create/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('button', { name: /Preview/i }).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: /My Forms/i })).toBeInTheDocument();
});

