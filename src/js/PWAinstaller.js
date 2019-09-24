window.addEventListener('load', function() {
  const installEl = document.getElementById('installer');
  const installer = new Installer(installEl);
  let isLooping = false;
});

const Installer = function(root) {
  let promptEvent;

  const install = function(e) {
    console.log(promptEvent);
    if(promptEvent) {
      console.log("clicked");
      promptEvent.prompt();
      promptEvent.userChoice
        .then(function(choiceResult) {
          // The user actioned the prompt (good or bad).
          // good is handled in 
          promptEvent = null;
            //ga('send', 'event', 'install', choiceResult);
          root.classList.remove('available');
        })
        .catch(function(installError) {
          // Boo. update the UI.
          promptEvent = null;
          //ga('send', 'event', 'install', 'errored');
          root.classList.remove('available');
        });
    }
  };

  const installed = function(e) {
    promptEvent = null;
    console.log("installed");
    // This fires after onbeforinstallprompt OR after manual add to homescreen.
    //ga('send', 'event', 'install', 'installed');
    root.classList.remove('available');
  };

  const beforeinstallprompt = function(e) {
    console.log("beforeinstallprompt");
    promptEvent = e;
    console.log(e);
    promptEvent.preventDefault();
    //ga('send', 'event', 'install', 'available');
    root.classList.add('available');
    return false;
  };

  window.addEventListener('beforeinstallprompt', beforeinstallprompt);
  window.addEventListener('appinstalled', installed);

  root.addEventListener('click', install.bind(this));
  root.addEventListener('touchend', install.bind(this));
};