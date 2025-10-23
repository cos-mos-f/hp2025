import React from 'react';
import styles from '../styles/Line.module.css';

type LineProps = {
  isActive: boolean;
};

const Line: React.FC<LineProps> = ({isActive}) => {
  return (
    <div className={`${styles.Line} ${isActive ? styles.active : ''}`}>
    </div>
  );
};

export default Line;