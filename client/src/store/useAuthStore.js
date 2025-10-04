import { create } from "zustand";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  // Initialize auth state listener
  init: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get the ID token for backend requests
        user.getIdToken().then((token) => {
          set({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              token,
            },
            loading: false,
            error: null,
          });
        });
      } else {
        set({ user: null, loading: false, error: null });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  },

  // Register with email/password
  register: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      set({
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          token,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Login with email/password
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      set({
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          token,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Google Sign In
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();

      set({
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          token,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update Profile
  updateProfile: async (profileData) => {
    try {
      set({ loading: true, error: null });
      const user = auth.currentUser;
      if (user) {
        await firebaseUpdateProfile(user, profileData);
        const token = await user.getIdToken(true); // Force refresh token
        set({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            token,
          },
          loading: false,
        });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
