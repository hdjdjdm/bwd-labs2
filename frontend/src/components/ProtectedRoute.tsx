import { useAppSelector } from '@app/hooks.ts';
import { Navigate, Outlet } from 'react-router-dom';
import { getFromLocalStorage } from '@utils/localStorageUtils.ts';

export const ProtectedRoute = () => {
    const user = useAppSelector((state) => state.auth.user);
    const token = getFromLocalStorage('token');

    if (!user && !token) {
        return <Navigate to={'/login'} replace />;
    }

    return <Outlet />;
};
