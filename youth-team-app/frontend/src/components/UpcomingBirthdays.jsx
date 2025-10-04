import { useMemo, useState } from 'react';
import {
  Paper, Box, Typography, Stack, Avatar, Chip, Divider, Button, Tooltip, useMediaQuery
} from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import EventIcon from '@mui/icons-material/Event';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// ---- Helpers (robust to either upcomingDate or birthday) ----
const pad = (n) => String(n).padStart(2, '0');
const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };

function nextOccurrenceFromBirthday(iso) {
  // iso: 'YYYY-MM-DD'
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const now = new Date();
  // handle Feb 29
  const targetDay = (m === 2 && d === 29)
    ? (isLeapYear(now.getFullYear()) ? 29 : 28)
    : d;
  const thisYear = new Date(now.getFullYear(), m - 1, targetDay);
  return thisYear >= startOfDay(now) ? thisYear : new Date(now.getFullYear() + 1, m - 1, targetDay);
}
function isLeapYear(y){ return (y%4===0 && y%100!==0) || (y%400===0); }

function resolveNextDate(member) {
  // Prefer precomputed upcomingDate if present
  if (member.upcomingDate) return new Date(member.upcomingDate);
  // Fallback to compute from birthday
  return nextOccurrenceFromBirthday(member.birthday);
}

function daysUntil(date) {
  const now = startOfDay(new Date());
  const target = startOfDay(date);
  return Math.round((target - now) / (1000 * 60 * 60 * 24));
}

function getInitials(name='') {
  return name.trim().split(/\s+/).map(n => n[0]?.toUpperCase() ?? '').join('');
}
function formatMD(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${pad(m)}/${pad(d)}`;
}
function ageTurning(birthdayIso, nextDate) {
  if (!birthdayIso) return null;
  const birthYear = Number(birthdayIso.split('-')[0]);
  if (!birthYear) return null;
  return nextDate.getFullYear() - birthYear;
}

// ---- Component ----
/**
 * Props:
 *  - members: array of { id, name, birthday, [optional] upcomingDate }
 *  - maxItems?: number  (when expanded; defaults to all)
 *  - sx?: MUI sx (optional)
 */
export default function UpcomingBirthdays({ members = [], maxItems, sx }) {
  if (!members || members.length === 0) return null;

  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up('sm')); // responsive default collapsed size
  const COLLAPSED_COUNT = isUpSm ? 6 : 4;                   // show fewer on small screens

  const [expanded, setExpanded] = useState(false);

  const prepared = useMemo(() => {
    // Resolve next date for each member; filter out invalid; sort soonest first
    const withDates = members
      .map(m => ({ ...m, _next: resolveNextDate(m) }))
      .filter(m => m._next instanceof Date && !isNaN(m._next));
    withDates.sort((a, b) => a._next - b._next);
    return withDates;
  }, [members]);

  const total = prepared.length;
  const limit = expanded ? (maxItems ?? total) : Math.min(COLLAPSED_COUNT, total);
  const visible = prepared.slice(0, limit);

  return (
    <Paper
      elevation={4}
      sx={{ overflow: 'hidden', borderRadius: 2, ...sx }}
    >
      {/* Gradient header */}
      <Box
        sx={{
          px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1,
          color: 'primary.contrastText',
          background:
            'linear-gradient(135deg, rgba(25,118,210,0.95) 0%, rgba(25,118,210,0.7) 60%, rgba(46,125,50,0.75) 100%)',
        }}
      >
        <CakeIcon />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Upcoming Birthdays
        </Typography>

        <Button
          component={Link}
          to="/insights"
          size="small"
          endIcon={<ArrowForwardIcon />}
          variant="outlined"
          sx={{
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.7)',
            '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          View all
        </Button>
      </Box>

      {/* List */}
      <Box sx={{ py: 1 }}>
        {visible.map((m, idx) => {
          const next = m._next;
          const inDays = daysUntil(next);
          const isToday = inDays === 0;
          const turning = ageTurning(m.birthday, next);

          const chipProps =
            isToday
              ? { color: 'success', icon: <CelebrationIcon /> }
              : inDays <= 7
              ? { color: 'warning', icon: <EventIcon /> }
              : { color: 'default', icon: <EventIcon /> };

          return (
            <Box key={m.id}>
              {idx > 0 && <Divider />}
              <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2, py: 1.5 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{getInitials(m.name)}</Avatar>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" noWrap title={m.name}>
                    {m.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatMD(next)}{turning ? ` • turning ${turning}` : ''}
                  </Typography>
                </Box>

                <Tooltip title={next.toLocaleDateString()}>
                  <Chip
                    {...chipProps}
                    label={isToday ? 'Today 🎉' : `in ${inDays} day${inDays === 1 ? '' : 's'}`}
                    variant={isToday ? 'filled' : 'outlined'}
                  />
                </Tooltip>
              </Stack>
            </Box>
          );
        })}
      </Box>

      {/* Show more / less */}
      {total > limit && (
        <Box sx={{ px: 2, pb: 2, pt: 0.5, display: 'flex', justifyContent: 'center' }}>
          <Button
            size="small"
            onClick={() => setExpanded(e => !e)}
            variant="text"
          >
            {expanded ? 'Show less' : `Show ${total - limit} more`}
          </Button>
        </Box>
      )}
    </Paper>
  );
}
