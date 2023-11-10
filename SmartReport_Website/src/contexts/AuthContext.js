import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  // function signup(email, password) {
  //   return auth.createUserWithEmailAndPassword(email, password)
  // }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    // signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// async function signup(email, password, role, name, phoneNumber, department) {
//   try {
//     // Create a new user using the Firebase Admin SDK
//     const userRecord = await createUser({
//       email: email,
//       emailVerified: false,
//       phoneNumber: phoneNumber,
//       password: password,
//       displayName: name,
//       disabled: false,
//     });

//     const userId = userRecord.uid;

//     // After successful user creation, you can save additional user data
//     // to Firestore or your preferred database.

//     // Return the user's UID for further reference, if needed.
//     return userId;
//   } catch (error) {
//     // Handle the error if user creation fails
//     throw error;
//   }
// }
