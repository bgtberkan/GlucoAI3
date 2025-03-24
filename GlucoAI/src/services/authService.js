import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error) {
    return {
      code: error.code,
      message: error.message
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    return {
      code: error.code,
      message: error.message
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    return {
      code: error.code,
      message: error.message
    };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
}; 