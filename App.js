import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase';
import AuthScreen from './src/screens/AuthScreen';
import TasksScreen from './src/screens/TasksScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // Firebase tells us whenever the signed-in user changes (sign-in, sign-out, restore).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  if (checking) {
    return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" /></View>;
  }
  return (
    <>
      <StatusBar style="dark" />
      {user ? <TasksScreen user={user} /> : <AuthScreen />}
    </>
  );
}
