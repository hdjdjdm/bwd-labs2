import { toast } from 'react-toastify';
import customToast from '@components/CustomToast/CustomToast.tsx';

export function showCustomToast(
    content: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    title: string = '',
): void {
    toast(customToast, {
        data: {
            title: title,
            content: content,
        },
        type: type,
    });
}
