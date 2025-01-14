import type { FirestoreAuthUserData } from "@melo/types";
import { FirebaseError } from "firebase/app";
import { AuthCredential, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signInWithPopup, signOut, type Auth, type User } from "firebase/auth";
import { 
  addDoc,
  collection,
  Firestore, 
  getDocs, 
  query, 
  where, 
} from "firebase/firestore";

namespace AuthHelpers {
  /**
   * 
   * @param firestore Firestore Instance
   * @param uid The UID of the user the function is trying to check for
   * @returns Boolean where true means the user already exists
   */
  export async function tryGetExistingUserFromFirestore(firestore: Firestore, uid: string): Promise<FirestoreAuthUserData | null> {
    const userCollectionsRef = collection(firestore, "users");
    const q = query(userCollectionsRef, where("__auth_uid", "==", uid));
    const snapshot = await getDocs(q);
    
    if ( snapshot.docs.length <= 0 ) return null;
    
    return {
      ...(snapshot.docs[0].data() as Omit<FirestoreAuthUserData, "id">),
      id: snapshot.docs[0].id,
    }
  }
  

  /**
   * Creates user data in Firestore if the user does not already exist.
   *
   * This function checks if a user with the given UID already exists in the Firestore.
   * If the user does not exist, it creates a new document in the "users" collection
   * with the provided user information.
   *
   * @param {Firestore} firestore - The Firestore instance to interact with.
   * @param {User} user - The user object containing user details.
   * @param {string} name - The name to be assigned to the user.
   * @returns {Promise<void>} A promise that resolves when the user data is created.
   */
  export async function createUserDataInFirestore(firestore: Firestore, user: User, name: string): Promise<void> {
    // Check for existing users before signing in
    const firestoreUserData = await tryGetExistingUserFromFirestore(firestore, user.uid);
    if ( firestoreUserData ) return;
    
    // Create a users collection in firestore collection
    await addDoc(collection(firestore, "users"), {
      role: "admin",
      username: name,
      __auth_uid: user.uid,
    });
  }
  
  export async function signUpUserWithEmailAndPassword(auth: Auth, firestore: Firestore, username: string, email: string, password: string) {
    // Check for existing user
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      await createUserDataInFirestore(firestore, user.user, username);

      await signInWithEmailAndPassword(auth, email, password);
      
    } catch(e) {
      if ( e instanceof FirebaseError ) {
        return e.code;
      }
      return "5XX_INTERNAL_ERROR";
    }
  }

  
  /**
   * Signs up a user using Google authentication and creates user data in Firestore.
   *
   * @param auth - The Firebase Auth instance.
   * @param firestore - The Firestore instance.
   * @returns A promise that resolves to a tuple containing the authenticated user or null, and an error or null.
   *
   * @example
   * ```typescript
   * const [user, error] = await signUpUserWithGoogle(auth, firestore);
   * if (user) {
   *   console.log("User signed up:", user);
   * } else {
   *   console.error("Error signing up:", error);
   * }
   * ```
   */
  export async function signUpUserWithGoogle(
    auth: Auth,
    firestore: Firestore,
  ): Promise<[User | null, unknown | null]> {
    try {
      const authProvider = new GoogleAuthProvider();
      authProvider.addScope("profile")
      authProvider.addScope("email")
    
      const userCreds = await signInWithPopup(auth, authProvider);
      const authCreds = await GoogleAuthProvider.credentialFromResult(userCreds);
      
      // Need to wait for the data to be created in firestore
      await signOut(auth);
      await createUserDataInFirestore(firestore, userCreds.user, userCreds.user.displayName ?? "No Name")

      await signInWithCredential(auth, authCreds as AuthCredential);
  
      return [userCreds.user, null];
    } catch(e) {
      return [null, e];
    }
  }
}

export default AuthHelpers;