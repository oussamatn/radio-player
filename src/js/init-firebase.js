/*
import firebase from 'firebase/app';
import 'firebase/messaging';
//import 'firebase/firestore';
import Firestore from 'firebase-firestore-lite';

import config from '../../public/assets/config.json';

firebase.initializeApp(config.firebaseConfig);
//const db = firebase.firestore();
const db = new Firestore({ projectId: 'joujmafm' });
if (firebase.messaging.isSupported()){
    const messaging = firebase.messaging();

    messaging.usePublicVapidKey(config.firebaseConfig.PublicVapidKey); // 1. Generate a new key pair

    // Request Permission of Notifications
    messaging.requestPermission().then(() => {
    console.log('Notification permission granted.');
    // Get TokenNew content is available
    messaging.getToken().then((currentToken) => {
        //console.log(currentToken);
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
};*/
