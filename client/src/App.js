import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import LogsPage from './pages/LogsPage'
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <Router>
      <nav>
        <Link to='/'>Homepage</Link>
        <Link to='/uploadCSV'>Upload</Link>
        <Link to='/logs'>Logs</Link>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Signup</Link>
      </nav>

      <Routes>
        <Route path='/' />
        <Route path="/uploadCSV" element={<UploadPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
