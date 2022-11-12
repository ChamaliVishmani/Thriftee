import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (error) {
            console.log(error);
          }
        },
        googleSignUp: async () => {
          try {
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();
            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            //return auth().signInWithCredential(googleCredential);

            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(googleCredential)
              // Use it only when user Sign's up,
              // so create different social signup function
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                // console.log('current User', auth().currentUser);
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    email: auth().currentUser.email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                    businessOrPersonal: 'Personal',
                    latitude: 37.78825,
                    longitude: -122.4324,
                  })
                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log(error);
          }
        },
        register: async (email, password) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    email: email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                    businessOrPersonal: 'Personal',
                    latitude: 37.78825,
                    longitude: -122.4324,
                  })
                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log(error);
          }
        },
        googleLogin: async () => {
          try {
            const {idToken} = await GoogleSignin.signIn();
            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);
            // Sign-in the user with the credential
            //return auth().signInWithCredential(googleCredential);

            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(googleCredential)
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: '',
                    lname: '',
                    email: googleCredential,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                    businessOrPersonal: 'Personal',
                    latitude: 37.78825,
                    longitude: -122.4324,
                  })
                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    );
                  });
              })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log(error);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (error) {
            console.log(error);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
  //   const [user, setUser] = useState(null);
  // <AuthContext.Provider
  // value={{
  //   user,
  //   setUser,
  //   login: async (email, password) => {
  //     try {
  //       await auth().signInWithEmailAndPassword(email, password);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // googleLogin: async () => {
  //   try {
  //     // Get the users ID token
  //     const {idToken} = await GoogleSignin.signIn();
  //     // Create a Google credential with the token
  //     const googleCredential =
  //       auth.GoogleAuthProvider.credential(idToken);
  //     // Sign-in the user with the credential
  //     return auth().signInWithCredential(googleCredential);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  //   register: async (email, password) => {
  //     try {
  //       await auth().createUserWithEmailAndPassword(email, password);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   logout: async () => {
  //     try {
  //       await auth().signOut();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //       }}>
  //       {children}
  //</AuthContext.Provider>
  //    );
};
