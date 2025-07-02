import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper} from '@mui/material';

const MemberTable = ({ members, onEdit, onDelete }) => 
     (
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
                    {members.map(member => (
                        <TableRow key={member.id}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{new Date(member.birthday).toLocaleDateString()}</TableCell>
                            <TableCell align='right'>
                                <Button size="small" variant="outlined" color="primary" onClick={() => onEdit(member)}>Edit</Button>
                                <Button size="small" color="error" onClick={() => onDelete(member.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );


    export default MemberTable;