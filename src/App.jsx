import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PostsPage from './pages/Post/PostPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SignupPage from './auth/SignupPage.jsx';
import LoginPage from './auth/LoginPage.jsx';
import Navbar from './components/Navbar.jsx';
import { useAuth } from './auth/useAuth.js';
import CreatePostPage from './pages/Post/CreatePost.jsx';
import PostDetailPage from './pages/Post/PostDetails.jsx';


function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}


export default function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<PrivateRoute><PostsPage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/posts/create" element={<CreatePostPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Routes>
    </Router>
  );
}