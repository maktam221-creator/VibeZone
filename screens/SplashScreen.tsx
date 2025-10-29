import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.logo}>VidFlow</h1>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000',
  },
  logo: {
    fontSize: '48px',
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: '2px',
    animation: 'fadeIn 2s ease-in-out',
  },
};

const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);


export default SplashScreen;
