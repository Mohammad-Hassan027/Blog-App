import { create } from "zustand";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // sendSignInLinkToEmail,
  // isSignInWithEmailLink,
  // signInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  GithubAuthProvider,
} from "firebase/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

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

    return () => unsubscribe();
  },

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

  // sendMagicLink: async (email) => {
  //   try {
  //     set({ loading: true, error: null });
  //     const actionCodeSettings = {
  //       // URL you want to redirect back to
  //       url: window.location.origin + "/login",
  //       handleCodeInApp: true,
  //     };

  //     await sendSignInLinkToEmail(auth, email, actionCodeSettings);

  //     // Save the email locally for later sign-in.
  //     localStorage.setItem("emailForSignIn", email);

  //     set({ loading: false, error: null });
  //     return true; // Indicate success
  //   } catch (error) {
  //     set({ error: error.message, loading: false });
  //     throw error;
  //   }
  // },

  // // 2. Function to complete sign-in from the link
  // checkMagicLink: async (url) => {
  //   if (isSignInWithEmailLink(auth, url)) {
  //     let email = localStorage.getItem("emailForSignIn");
  //     if (!email) {
  //       // You might prompt the user for their email here if it's missing
  //       // For simplicity, we'll throw an error
  //       set({
  //         error: "Sign in attempt failed. Please re-enter your email.",
  //         loading: false,
  //       });
  //       return;
  //     }

  //     try {
  //       set({ loading: true, error: null });
  //       const userCredential = await signInWithEmailLink(auth, email, url);

  //       // Clear email from storage
  //       localStorage.removeItem("emailForSignIn");

  //       // Update store state and fetch token as in existing init/login flow
  //       const user = userCredential.user;
  //       const token = await user.getIdToken();
  //       set({
  //         user: {
  //           uid: user.uid,
  //           email: user.email,
  //           displayName: user.displayName,
  //           photoURL: user.photoURL,
  //           token,
  //         },
  //         loading: false,
  //         error: null,
  //       });
  //     } catch (error) {
  //       set({ error: error.message, loading: false });
  //       throw error;
  //     }
  //   }
  // },

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
  signInWithGithub: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GithubAuthProvider();
      // Optional: Add scopes if you need more user data (e.g., private repos)
      // provider.addScope("user");

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const token = await user.getIdToken();

      set({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0], // GitHub user might not have an email or display name set
          photoURL: user.photoURL,
          token,
        },
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

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

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
