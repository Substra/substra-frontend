const script = `
    <script type="text/javascript">
        'serviceWorker' in window.navigator && window.addEventListener('load', function () {
            function registerServiceWorker () {
                // only register serviceWorker if online
                if (window.navigator.onLine) {
                    window.navigator.serviceWorker.register('/service-worker.js').then(function(reg) {
                      reg.onupdatefound = function() {
                        var installingWorker = reg.installing;

                        installingWorker.onstatechange = function() {
                          switch (installingWorker.state) {
                            case 'installed':
                              if (navigator.serviceWorker.controller) {
                                console.log('New or updated content is available, please refresh.');
                              } else {
                                console.log('Content is now available offline!');
                              }
                              break;

                            case 'redundant':
                              console.error('The installing service worker became redundant.');
                              break;
                          }
                        };
                      };
                    }).catch(function(e) {
                      console.error('Error during service worker registration:', e);
                    });
                }
            }

            window.addEventListener('online', registerServiceWorker);
            registerServiceWorker();
        });
    </script>
`;

const serviceWorker = process.env.NODE_ENV === 'production' ? `${script}` : '';

export default serviceWorker;
