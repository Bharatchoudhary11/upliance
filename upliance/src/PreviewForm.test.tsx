import { render, screen, fireEvent } from '@testing-library/react';
import PreviewForm from './PreviewForm';

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
