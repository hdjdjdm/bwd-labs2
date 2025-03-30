import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '@pages/HomePage/HomePage.tsx';
import RegisterPage from '@pages/RegisterPage/RegisterPage.tsx';
import LoginPage from '@pages/LoginPage/LoginPage.tsx';
import EventsPage from '@pages/EventsPage/EventsPage.tsx';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage.tsx';
import AboutPage from '@pages/AboutPage/AboutPage.tsx';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/about" element={<AboutPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
