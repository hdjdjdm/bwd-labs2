import { useEffect, RefObject } from 'react';

const modalStack: RefObject<HTMLElement | null>[] = [];

export default function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    callback: () => void,
) {
    useEffect(() => {
        if (ref.current) {
            modalStack.push(ref);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (modalStack.length === 0) return;

            const topModalRef = modalStack[modalStack.length - 1];

            // Проверяем только верхнюю модалку
            if (
                topModalRef?.current &&
                !topModalRef.current.contains(event.target as Node)
            ) {
                modalStack.pop(); // Удаляем только верхнюю модалку
                callback(); // Закрываем только верхнюю
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);

            // Очистка модалки из стека при размонтировании
            const index = modalStack.findIndex((el) => el === ref);
            if (index !== -1) {
                modalStack.splice(index, 1);
            }
        };
    }, [ref, callback]);
}
