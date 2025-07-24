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
  Stack,
  TableSortLabel
} from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';

const MemberTable = ({ members, onEdit, onDelete, onSort, sortField, sortOrder }) => { 

const isBirthdayThisMonth = (dateStr) => {
  const [year, month] = dateStr.split("-").map(Number);
  return (month - 1) === new Date().getMonth();
};


  const getInitials = (name) => {
    const names = name.trim().split(' ');
    return names.map(n => n.charAt(0).toUpperCase()).join('');
  };

  function formatDateYYYYMMDD(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${month}/${day}/${year}`;
}

  return (
    <TableContainer component={Paper} elevation={3} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === 'name'}
                direction={sortField === 'name' ? sortOrder : 'asc'}
                onClick={() => onSort('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'birthday'}
                direction={sortField === 'birthday' ? sortOrder : 'asc'}
                onClick={() => onSort('birthday')}
              >
                Birthday
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">Actions</TableCell>
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

              <TableCell>{formatDateYYYYMMDD(member.birthday)}</TableCell>

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
