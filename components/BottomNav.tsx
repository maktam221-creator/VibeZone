import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Screen } from '../App';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems: { name: Screen, icon: string }[] = [
    { name: 'Home', icon: '🏠' },
    { name: 'Discover', icon: '🔍' },
    { name: 'Create', icon: '➕' },
    { name: 'Profile', icon: '👤' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => setActiveScreen(item.name)}
          >
            <Text style={[
                styles.icon, 
                item.name === 'Create' && styles.createIcon,
                activeScreen === item.name && styles.activeIcon,
                activeScreen === item.name && item.name === 'Create' && styles.activeCreateIcon,
              ]}>
              {item.icon}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 26,
    color: '#888',
  },
  activeIcon: {
     transform: [{ scale: 1.1 }],
     color: '#FFF',
  },
  createIcon: {
    fontSize: 30,
    backgroundColor: '#FFF',
    color: '#000',
    width: 50,
    height: 35,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 35,
    overflow: 'hidden'
  },
  activeCreateIcon: {
    backgroundColor: '#FF6B35',
    color: '#FFF',
  }
});

export default BottomNav;