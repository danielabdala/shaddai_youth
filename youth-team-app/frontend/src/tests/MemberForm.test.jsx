import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MemberForm from '@/components/MemberForm'

describe('MemberForm', () => {
  it('renders name and birthday inputs', () => {
    render(
      <MemberForm
        name=""
        birthday=""
        onChangeName={() => {}}
        onChangeBirthday={() => {}}
        onSubmit={() => {}}
      />
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/birthday/i)).toBeInTheDocument();
  });

  it('calls onSubmit when submitted', () => {
    const onSubmit = vi.fn(e => e && e.preventDefault && e.preventDefault());
    render(
      <MemberForm
        name="Jane"
        birthday="2000-01-01"
        onChangeName={() => {}}
        onChangeBirthday={() => {}}
        onSubmit={onSubmit}
      />
    );

    // find the submit button by its label. Match both "Add Member" and "Save"
    const submitBtn =
      screen.queryByRole('button', { name: /add member|add|save/i }) ||
      screen.getByRole('button'); // last-resort fallback

    fireEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls change handlers for controlled inputs', () => {
    const onChangeName = vi.fn();
    const onChangeBirthday = vi.fn();
    render(
      <MemberForm
        name=""
        birthday=""
        onChangeName={onChangeName}
        onChangeBirthday={onChangeBirthday}
        onSubmit={() => {}}
      />
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/birthday/i), { target: { value: '1990-07-15' } });

    expect(onChangeName).toHaveBeenCalled();
    expect(onChangeBirthday).toHaveBeenCalled();
  });
});