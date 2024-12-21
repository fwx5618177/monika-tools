import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import Logo from '@/components/Logo';
import { useTranslation } from 'react-i18next';
import styles from '@/styles/app.module.scss';

const App = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNext = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={handleNext}>
        <FaChevronRight className={styles.arrow} />
      </div>

      <div className={styles.logo}>
        <Logo size="medium" />
        <h2>{t('title')}</h2>
      </div>

      <div className={styles.rocketBox}>
        <img className={styles.rocket} src="/index_rocket.svg" alt="rocket" />
      </div>

      <div className={styles.instro}>
        <h2>What can this bot do?</h2>
        <span>
          Tap to launch your rockets! Roam globally with your free eSIMs to fuel
          the next Starlink satellite network. Deploy your mining. power, invite
          friends, and inscribe your footprints to become the Overlord of the
          Galaxy.
        </span>
      </div>

      <button className={styles.stepNext} onClick={handleNext}>
        Step
      </button>

      <div className={styles.mention}>
        <h2>July 18</h2>
        <span>
          You allowed this bot to message you when you logged in on "DepinSim"
          app.
        </span>
      </div>
    </div>
  );
};

export default App;
