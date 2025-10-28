import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import ProfileScreen from './screens/ProfileScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import BottomNav from './components/BottomNav';

export type Screen = 'Home' | 'Discover' | 'Create' | 'Profile';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeScreen, setActiveScreen] = React.useState<Screen>('Home');

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Discover':
        return <DiscoverScreen />;
      case 'Create':
        return <CreateScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  screenContainer: {
    flex: 1,
  },
});

export default App;