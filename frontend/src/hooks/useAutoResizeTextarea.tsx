import { useEffect, useRef } from 'react';

export function useAutoResizeTextarea(value: string | null | undefined) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight + 5}px`;
        }
    }, [value]);

    return textareaRef;
}
