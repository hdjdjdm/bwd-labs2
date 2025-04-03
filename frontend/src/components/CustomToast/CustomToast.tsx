import styles from './CustomToast.module.scss';
import { ToastContentProps } from 'react-toastify';

type customToastProps = ToastContentProps<{
    title: string;
    content: string;
}>;

const CustomToast = ({ data }: customToastProps) => {
    return (
        <div className={styles.customToast}>
            <h4 className={styles.customToast__title}>{data.title}</h4>
            <p className={styles.customToast__content}>{data.content}</p>
        </div>
    );
};

export default CustomToast;
