import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


export default function Navbar({ user }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Social Media</Typography>
                {user ? (
                    <>
                        <Button color="inherit" component={Link} to="/">Posts</Button>
                        <Button color="inherit" component={Link} to="/profile">Profile</Button>
                        <Button color="inherit" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/signup">Signup</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}