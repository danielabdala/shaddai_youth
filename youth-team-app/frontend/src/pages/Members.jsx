import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import MemberForm from '../components/MemberForm';
import MemberTable from '../components/MemberTable';

import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Grid,
  TextField,
} from '@mui/material';

import { getSortedMembers } from '../utils/sortUtils';

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  const [editingMember, setEditingMember] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingBirthday, setEditingBirthday] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    api.get('/members/')
      .then(res => {
        setMembers(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load members:', err);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !birthday) return;

    api.post('/members/', { name, birthday })
      .then(() => {
        setName('');
        setBirthday('');
        fetchMembers();
        showSnackbar(`Added member: ${name}`, 'success');
      })
      .catch(err => {
        console.error('Failed to add member:', err);
        showSnackbar('Failed to add member', 'error');
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingName || !editingBirthday || !editingMember) return;

    api.put(`/members/${editingMember.id}`, {
      name: editingName,
      birthday: editingBirthday
    })
      .then(() => {
        showSnackbar(`Updated member: ${editingName}`, 'success');
        setEditingMember(null);
        setEditingName('');
        setEditingBirthday('');
        fetchMembers();
      })
      .catch(err => {
        console.error('Update failed', err);
        showSnackbar('Failed to update member', 'error');
      });
  };

  const handleDeleteClick = (id) => {
    setMemberToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    const member = members.find(m => m.id === memberToDelete);
    api.delete(`/members/${memberToDelete}`)
      .then(() => {
        fetchMembers();
        showSnackbar(`Deleted member: ${member?.name}`, 'success');
      })
      .catch(err => {
        console.error('Delete failed', err);
        showSnackbar('Failed to delete member', 'error');
      })
      .finally(() => {
        setConfirmOpen(false);
        setMemberToDelete(null);
      });
  };

  const startEditing = (member) => {
    setEditingMember(member);
    setEditingName(member.name);
    setEditingBirthday(member.birthday);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnack({
      open: true,
      message,
      severity
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter + sort
  const filteredMembers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return members.filter(member => member.name.toLowerCase().includes(q));
  }, [members, searchTerm]);

  const sortedMembers = useMemo(() => {
    return getSortedMembers(filteredMembers, sortField, sortOrder);
  }, [filteredMembers, sortField, sortOrder]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} direction="column">

        {/* Centered Add New Member card */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={4}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                mb: 4,
                width: '100%',
                maxWidth: 640, // adjust 560–720 as you like
              }}
            >
              {/* Gradient header */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.contrastText',
                  background:
                    'linear-gradient(135deg, rgba(25,118,210,0.95) 0%, rgba(25,118,210,0.7) 60%, rgba(46,125,50,0.75) 100%)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Add New Member
                </Typography>
              </Box>

              {/* Form body */}
              <Box sx={{ p: 3 }}>
                {editingMember ? (
                  <MemberForm
                    name={editingName}
                    birthday={editingBirthday}
                    onChangeName={(e) => setEditingName(e.target.value)}
                    onChangeBirthday={(e) => setEditingBirthday(e.target.value)}
                    onSubmit={handleUpdate}
                  />
                ) : (
                  <MemberForm
                    name={name}
                    birthday={birthday}
                    onChangeName={(e) => setName(e.target.value)}
                    onChangeBirthday={(e) => setBirthday(e.target.value)}
                    onSubmit={handleSubmit}
                  />
                )}
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Member List card */}
        <Grid item xs={12}>
          {loading ? (
            <Box textAlign="center"><CircularProgress /></Box>
          ) : (
            <Paper elevation={4} sx={{ overflow: 'hidden', borderRadius: 2, mb: 2 }}>
              {/* Gradient header */}
              <Box
                sx={{
                  px: 2, py: 1.5, display: 'flex', alignItems: 'center',
                  color: 'primary.contrastText',
                  background:
                    'linear-gradient(135deg, rgba(25,118,210,0.95) 0%, rgba(25,118,210,0.7) 60%, rgba(46,125,50,0.75) 100%)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Member List
                </Typography>
              </Box>

              <Box sx={{ p: 2 }}>
                {members.length === 0 ? (
                  <Typography align="center">No members found.</Typography>
                ) : (
                  <>
                    {/* Search */}
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        width: '100%',
                        mb: 2,
                        maxWidth: 600,
                        mx: 'auto',
                      }}
                    >
                      <TextField
                        label="Search by name"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        InputLabelProps={{ sx: { px: 0.5, bgcolor: 'background.paper' } }}
                      />
                    </Box>

                    {/* Table */}
                    <Box sx={{ overflowX: 'auto' }}>
                      <MemberTable
                        members={sortedMembers}
                        onEdit={startEditing}
                        onDelete={handleDeleteClick}
                        onSort={handleSort}
                        sortField={sortField}
                        sortOrder={sortOrder}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{' '}
          <strong>{members.find(m => m.id === memberToDelete)?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Members;
