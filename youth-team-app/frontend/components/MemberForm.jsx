import {Box, Button, TextField} from '@mui/material';

const MemberForm = ({ name, birthday, onChangeName, onChangeBirthday, onSubmit }) => (
    <form onSubmit = {onSubmit}>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <TextField
                label="Name"
                value={name}
                onChange={onChangeName}
                required
            />
            <TextField
                label="Birthday"
                type="date"
                value={birthday}
                onChange={onChangeBirthday}
                required
                InputLabelProps={{shrink: true}}
            />
            <Button type="submit" variant="contained">Add Member</Button>

        </Box>
    </form>
);

export default MemberForm;