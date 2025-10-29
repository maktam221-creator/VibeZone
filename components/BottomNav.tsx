import React from 'react';

type Screen = 'Home' | 'Discover' | 'Create' | 'Profile';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const HomeIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={active ? 'white' : 'grey'}>
        <path d="M220-180h150v-250h220v250h150v-410L480-740 220-590v410Zm-60 60v-530l320-220 320 220v530H620v-250H340v250H160Zm320-350Z"/>
    </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={active ? 'white' : 'grey'}>
        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
    </svg>
);

const CreateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36" fill="white">
        <path d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z"/>
    </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={active ? 'white' : 'grey'}>
        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
    </svg>
);


const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <nav style={styles.nav}>
      <div style={styles.navItem} onClick={() => setActiveScreen('Home')}>
        <HomeIcon active={activeScreen === 'Home'} />
        <span style={{...styles.navText, color: activeScreen === 'Home' ? 'white' : 'grey'}}>الرئيسية</span>
      </div>
      <div style={styles.navItem} onClick={() => setActiveScreen('Discover')}>
        <SearchIcon active={activeScreen === 'Discover'} />
        <span style={{...styles.navText, color: activeScreen === 'Discover' ? 'white' : 'grey'}}>اكتشف</span>
      </div>
      <div style={styles.createButton} onClick={() => setActiveScreen('Create')}>
        <CreateIcon />
      </div>
      <div style={styles.navItem} onClick={() => setActiveScreen('Profile')}>
        <UserIcon active={activeScreen === 'Profile'} />
        <span style={{...styles.navText, color: activeScreen === 'Profile' ? 'white' : 'grey'}}>ملفي</span>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #222',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'grey',
  },
  navText: {
    fontSize: '10px',
    marginTop: '2px',
  },
  createButton: {
    width: '50px',
    height: '35px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'black',
    border: '2px solid black',
    boxSizing: 'border-box'
  },
};

export default BottomNav;
