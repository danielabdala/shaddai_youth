import { Card, CardContent, Typography, Box } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import {formatDateYYYYMMDD} from '../src/utils/birthdayUtils';

const UpcomingBirthdays = ({ members }) => {
  if (members.length === 0) return null;

  return (
    <Card sx={{ p: 2, mb: 2, backgroundColor: '#fffbe6' }} elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🎉 Upcoming Birthdays
        </Typography>
        {members.map((member) => (
          <Box key={member.id} display="flex" alignItems="center" mb={1}>
            <CakeIcon sx={{ color: 'orange', mr: 1 }} />
            <Typography>
              <strong>{member.name}</strong> — {formatDateYYYYMMDD(member.upcomingDate.toISOString().split('T')[0])}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingBirthdays;
