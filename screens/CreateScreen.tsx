import React from 'react';

const CreateScreen: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.text}>Create</h1>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: '24px',
  },
};

export default CreateScreen;
