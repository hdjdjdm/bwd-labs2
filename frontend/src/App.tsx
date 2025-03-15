import { BrowserRouter as Router, Routes, Route } from 'react-router';
import HomePage from '@pages/HomePage/HomePage.tsx';
import RegisterPage from '@pages/RegisterPage/RegisterPage.tsx';
import LoginPage from '@pages/LoginPage/LoginPage.tsx';
import EventsPage from '@pages/EventsPage/EventsPage.tsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/events" element={<EventsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
