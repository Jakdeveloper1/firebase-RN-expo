# Firebase + Expo React Native Lab: Student Task Manager

A small app where students sign up, sign in, and manage their own tasks with
**Firebase Authentication** and **Cloud Firestore** (create, read, update, delete, live updates).

## Quick start

1. `npm install`
2. In [Firebase Console](https://console.firebase.google.com): create a project, register a **Web app**,
   enable **Authentication > Email/Password**, and create a **Firestore** database.
3. `cp .env.example .env` and paste your Web app config values.
4. Paste `firestore.rules` into **Firestore > Rules** and click **Publish**.
5. `npx expo start`, then scan the QR code with Expo Go (or press `w` for web).

After editing `.env`, restart with `npx expo start -c`.

## Project layout

| File | Purpose |
|---|---|
| `src/firebase.js` | Initialises Firebase; exports `auth` and `db` |
| `App.js` | Watches auth state; shows sign-in or tasks screen |
| `src/screens/AuthScreen.js` | Sign-up and sign-in |
| `src/screens/TasksScreen.js` | CRUD on `users/{uid}/tasks` with `onSnapshot` |
| `firestore.rules` | Authentication, ownership and validation rules |

## Security check

Create two accounts and confirm neither can see the other's tasks. Use the Rules Playground to
confirm that reading another user's `users/<uid>/tasks/...` path is denied.

## Challenges

- Edit a task title with `updateDoc`.
- Filter pending/completed tasks with `where('done', '==', false)`.
- Add a due date and validate it in the rules.

Firebase config values are not secrets; Security Rules protect the data. Never commit `.env`.
