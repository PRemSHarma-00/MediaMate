import { create } from "zustand";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signup: async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});

export default useAuthStore;
