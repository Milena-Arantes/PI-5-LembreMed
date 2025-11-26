// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

import {
  // @ts-ignore 
  getReactNativePersistence, //dá erro sem o ts-ignore pq os types ainda nao reconhecem essa funcao, o ts ignore vai ignorar o erro 
  initializeAuth
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIUiBVc5CpqbrYw8ORVGrtntlXajGfnTE",
  authDomain: "pi5-1-2b9ca.firebaseapp.com",
  projectId: "pi5-1-2b9ca",
  storageBucket: "pi5-1-2b9ca.firebasestorage.app",
  messagingSenderId: "489473717650",
  appId: "1:489473717650:web:377e8b8f99e034c10b3d4b",
  measurementId: "G-10438L2QDC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// (tenta) inicializar o auth com persistência no AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// exporta o firestore (banco de dados na nuvem)
export const db = getFirestore(app);