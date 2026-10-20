import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function TasksScreen({ user }) {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  // Path: users/{uid}/tasks  -> every user has their own "tasks" subcollection.
  const tasksRef = collection(db, 'users', user.uid, 'tasks');

  // READ (real-time): onSnapshot runs now and again whenever the data changes.
  useEffect(() => {
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => Alert.alert('Could not load tasks', err.code)
    );
    return unsubscribe; // IMPORTANT: stop listening on unmount (saves reads/cost)
  }, [user.uid]);

  // CREATE
  const addTask = async () => {
    const t = title.trim();
    if (!t) return;
    try {
      await addDoc(tasksRef, { title: t, done: false, createdAt: serverTimestamp() });
      setTitle('');
    } catch (e) {
      Alert.alert('Could not save', e.code ?? e.message);
    }
  };

  // UPDATE
  const toggleDone = (task) =>
    updateDoc(doc(db, 'users', user.uid, 'tasks', task.id), { done: !task.done }).catch((e) =>
      Alert.alert('Could not update', e.code)
    );

  // DELETE
  const removeTask = (task) =>
    deleteDoc(doc(db, 'users', user.uid, 'tasks', task.id)).catch((e) =>
      Alert.alert('Could not delete', e.code)
    );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>My tasks</Text>
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Text style={s.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.email}>{user.email}</Text>

      <View style={s.row}>
        <TextInput style={s.input} placeholder="New task…" value={title} onChangeText={setTitle} onSubmitEditing={addTask} />
        <TouchableOpacity style={s.add} onPress={addTask}>
          <Text style={s.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        ListEmptyComponent={<Text style={s.empty}>No tasks yet. Add your first one!</Text>}
        renderItem={({ item }) => (
          <View style={s.card}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleDone(item)}>
              <Text style={[s.taskText, item.done && s.done]}>{item.done ? '✓ ' : '○ '}{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeTask(item)}>
              <Text style={s.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 56, backgroundColor: '#f6f7fb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#1b2559' },
  signOut: { color: '#c92a2a', fontWeight: '600' },
  email: { color: '#586086', marginBottom: 16, marginTop: 2 },
  row: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#dfe3f0' },
  add: { backgroundColor: '#3b5bdb', paddingHorizontal: 18, justifyContent: 'center', borderRadius: 10, marginLeft: 8 },
  addText: { color: '#fff', fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#e8ebf5' },
  taskText: { fontSize: 16, color: '#1b2559' },
  done: { textDecorationLine: 'line-through', color: '#9aa1c0' },
  delete: { color: '#c92a2a', marginLeft: 12 },
  empty: { textAlign: 'center', color: '#9aa1c0', marginTop: 40 },
});
