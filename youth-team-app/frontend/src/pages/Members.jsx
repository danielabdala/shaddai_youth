import { useEffect, useState } from 'react';
import api from '../api/axios';
import MemberForm from '../../components/MemberForm';
import MemberTable from '../../components/MemberTable';
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
  Grid
} from '@mui/material';

import UpcomingBirthdays from '../../components/UpcomingBirthdays';
import { getUpcomingBirthdays } from '../utils/birthdayUtils';


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

  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]); 


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
        setMembers(res.data);
        setUpcomingBirthdays(getUpcomingBirthdays(res.data));
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

  
   return (
    
    <Container maxWidth="md">
      <Grid container spacing={3} direction="column"> 

        {upcomingBirthdays.length > 0 && (
          <Grid item xs={12}>
            <UpcomingBirthdays members={upcomingBirthdays} />
          </Grid>
        )}

        
        <Grid item>
          <Typography variant="h4" align="center" gutterBottom>
            Youth Team Members
          </Typography>
        </Grid>

        <Grid item>
          <Paper sx={{ padding: 3 }}>
            {editingMember ? (
              <MemberForm
                name={editingName}
                birthday={editingBirthday}
                onChangeName={e => setEditingName(e.target.value)}
                onChangeBirthday={e => setEditingBirthday(e.target.value)}
                onSubmit={handleUpdate}
              />
            ) : (
              <MemberForm
                name={name}
                birthday={birthday}
                onChangeName={e => setName(e.target.value)}
                onChangeBirthday={e => setBirthday(e.target.value)}
                onSubmit={handleSubmit}
              />
            )}
          </Paper>
        </Grid> 

        <Grid item>
          {loading ? (
            <Box textAlign="center"><CircularProgress /></Box>
          ) : (
            <Paper sx={{ padding: 2 }} elevation={2}>
              {members.length === 0 ? (
                <Typography align="center">No members found.</Typography>
              ) : (
                <>
                  <Typography variant="h5" align="center" gutterBottom>
                    Member List
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <MemberTable
                      members={members}
                      onEdit={startEditing}
                      onDelete={handleDeleteClick}
                    />
                  </Box>
                </>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>

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
