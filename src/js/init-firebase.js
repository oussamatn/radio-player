import * as firebase from 'firebase/app';
import 'firebase/messaging';

let firebaseConfig;
firebaseConfig = {
    apiKey: "AIzaSyDDl2wq1jR0sL61QLUi121cUnOdriAcpcA",
    authDomain: "joujmafm.firebaseapp.com",
    databaseURL: "https://joujmafm.firebaseio.com",
    projectId: "joujmafm",
    storageBucket: "joujmafm.appspot.com",
    messagingSenderId: "269224550083",
    appId: "1:269224550083:web:9fa80b0fb732dfe4"
};
/*
 // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
 // The Firebase SDK is initialized and available here!
 firebase.auth().onAuthStateChanged(user => { });
 firebase.database().ref('/path/to/ref').on('value', snapshot => { });
 firebase.messaging().requestPermission().then(() => { });
 firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
 // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
   Initialize Firebase with a "default" Firebase project
*/
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.usePublicVapidKey("BGwgmlTd-J5Xeg7Z2ST2ztIS6XuTOY0r2GG8t4AFw9SE4mhaq0C-9xvUdsb1VE9a32WxeHMKgSzHTWl3GmD5V18"); // 1. Generate a new key pair

// Request Permission of Notifications
messaging.requestPermission().then(() => {
    console.log('Notification permission granted.');
    // Get Token
    messaging.getToken().then((token) => {
        console.log(token)
    })
}).catch((err) => {
    console.log('Unable to get permission to notify.', err);
});