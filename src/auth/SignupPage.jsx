import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { authService } from '../services/authService';


export default function SignupPage() {
    const [form, setForm] = useState({ username: '', password: '', firstName: '', lastName: '', email: '', mobileNo: '' });


    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await authService.signup(form);
        localStorage.setItem('token', res.data.data.token);
        window.location.href = '/';
    };


    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4">Signup</Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(form).map((key) => (
                        <TextField key={key} fullWidth margin="normal" name={key} label={key} onChange={handleChange} />
                    ))}
                    <Button variant="contained" type="submit" sx={{ mt: 2 }}>Signup</Button>
                </form>
            </Box>
        </Container>
    );
}