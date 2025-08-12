import { render, screen, fireEvent } from '@testing-library/react';
import PreviewForm from './PreviewForm';

beforeAll(() => {
  // prevent jsdom error for alert
  window.alert = jest.fn();
});

describe('PreviewForm derived fields', () => {
  const form = {
    name: 'Calc',
    fields: [
      { id: 'a', type: 'number', label: 'A', defaultValue: '2' },
      { id: 'b', type: 'number', label: 'B', defaultValue: '3' },
      {
        id: 'sum',
        type: 'number',
        label: 'Sum',
        derived: true,
        formula: 'Number(values.a) + Number(values.b)'
      }
    ]
  };

  it('calculates derived field and keeps it read-only', () => {
    render(<PreviewForm form={form} onBack={() => {}} />);
    const aInput = screen.getByLabelText('A');
    const sumInput = screen.getByLabelText('Sum') as HTMLInputElement;

    expect(sumInput.value).toBe('5');
    fireEvent.change(aInput, { target: { value: '4' } });
    expect(sumInput.value).toBe('7');
    expect(sumInput).toHaveAttribute('readOnly');
  });
});

describe('PreviewForm validation', () => {
  it('requires at least one checkbox when marked required', () => {
    const form = {
      name: 'Terms',
      fields: [
        { id: 'terms', type: 'checkbox', label: 'Terms', required: true, options: 'Yes,No' }
      ]
    };
    render(<PreviewForm form={form} onBack={() => {}} />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Required')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Yes'));
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.queryByText('Required')).toBeNull();
  });
});
