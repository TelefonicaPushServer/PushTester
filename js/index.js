var CANVAS_OK = '#00CC66';
var CANVAS_KO = '#FA5858';
var CANVAS_WR = '#F4FA58';

var CANVAS_STR_OK = 'OK';
var CANVAS_STR_KO = 'CRITICAL';
var CANVAS_STR_WR = 'WARNING';

//Connection Status
window.onload = function() {
  PushAlarm(function(alarmData) {
    updateNextScheduledCheck(alarmData.time);
  });
  var online = window.navigator.onLine;
  if (!online) {
    fatal('Conecte el dispositivo a una red con datos');
  }

  debug('Conectado: ' + online);
  Pusher.register(handleEvents);

  window.addEventListener('pushmessagenotreceived', function(data) {
    debug('Error no push response received ! - ' + data.detail.version);
    beep('KO', JSON.stringify(data));
    fill_canvas('pns_status', CANVAS_WR, CANVAS_STR_WR);
  }, false);
};

document.getElementById('pushbtn').addEventListener('click', function() {
  sendPush(null);
});

function handleEvents(evt, data) {
  debug('handleEvents: ' + evt + ' - ' + JSON.stringify(data));
  switch(evt) {
    case 'registered':
      playBeep();
      updateEndpoint(data);
      fill_canvas('pns_status', CANVAS_OK, CANVAS_STR_OK);
      window.clearInterval(window.beepingInterval);
      break;

    case 'error':
      debug('Error registering endpoint --> ' + JSON.stringify(data));
      beep('KO', JSON.stringify(data));
      fill_canvas('pns_status', CANVAS_KO, CANVAS_STR_KO);
      break;

    case 'push':
      /*
        Removed on 20140708. do not beep on new version 
       */
      /*showNotification('PushTester new version', 'version = ' +
        data.version);*/
      updateLastNotificationReceivedTime();
      updateVersion(data.version);
      fill_canvas('pns_status', CANVAS_OK, CANVAS_STR_OK);
      window.clearInterval(window.beepingInterval);
      break;

    case 'push-register':
      break;
  }
}

function sendPush(AlarmData) {
  Pusher.sendPush(function(res, error) {
    var prefix = "";
    if (AlarmData) {
      prefix = "Alarm: ";
    }

    // Is trusted is fired when is triggered by a script, instead of a user.
    // This means that is fired when the alarm is fired.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Event#Properties
    // event.isTrusted
    if (error && error.isTrusted === false) {
      updateASResponse(prefix + 'AS response = ' + JSON.stringify(res));
    } else if (error) {
      updateASResponse(prefix + error);
      beep('KO', JSON.stringify(data));
      fill_canvas('pns_status', CANVAS_WR, CANVAS_STR_WR);
    } else {
      updateASResponse(prefix + 'AS response = ' + JSON.stringify(res));
    }
  });
}

// UI Management

function updateLastNotificationReceivedTime() {
  document.getElementById('lastNotificationRecvTime').textContent =
    new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
}

function updateVersion(version) {
  document.getElementById('lastVersionRecv').textContent = version;
}

function updateEndpoint(token) {
  document.getElementById('endpointURL').textContent = token;
}

function updateASResponse(msg) {
  document.getElementById('lastASResponse').textContent = msg;
}

function updateNextScheduledCheck(time) {
  document.getElementById('nextScheduledCheck').textContent = time;
}

//Poner cuadrado status con color y msg. Nueva func no hace falta msj, hará
function fill_canvas(id, color, string) {
  var c = document.getElementById(id);
  var ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(5, 5, 210, 100);
  ctx.fillStyle = 'white';
  ctx.font = '30px FiraSans';
  ctx.fillText(string, 77, 45);
}
