import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '@pages/HomePage/HomePage.tsx';
import RegisterPage from '@pages/RegisterPage/RegisterPage.tsx';
import LoginPage from '@pages/LoginPage/LoginPage.tsx';
import EventsPage from '@pages/EventsPage/EventsPage.tsx';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage.tsx';
import AboutPage from '@pages/AboutPage/AboutPage.tsx';
import React from 'react';
import { Bounce, ToastContainer } from 'react-toastify';

const App: React.FC = () => {
    return (
        <>
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
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </>
    );
};

export default App;
