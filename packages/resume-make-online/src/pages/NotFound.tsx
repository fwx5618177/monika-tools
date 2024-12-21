import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from '@minerva/lib-core';
import styles from '@/styles/notfound.module.scss';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // 返回上一页
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FaChevronLeft className={styles.backIcon} onClick={handleBackClick} />
        <h1>{t('not-found-title')}</h1>
      </div>
      <p>{t('not-found-description')}</p>
      <Button onClick={() => navigate('/')}>{t('back-to-home')}</Button>
    </div>
  );
};

export default NotFoundPage;
