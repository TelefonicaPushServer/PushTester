var Pusher = (function() {
  debug('Initializing PushTester');
  init();

  function init() {
    //Si no se soportan notificaciones push
    if (!navigator.push) {
      fatal('The browser doesn\'t support notifications push');
      return;
    }
  }

  function register(callback) {
    debug('Registering PushTester in PNS');
    playBeep();

    if (!getEndpoint()) {
      registerNewChannel(callback);    
    } else {
      debug('Previously registered with endpoint: ' + getEndpoint());
      callback('registered', getEndpoint());
    }

    registerPushSystemMessages(callback);
  }

  //Registro de AppToken
  function registerNewChannel(callback) {
    debug('Registering a new channel');
    var req = navigator.push.register();

    req.onsuccess = function(e) {
      setEndpoint(req.result);
      debug('registerNewChannel: nuevo endpoint --> ' + getEndpoint());
      callback('registered', getEndpoint());
    };

    req.onerror = function(e) {
      //aqui llamamos a beep
      debug('registerNewChannel: error endpoint--> ' + JSON.stringify(e));
      callback('error', e);
    };
  }

  function registerPushSystemMessages(callback) {
    debug('registerPushSystemMessages');
    window.navigator.mozSetMessageHandler('push', function(evt) {
      debug('Push message received for endpoint: ' + evt.pushEndpoint);

      if (isValidEndpoint(evt.pushEndpoint)) {
        debug('Great, endpoint valid !');
        callback('push', evt);
      }
    });

    window.navigator.mozSetMessageHandler('push-register', function() {
      debug('PUSH: Re-registration process');
      navigator.push.unregister(getEndpoint());
      registerNewChannel();
      callback('push-register');
    });
  }

  function getEndpoint() {
    return localStorage.endpoint || null;
  }

  function setEndpoint(endpoint) {
    debug('Pusher, Nuevo endpoint = ' + endpoint);
    localStorage.endpoint = endpoint;
  }

  function isValidEndpoint(endpoint) {
    debug('Pusher, Chequeando validez del endpoint ' + endpoint);
    return getEndpoint() === endpoint;
  }

  function sendPush(callback) {
    var version = new Date().getTime();
    debug('Sending notification to ' + getEndpoint() + ' version: ' + version);
    sendMessageToAL(getEndpoint(), version, callback);
  }

  //Enviar nueva versión al AL de PNS.
  function sendMessageToAL(URL, version, callback) {
    debug('XHR to URL: ' + URL + ' Version: ' + version);
    var oReq = new XMLHttpRequest();

    oReq.onload = function() {
      callback(this.responseText);
    };
    oReq.onerror = function() {
      callback(null, 'Error putting a new version');
    };

    oReq.open('put', URL, true);
    oReq.send('version=' + version);
  }

  return {
    register: register,
    sendPush: sendPush
  }
})();