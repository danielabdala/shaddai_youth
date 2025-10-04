import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MemberTable from '@/components/MemberTable'

const members = [
  { id: 1, name: 'Alice Johnson', birthday: '1990-07-01' },
  { id: 2, name: 'Bob Stone',     birthday: '1988-03-25' },
];

describe('MemberTable', () => {
  it('renders member rows', () => {
    render(
      <MemberTable
        members={members}
        onEdit={() => {}}
        onDelete={() => {}}
        onSort={() => {}}
        sortField="name"
        sortOrder="asc"
      />
    );

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Stone')).toBeInTheDocument();

    // birthday cells may be formatted; assert presence loosely
    expect(screen.getByText(/07\/01\/1990|1990-07-01/)).toBeInTheDocument();
    expect(screen.getByText(/03\/25\/1988|1988-03-25/)).toBeInTheDocument();
  });

  it('invokes onSort when clicking sortable headers', () => {
    const onSort = vi.fn();
    render(
      <MemberTable
        members={members}
        onEdit={() => {}}
        onDelete={() => {}}
        onSort={onSort}
        sortField="name"
        sortOrder="asc"
      />
    );

    // MUI TableSortLabel renders as a button role with the header text as name
    const nameHeaderBtn = screen.getByRole('button', { name: /name/i });
    fireEvent.click(nameHeaderBtn);
    expect(onSort).toHaveBeenCalledWith('name');

    const birthdayHeaderBtn = screen.getByRole('button', { name: /birthday/i });
    fireEvent.click(birthdayHeaderBtn);
    expect(onSort).toHaveBeenCalledWith('birthday');
  });

  it('calls edit and delete callbacks from row actions', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <MemberTable
        members={members}
        onEdit={onEdit}
        onDelete={onDelete}
        onSort={() => {}}
        sortField="name"
        sortOrder="asc"
      />
    );

    // find row for Alice
    const row = screen.getByText('Alice Johnson').closest('tr');
    const utils = within(row);

    // click Edit
    fireEvent.click(utils.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Alice Johnson' })
    );

    // click Delete
    fireEvent.click(utils.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
