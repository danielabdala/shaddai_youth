import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpcomingBirthdays from '@/components/UpcomingBirthdays'

function daysFromToday(n) {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate() + n);
}

describe('UpcomingBirthdays', () => {
  it('renders nothing when there are no upcoming birthdays', () => {
    const { container } = render(<UpcomingBirthdays members={[]} />);
    // component returns null when empty
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a card with upcoming birthdays in order', () => {
    const members = [
      {
        id: 1,
        name: 'Soon Person',
        birthday: '1990-01-01',          // optional: if your component shows birthday
        upcomingDate: daysFromToday(3),  // must be a real Date
      },
      {
        id: 2,
        name: 'Later Person',
        birthday: '1992-02-02',
        upcomingDate: daysFromToday(10),
      },
    ];

    render(<UpcomingBirthdays members={members} />);

    // title visible
    expect(screen.getByText(/upcoming birthdays/i)).toBeInTheDocument();

    // both names visible
    const soon = screen.getByText(/soon person/i);
    const later = screen.getByText(/later person/i);
    expect(soon).toBeInTheDocument();
    expect(later).toBeInTheDocument();

    // order check (Soon appears before Later)
    const allText = screen.getByText(/upcoming birthdays/i).closest('div')?.textContent || '';
    expect(allText.indexOf('Soon Person')).toBeLessThan(allText.indexOf('Later Person'));
  });
});
