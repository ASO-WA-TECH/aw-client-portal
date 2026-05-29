import * as Sentry from "@sentry/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return result;
    } catch (error) {
      Sentry.captureException(error, {
        tags: { flow: "signup" },
        extra: { email },
        level: "error",
      });
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // identify the user in Sentry once logged in
      Sentry.setUser({
        email: result.user.email ?? undefined,
        id: result.user.uid,
      });
      return result;
    } catch (error) {
      Sentry.captureException(error, {
        tags: { flow: "login" },
        extra: { email },
        level: "warning",
      });
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      Sentry.setUser(null); // clear user context on logout
    } catch (error) {
      Sentry.captureException(error, {
        tags: { flow: "logout" },
        level: "error",
      });
      throw error;
    }
  }

  async function deleteAccount() {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      Sentry.setUser(null);
    } catch (error) {
      Sentry.captureException(error, {
        tags: { flow: "deleteAccount" },
        level: "error",
      });
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      //  restores user context if they're already logged in (page refresh etc.)
      if (user) {
        Sentry.setUser({ email: user.email ?? undefined, id: user.uid });
      } else {
        Sentry.setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
