import { Card, CardContent, Typography, Box } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';

const UpcomingBirthdays = ({ members }) => {
  if (members.length === 0) return null;

  return (
    <Card
      elevation={3}
      sx={{
        borderLeft: '6px solid #ffa726', // Orange accent
        backgroundColor: '#fff8e1',      // Light orange background
        mb: 4
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🎉 Upcoming Birthdays (Next 30 Days)
        </Typography>

        {members.map((member) => (
          <Box
            key={member.id}
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ mb: 0.5 }}
          >
            <CakeIcon fontSize="small" color="warning" />
            <Typography variant="body1">
              {member.name} — {new Date(member.birthday).toLocaleDateString()}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingBirthdays;
