import { RefObject, useEffect, useRef } from 'react';

const useClickOutside = (
    onClose: () => void,
    anchorRef?: RefObject<HTMLElement | null>,
) => {
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                elementRef.current &&
                !elementRef.current.contains(event.target as Node) &&
                (anchorRef?.current
                    ? !anchorRef.current.contains(event.target as Node)
                    : true)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, anchorRef]);

    return elementRef;
};

export default useClickOutside;
