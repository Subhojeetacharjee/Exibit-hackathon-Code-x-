import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserProfile from './pages/UserProfile';
import FindSpecialist from './pages/FindSpecialist';
import NearbyClinics from './pages/NearbyClinics';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/find-specialist" element={<FindSpecialist />} />
        <Route path="/clinics" element={<NearbyClinics />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
