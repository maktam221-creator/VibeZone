import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CreateScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>شارك قصتك الجديدة</Text>
      <Text style={styles.subtitle}>اختر فيديو من معرض الصور أو سجل واحداً الآن</Text>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonIcon}>🖼️</Text>
        <Text style={styles.buttonText}>اختر من المعرض</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cameraButton]}>
        <Text style={styles.buttonIcon}>🎥</Text>
        <Text style={styles.buttonText}>سجل بالكاميرا</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#222',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  cameraButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateScreen;
