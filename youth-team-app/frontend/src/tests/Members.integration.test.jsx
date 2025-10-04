// src/tests/Members.integration.test.jsx
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Members from '../pages/Members';

// Mock axios wrapper used by Members.jsx
vi.mock('../api/axios', () => {
  const get = vi.fn();
  const post = vi.fn();
  const put = vi.fn();
  const del = vi.fn();

  return {
    default: { get, post, put, delete: del },
  };
});

import api from '../api/axios';

describe('Members page (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads list, adds, edits, and deletes a member end-to-end', async () => {
    // ---- Arrange: sequence of GETs for each refresh ----
    const initialList = [
      { id: 1, name: 'Alice Johnson', birthday: '1990-07-01' },
      { id: 2, name: 'Bob Stone',     birthday: '1988-03-25' },
    ];
    const afterAdd = [
      ...initialList,
      { id: 3, name: 'New Person', birthday: '2000-01-01' },
    ];
    const afterEdit = [
      { id: 1, name: 'Alice Updated', birthday: '1990-07-01' },
      initialList[1],
      afterAdd[2],
    ];
    const afterDelete = [
      afterEdit[0], // Alice Updated
      afterEdit[1], // Bob Stone
      // removed id=3
    ];

    api.get
      .mockResolvedValueOnce({ data: initialList }) // initial load
      .mockResolvedValueOnce({ data: afterAdd })    // after add
      .mockResolvedValueOnce({ data: afterEdit })   // after edit
      .mockResolvedValueOnce({ data: afterDelete }); // after delete

    api.post.mockResolvedValue({ data: { id: 3, name: 'New Person', birthday: '2000-01-01' } });
    api.put.mockResolvedValue({ data: { id: 1, name: 'Alice Updated', birthday: '1990-07-01' } });
    api.delete.mockResolvedValue({ status: 204 });

    render(<Members />);

    // ---- Load: initial list appears ----
    await waitFor(() => {
      expect(screen.getByText(/youth team members/i)).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Stone')).toBeInTheDocument();
    });

    // ---- Add: target the form specifically ----
    // These match "Name" or "Name *" (MUI required adds "*")
    const nameInput = screen.getByLabelText(/^Name\b/i);
    const birthdayInput = screen.getByLabelText(/^Birthday\b/i);

    fireEvent.change(nameInput, { target: { value: 'New Person' } });
    fireEvent.change(birthdayInput, { target: { value: '2000-01-01' } });

    // Prefer exact button label for the submit
    const addButton =
      screen.queryByRole('button', { name: /^add member$/i }) ||
      screen.getByRole('button', { name: /^add$/i });
    fireEvent.click(addButton);

    expect(api.post).toHaveBeenCalledWith('/members/', {
      name: 'New Person',
      birthday: '2000-01-01',
    });

    await waitFor(() => {
      expect(screen.getByText('New Person')).toBeInTheDocument();
    });

    // ---- Edit: click Edit on Alice, change name, submit ----
    const aliceRow = screen.getByText('Alice Johnson').closest('tr');
    fireEvent.click(within(aliceRow).getByRole('button', { name: /edit/i }));

    // Prefer dialog scope if the edit opens in a modal; otherwise fallback
    let scope;
    try {
      const dialog = await screen.findByRole('dialog', {}, { timeout: 1000 });
      scope = within(dialog);
    } catch {
      // No dialog? Use the entire screen (or use within(aliceRow) if inline)
      scope = screen;
    }

    // Key change: select the input by its current displayed value
    const editName = await scope.findByDisplayValue('Alice Johnson');
    fireEvent.change(editName, { target: { value: 'Alice Updated' } });

    const saveButton =
      scope.queryByRole('button', { name: /^save$/i }) ||
      scope.queryByRole('button', { name: /^update$/i }) ||
      scope.queryByRole('button', { name: /^add member$/i }) ||
      scope.getByRole('button', { name: /^add$/i });
    fireEvent.click(saveButton);

    expect(api.put).toHaveBeenCalledWith('/members/1', {
      name: 'Alice Updated',
      birthday: '1990-07-01',
    });

    await waitFor(() => {
      expect(screen.getByText('Alice Updated')).toBeInTheDocument();
    });

    // ---- Delete: click Delete on "New Person", then confirm in the dialog ----
    const newRow = screen.getByText('New Person').closest('tr');
    fireEvent.click(within(newRow).getByRole('button', { name: /delete/i }));

    // Scope to the dialog to avoid matching table "Delete" buttons
    const dialog = await screen.findByRole('dialog');
    const confirmBtn = within(dialog).getByRole('button', { name: /^delete$/i });
    fireEvent.click(confirmBtn);

    expect(api.delete).toHaveBeenCalledWith('/members/3');

    await waitFor(() => {
      expect(screen.queryByText('New Person')).not.toBeInTheDocument();
      expect(screen.getByText('Alice Updated')).toBeInTheDocument();
      expect(screen.getByText('Bob Stone')).toBeInTheDocument();
    });

    // Optional: a snackbar fired at some point
    expect(
      screen.getByText(/added member|updated member|deleted member/i)
    ).toBeInTheDocument();
  });
});
