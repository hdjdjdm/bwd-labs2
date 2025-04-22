import styles from './InputField.module.scss';

import React, { forwardRef, useEffect } from 'react';
import classNames from 'classnames';
import { showCustomToast } from '@utils/customToastUtils.ts';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    iconSrc?: string;
    alt?: string;
    onClickIcon?: () => void;
    errorMessage?: string;
    showErrorToast?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    (
        {
            type = 'text',
            placeholder = ' ',
            label,
            iconSrc,
            alt,
            onClickIcon,
            className,
            errorMessage,
            showErrorToast = true,
            onChange,
            onBlur,
            ...rest
        },
        ref,
    ) => {
        useEffect(() => {
            if (errorMessage && showErrorToast) {
                showCustomToast(errorMessage, 'warning');
            }
        }, [errorMessage, showErrorToast]);

        return (
            <div className={styles.inputField}>
                <input
                    ref={ref}
                    className={classNames(
                        styles.inputField__input,
                        iconSrc && styles.inputField__input_withIcon,
                        errorMessage && styles.inputField__input_warning,
                        className,
                    )}
                    type={type}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    {...rest}
                />
                <label className={styles.inputField__label}>{label}</label>
                {iconSrc && (
                    <img
                        src={iconSrc}
                        className={classNames(
                            styles.inputField__inputIcon,
                            onClickIcon &&
                                styles.inputField__inputIcon_clickable,
                            'svg-small',
                        )}
                        onClick={onClickIcon}
                        alt={alt}
                    />
                )}
                {errorMessage && !showErrorToast && (
                    <span className={styles.inputField__errorText}>
                        {errorMessage}
                    </span>
                )}
            </div>
        );
    },
);

export default InputField;
