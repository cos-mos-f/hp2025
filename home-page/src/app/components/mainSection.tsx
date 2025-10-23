import React, { useEffect, useState } from 'react';
import styles from '../styles/mainSection.module.css';
import LineText from './lineText';
import Line from './line';
type MainSectionProps = {
  pageType: string;
  setPageType: (pageType: string) => void;
};

const MainSection: React.FC<MainSectionProps> = ({ pageType, setPageType }) => {
  const [isGallery, setIsGallery] = useState(false);
  const [isContact, setIsContact] = useState(false);
  useEffect(()=>{
    if(pageType=="Gallery"){
      setIsContact(false);
      setIsGallery(true);
    }
    if(pageType=="Contact"){
      setIsContact(true);
      setIsGallery(false);
    }
    if(pageType=="artBoard"){
      setIsContact(false);
      setIsGallery(false);
    }
  },[pageType])
  return (
    <div className={styles.mainSection}>
      <button onClick={()=>setPageType("artBoard")} className={styles.Title}>cosmos<br/>gallery</button>
      <div className={styles.TextFrame}>
        <LineText 
        onClick={() => setPageType("Gallery")}
        isActive={isGallery}
          >works</LineText>
        <Line isActive={isGallery}/>
      </div>
      <div className={styles.TextFrame}>
        <LineText 
        onClick={() => setPageType("Contact")}
        isActive={isContact}
          >contact</LineText>
        <Line isActive={isContact}/>
      </div>
    </div>
  );
};

export default MainSection;
