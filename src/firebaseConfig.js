import firebase from 'firebase/app';

import '@firebase/auth';
import '@firebase/firestore';
import 'firebase/firebase-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDmm5rLHsYSqEdBOzl2ZzyObiavV2CVZ_c',
  authDomain: 'buzz-b4eec.firebaseapp.com',
  projectId: 'buzz-b4eec',
  storageBucket: 'buzz-b4eec.appspot.com',
  messagingSenderId: '925276999128',
  appId: '1:925276999128:web:fdd443cec509a3771436ad',
  measurementId: 'G-MDWZ8YYVTD'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, firebaseConfig };
