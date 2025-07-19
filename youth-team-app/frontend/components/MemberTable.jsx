import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Stack
} from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';

const MemberTable = ({ members, onEdit, onDelete }) => {
  const isBirthdayThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    return date.getMonth() === new Date().getMonth();
  };

  const getInitials = (name) => {
    const names = name.trim().split(' ');
    return names.map(n => n.charAt(0).toUpperCase()).join('');
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Birthday</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    {getInitials(member.name)}
                  </Avatar>
                  <Typography variant="body1">
                    {member.name}
                    {isBirthdayThisMonth(member.birthday) && (
                      <CakeIcon fontSize="small" sx={{ ml: 1, color: 'orange' }} />
                    )}
                  </Typography>
                </Stack>
              </TableCell>

              <TableCell>{new Date(member.birthday).toLocaleDateString()}</TableCell>

              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => onEdit(member)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => onDelete(member.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MemberTable;
