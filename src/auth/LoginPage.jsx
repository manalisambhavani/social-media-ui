import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { authService } from '../services/authService';


export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');


    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authService.login(form);
            localStorage.setItem('token', res.data.data.token);
            window.location.href = '/';
        } catch (err) {
            setError('Invalid credentials');
        }
    };


    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4">Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" name="username" label="Username" onChange={handleChange} />
                    <TextField fullWidth margin="normal" name="password" label="Password" type="password" onChange={handleChange} />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button variant="contained" type="submit" sx={{ mt: 2 }}>Login</Button>
                </form>
            </Box>
        </Container>
    );
}