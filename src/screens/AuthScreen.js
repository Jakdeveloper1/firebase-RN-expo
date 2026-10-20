import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Enter an email and a password of at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password); // sign-up
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password); // sign-in
      }
      // No navigation needed: onAuthStateChanged in App.js switches the screen.
    } catch (e) {
      Alert.alert('Authentication failed', e.code ?? e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Student Task Manager</Text>
      <Text style={s.sub}>{isSignUp ? 'Create an account' : 'Sign in to continue'}</Text>
      <TextInput style={s.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password (min 6 chars)" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={s.button} onPress={submit} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>{isSignUp ? 'Sign up' : 'Sign in'}</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={s.link}>{isSignUp ? 'Have an account? Sign in' : 'New here? Create an account'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f6f7fb' },
  title: { fontSize: 28, fontWeight: '700', color: '#1b2559' },
  sub: { fontSize: 15, color: '#586086', marginBottom: 20, marginTop: 4 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#dfe3f0' },
  button: { backgroundColor: '#3b5bdb', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#3b5bdb', textAlign: 'center', marginTop: 18 },
});
