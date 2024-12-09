import styles from './ProfileSection.module.scss';

const ProfileSection = ({ children, className = '' }) => {
  return (
    <div style={{}} className={`${styles.container} ${styles[className]}`}>
      {children}
    </div>
  );
};

export default ProfileSection;
