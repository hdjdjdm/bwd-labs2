import styles from './FeatureBlock.module.scss';
import * as React from 'react';
import classNames from 'classnames';

interface FeatureBlockProps {
    title: string;
    description: string;
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({ title, description }) => {
    return (
        <div className={classNames(styles.featureBlock, 'block', 'container')}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default FeatureBlock;
