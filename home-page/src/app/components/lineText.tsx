import React from 'react';
import styles from '../styles/LineText.module.css';

type LineTextProps = {
onClick: ()=>void;
  children: React.ReactNode;
  isActive?: boolean;
};

const LineText: React.FC<LineTextProps> = ({ onClick, children, isActive = false }) => {
  return (
    <button onClick={() =>onClick()} className={`${styles.LineText} ${isActive ? styles.active : ''}`}>
      {children}
    </button>
  );
};

export default LineText;
