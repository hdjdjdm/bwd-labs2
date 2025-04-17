import styles from './InputField.module.scss';
import React, { useRef } from 'react';
import classNames from 'classnames';
import { showCustomToast } from '@utils/customToastUtils.ts';

interface InputFieldProps {
    type: string;
    value: string | Date;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label: string;
    iconSrc?: string;
    alt?: string;
    onClickIcon?: () => void;
    required?: boolean;
    maxLength?: number;
    disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    type,
    value,
    onChange,
    placeholder = ' ',
    label,
    iconSrc,
    alt,
    onClickIcon,
    maxLength,
    required = false,
    disabled = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const inputValue =
        type === 'date' && value instanceof Date
            ? value.toISOString().split('T')[0]
            : value;

    const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const validity = e.currentTarget.validity;
        if (validity.valid) {
            inputRef.current?.classList.remove(
                styles.inputField__input_warning,
            );
            return;
        }

        inputRef.current?.classList.add(styles.inputField__input_warning);
        if (validity.valueMissing) {
            showCustomToast(`Field "${label}" is required.`, 'warning');
        } else if (validity.typeMismatch && type === 'email') {
            showCustomToast('Incorrect email.', 'warning');
        } else if (validity.tooLong) {
            showCustomToast(
                `Max length — ${maxLength} characters long.`,
                'warning',
            );
        } else if (validity.tooShort) {
            showCustomToast(
                `Min length — ${e.currentTarget.minLength} characters long.`,
                'warning',
            );
        } else {
            showCustomToast(`Incorrect input for field "${label}".`, 'warning');
        }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.validity.valid) {
            inputRef.current?.classList.remove(
                styles.inputField__input_warning,
            );
        }
        onChange(e as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className={styles.inputField}>
            <input
                ref={inputRef}
                className={classNames(
                    styles.inputField__input,
                    iconSrc && styles.inputField__input_withIcon,
                    disabled && styles.inputField__input_disabled,
                )}
                type={type}
                value={inputValue as string}
                onChange={handleInput}
                placeholder={placeholder}
                minLength={type === 'password' ? 6 : 3}
                maxLength={maxLength}
                required={required}
                disabled={disabled}
                onInvalid={handleInvalid}
            />
            <label className={styles.inputField__label}>{label}</label>
            <img
                src={iconSrc}
                className={classNames(
                    styles.inputField__inputIcon,
                    onClickIcon && styles.inputField__inputIcon_clickable,
                    'svg-small',
                )}
                onClick={onClickIcon}
                alt={alt}
            />
        </div>
    );
};

export default InputField;
