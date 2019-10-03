/*
if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
     navigator.serviceWorker.register('service-worker.js').then(registration => {
       console.log('SW registered: ', registration);
     }).catch(registrationError => {
       console.log('SW registration failed: ', registrationError);
     });
   });
}
*/
navigator.serviceWorker
    .register('./firebase-messaging-sw.js')
    .then((registration) => {
        firebase.messaging().useServiceWorker(registration);
    });