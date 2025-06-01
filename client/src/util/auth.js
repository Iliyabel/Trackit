import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

class AuthService {
    currentUser = null;

    constructor() {
    // Automatically set currentUser if already logged in
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }

    register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                this.currentUser = userCredential.user;
                return this.currentUser;
            })
            .catch((error) => {
                throw new Error(`Error ${error.code}: ${error.message}`);
            });
    }

    login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                this.currentUser = userCredential.user;
                return this.currentUser;
            })
            .catch((error) => {
                throw new Error(`Error ${error.code}: ${error.message}`);
            });
    }

    logout() {
        return auth.signOut()
            .then(() => {
                this.currentUser = null;
            })
            .catch((error) => {
                throw new Error(`Error ${error.code}: ${error.message}`);
            });
    }

    resetPassword(email) {
        return auth.sendPasswordResetEmail(email);
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getToken() {
        if (this.currentUser) {
            return this.currentUser.getIdToken();
        } else {
            throw new Error('No user is currently logged in.');
        }
    }
}

export default new AuthService();
