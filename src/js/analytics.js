export const init = () => {
  // Initialize the command queue in case analytics.js hasn't loaded yet.
window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-135483203-1');
};