import { toast } from 'react-toastify';
import customToast from '@components/CustomToast/CustomToast.tsx';

export function showCustomToast(
    content: string,
    title: string = '',
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
): void {
    toast(customToast, {
        data: {
            title: title,
            content: content,
        },
        type: type,
    });
}
