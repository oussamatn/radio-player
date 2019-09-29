import * as firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/firestore';


let firebaseConfig = {
    apiKey: "AIzaSyDDl2wq1jR0sL61QLUi121cUnOdriAcpcA",
    authDomain: "joujmafm.firebaseapp.com",
    databaseURL: "https://joujmafm.firebaseio.com",
    projectId: "joujmafm",
    storageBucket: "joujmafm.appspot.com",
    messagingSenderId: "269224550083",
    appId: "1:269224550083:web:f8b8cedb53112e89314c76",
    measurementId: "G-03546ZXPYE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
if (firebase.messaging.isSupported()){
    const messaging = firebase.messaging();

    messaging.usePublicVapidKey("BGwgmlTd-J5Xeg7Z2ST2ztIS6XuTOY0r2GG8t4AFw9SE4mhaq0C-9xvUdsb1VE9a32WxeHMKgSzHTWl3GmD5V18"); // 1. Generate a new key pair

    // Request Permission of Notifications
    messaging.requestPermission().then(() => {
    console.log('Notification permission granted.');
    // Get TokenNew content is available
    messaging.getToken().then((currentToken) => {
        console.log(currentToken);
        if (currentToken) {
            db.collection('notificationTokens').where('token', '==', currentToken).get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty)
                        sendTokenToServer(currentToken);
                })
                .catch((error) => {
                    console.error('>> error ', error);
                });
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        console.log('Error retrieving Instance ID token. ', err);

    });
}).catch((err) => {
    console.log('Unable to get permission to notify.', err);
});
}
const sendTokenToServer = (token) => {
    db.collection('notificationTokens').add({token,})
        .then(() => {
            console.log('Document successfully written!');
        }).catch((error) => {
        console.error('Error writing document: ', error);
    });
};