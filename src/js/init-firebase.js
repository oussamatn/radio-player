

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
const defaultProject = firebase.initializeApp(firebaseConfig);

console.log(defaultProject);  // "[DEFAULT]"

  // Option 1: Access Firebase services via the defaultProject variable

  var defaultFirestore = defaultProject.firestore();

  // Option 2: Access Firebase services using shorthand notation
/*  defaultStorage = firebase.storage();
  defaultFirestore = firebase.firestore();
*/

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            var user = authResult.user;
            var credential = authResult.credential;
            var isNewUser = authResult.additionalUserInfo.isNewUser;
            var providerId = authResult.additionalUserInfo.providerId;
            var operationType = authResult.operationType;
            document.getElementById('sidebar').style.display = 'block';
            // Do something with the returned AuthResult.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        signInFailure: function (error) {
            // Some unrecoverable error occurred during sign-in.
            // Return a promise when error handling is completed and FirebaseUI
            // will reset, clearing any UI. This commonly occurs for error code
            // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
            // occurs. Check below for more details on this.
            //return handleUIError(error);
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('sidebar').style.display = 'none';
        }
    },
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
};
console.log("firebase init file");
// Initialize the FirebaseUI widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
       // return firebase.auth().signInWithRedirect(provider);
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });