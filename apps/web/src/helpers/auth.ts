import type { FirestoreAuthUserData } from "@melo/types";
import { GoogleAuthProvider, signInWithPopup, type Auth, type User } from "firebase/auth";
import { 
  collection,
  doc, 
  Firestore, 
  getDocs, 
  query, 
  setDoc,
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
    
    return snapshot.docs.length > 0 ? snapshot.docs[0].data() as FirestoreAuthUserData : null;
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
    // collection("users")
    await setDoc(doc(firestore, "users", crypto.randomUUID()), {
      role: "admin",
      username: name,
      __auth_uid: user.uid,
    });
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
    
      const user = await signInWithPopup(auth, authProvider);
      await createUserDataInFirestore(firestore, user.user, user.user.displayName ?? "No Name")
  
      return [user.user, null];
    } catch(e) {
      return [null, e];
    }
  }
}

export default AuthHelpers;