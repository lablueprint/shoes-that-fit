import React from 'react';
import {
  User, GraduationCap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Portal.module.css';

function Portal() {
  return (
    <div className={styles.portalContainer}>
      <div className={styles.options}>
        <div className={styles.column}>
          <h1> Are you an educator or an admin? </h1>
          <div className={styles.center}>
            <div className={styles.column}>
              <Link to="/login" state={{ role: 'Admin' }}>
                <button type="button">
                  <User size={100} />
                </button>
              </Link>
              <h2>Admin </h2>
            </div>
            <div className={styles.column}>
              <Link to="/login" state={{ role: 'Educator' }}>
                <button type="button">
                  <GraduationCap size={100} />
                </button>
              </Link>
              <h2>Educator</h2>
            </div>
          </div>

        </div>
      </div>

    </div>

  );
}

export default Portal;
