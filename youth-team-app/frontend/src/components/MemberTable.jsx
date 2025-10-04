// src/components/MemberTable.jsx
import { useState, useMemo, useEffect } from 'react';
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
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';

const MemberTable = ({ members, onEdit, onDelete, onSort, sortField, sortOrder }) => {
  const [page, setPage] = useState(0);                // 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(10); // 5/10/25/50

  useEffect(() => {
    setPage(0);
  }, [members, sortField, sortOrder]);

  const isBirthdayThisMonth = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getMonth() === now.getMonth();
  };

  const getInitials = (name) =>
    name.trim().split(/\s+/).map(n => n[0]?.toUpperCase() ?? '').join('');

  const formatMDY = (iso) => {
    if (!iso) return '';
    const [yyyy, mm, dd] = iso.split('-');
    return `${mm}/${dd}/${yyyy}`;
  };

  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return members.slice(start, start + rowsPerPage);
  }, [members, page, rowsPerPage]);

  const handleChangePage = (_evt, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} elevation={3} /* no extra padding/margin here */>
      <Table stickyHeader>
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
          {paged.map((member) => (
            <TableRow key={member.id} hover>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    {getInitials(member.name)}
                  </Avatar>
                  <Typography variant="body1">
                    {member.name}
                    {isBirthdayThisMonth(member.birthday) && (
                      <CakeIcon
                        fontSize="small"
                        sx={{ ml: 1, color: 'orange', verticalAlign: 'middle' }}
                      />
                    )}
                  </Typography>
                </Stack>
              </TableCell>

              <TableCell>{formatMDY(member.birthday)}</TableCell>

              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => onEdit(member)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => onDelete(member.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {paged.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No members for this page.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* No extra Box/padding here — keep it tight to the Paper */}
      <TablePagination
        component="div"
        count={members.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </TableContainer>
  );
};

export default MemberTable;
