import styles from '@components/Switch/CustomSwitch.module.scss';
import React from 'react';
import classNames from 'classnames';

type CustomSwitchProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    checkedIcon?: string;
    nonCheckedIcon?: string;
};

const CustomSwitch: React.FC<CustomSwitchProps> = ({
    checked,
    onChange,
    checkedIcon,
    nonCheckedIcon,
}) => {
    const handleToggle = () => {
        onChange(!checked);
    };

    return (
        <label className={styles.customSwitch}>
            <input
                className={styles.customSwitch__input}
                type="checkbox"
                checked={checked}
                onChange={handleToggle}
            />
            <span className={styles.customSwitch__slider}>
                {(checkedIcon || nonCheckedIcon) && (
                    <img
                        className={classNames(
                            styles.customSwitch__icon,
                            'svg-small',
                            checked
                                ? classNames(
                                      styles.customSwitch__icon_checked,
                                      'svg-white',
                                  )
                                : styles.customSwitch__icon_nonChecked,
                        )}
                        src={checked ? checkedIcon : nonCheckedIcon}
                        alt="publicIcon"
                    />
                )}
            </span>
        </label>
    );
};

export default CustomSwitch;
