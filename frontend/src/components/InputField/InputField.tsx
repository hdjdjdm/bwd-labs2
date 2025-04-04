import styles from './InputField.module.scss';
import React from 'react';
import classNames from 'classnames';

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
    const inputValue =
        type === 'date' && value instanceof Date
            ? value.toISOString().split('T')[0]
            : value;

    return (
        <div className={styles.inputField}>
            <input
                className={classNames(
                    styles.inputField__input,
                    iconSrc && styles.inputField__input_withIcon,
                    disabled && styles.inputField__input_disabled,
                )}
                type={type}
                value={inputValue as string}
                onChange={onChange}
                placeholder={placeholder}
                minLength={type === 'password' ? 6 : 3}
                maxLength={maxLength}
                required={required}
                disabled={disabled}
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
