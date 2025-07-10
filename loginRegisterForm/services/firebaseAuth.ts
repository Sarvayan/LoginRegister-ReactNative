import { initializeApp, getApps } from 'firebase/app';
import {
  
  initializeAuth,
  
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyB8-yt82CniKgBjJNuL4aEbeUVlrscoFe8",
  authDomain: "react-native-auth-demo-47d21.firebaseapp.com",
  projectId: "react-native-auth-demo-47d21",
  storageBucket: "react-native-auth-demo-47d21.appspot.com",
  messagingSenderId: "146118376698",
  appId: "1:146118376698:web:e0c9465a6810427b069d43",
};


  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app)
   

export default auth;
