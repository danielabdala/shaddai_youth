import { useEffect, useMemo, useState } from 'react';
import {
  Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem,
  TextField, Chip
} from '@mui/material';
import api from '../api/axios';
import MemberTable from '../components/MemberTable';
import UpcomingBirthdays from '../components/UpcomingBirthdays';
import { filterByQuarter } from '../utils/birthdayUtils';
import { getSortedMembers } from '../utils/sortUtils';

const QUARTERS = [
  { value: 'all', label: 'All' },
  { value: 1, label: 'Q1 (Jan–Mar)' },
  { value: 2, label: 'Q2 (Apr–Jun)' },
  { value: 3, label: 'Q3 (Jul–Sep)' },
  { value: 4, label: 'Q4 (Oct–Dec)' },
];

// --- helpers for "upcoming within N days" ---
const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const isLeapYear = (y) => (y%4===0 && y%100!==0) || (y%400===0);
function nextOccurrenceFromBirthday(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const now = new Date();
  const safeDay = (m === 2 && d === 29) ? (isLeapYear(now.getFullYear()) ? 29 : 28) : d;
  const thisYear = new Date(now.getFullYear(), m - 1, safeDay);
  return thisYear >= startOfDay(now) ? thisYear : new Date(now.getFullYear() + 1, m - 1, safeDay);
}
function isWithinDays(date, days) {
  const now = startOfDay(new Date());
  const end = new Date(now);
  end.setDate(end.getDate() + days);
  return date >= now && date <= end;
}

export default function BirthdayInsights() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quarter, setQuarter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch once
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/members/');
        setMembers(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- Upcoming birthdays (next 60 days, tweak as you like) ---
  const UPCOMING_WINDOW_DAYS = 60;
  const upcoming = useMemo(() => {
    return (members || []).filter(m => {
      const next = nextOccurrenceFromBirthday(m.birthday);
      return next && isWithinDays(next, UPCOMING_WINDOW_DAYS);
    });
  }, [members]);

  // --- Quarter -> search -> sort for the table ---
  const filtered = useMemo(() => {
    const byQuarter = filterByQuarter(members, quarter);
    const q = search.trim().toLowerCase();
    if (!q) return byQuarter;
    return byQuarter.filter(m => m.name.toLowerCase().includes(q));
  }, [members, quarter, search]);

  const sorted = useMemo(
    () => getSortedMembers(filtered, sortField, sortOrder),
    [filtered, sortField, sortOrder]
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {/* 1) Upcoming Birthdays on top */}
      <Box>
        <UpcomingBirthdays members={upcoming} />
      </Box>

      {/* 2) Filters/Search */}
      <Box>
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '220px 1fr auto' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="quarter-label">Quarter</InputLabel>
              <Select
                labelId="quarter-label"
                label="Quarter"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
              >
                {QUARTERS.map((q) => (
                  <MenuItem key={q.value} value={q.value}>
                    {q.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a name…"
              InputLabelProps={{ sx: { px: 0.5, bgcolor: 'background.paper' } }}
            />

            <Chip label={`${sorted.length} result${sorted.length === 1 ? '' : 's'}`} />
          </Box>
        </Paper>
      </Box>

      {/* 3) Full-width table */}
      <Box>
        <Paper sx={{ p: 2, mb: 4 }} elevation={4}>
          {loading ? (
            <Typography align="center" sx={{ py: 6 }}>
              Loading…
            </Typography>
          ) : sorted.length === 0 ? (
            <Typography align="center" sx={{ py: 6 }}>
              No members match this quarter.
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <MemberTable
                members={sorted}
                onEdit={() => {}}
                onDelete={() => {}}
                onSort={handleSort}
                sortField={sortField}
                sortOrder={sortOrder}
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
