import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '@pages/HomePage/HomePage.tsx';
import RegisterPage from '@pages/RegisterPage/RegisterPage.tsx';
import LoginPage from '@pages/LoginPage/LoginPage.tsx';
import EventsPage from '@pages/EventsPage/EventsPage.tsx';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage.tsx';
import AboutPage from '@pages/AboutPage/AboutPage.tsx';
import React, { useEffect } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import ProfilePage from '@pages/ProfilePage/ProfilePage.tsx';
import { useAppDispatch } from '@/app/hooks.ts';
import { checkTokenValidity } from '@/app/slices/authSlice.ts';
import Loader from '@components/Loader/Loader.tsx';
import { ProtectedRoute } from '@components/ProtectedRoute.tsx';

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkTokenValidity());

        const interval = setInterval(() => {
            dispatch(checkTokenValidity());
        }, 60000);

        return () => clearInterval(interval);
    }, [dispatch]);
    //todo поверх модалок

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/about" element={<AboutPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile/:id" element={<ProfilePage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>

            <Loader />
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
