
function playBeep(code) {
  var tonePlayer = new Audio();
  switch (code) {
    case 1:
      tonePlayer.src = '/dtmf_tones/950Hz+1400Hz+1800Hz_200ms.ogg';
      break;
    case 2:
      tonePlayer.src = '/dtmf_tones/480Hz+620Hz_200ms.ogg';
      break;
    default:
      tonePlayer.src = '/dtmf_tones/400Hz_200ms.ogg';
  }
  tonePlayer.loop = false;
  tonePlayer.play();
}

function beep(severity, msj) {
  switch (severity) {
    case 'KO':
      fill_canvas('pns_status', CANVAS_KO, CANVAS_STR_KO);
      playBeep(2);
      alert('Algo salió mal :( ' + '\r' + msj);
      break;

    case 'WR':
      fill_canvas('pns_status', CANVAS_WR, CANVAS_STR_WR);
      playBeep();
      alert('Be carefully' + '\r' + msj);
      break;
  }
}

function debug(msg) {
  console.log('[PushTester] ' + msg);
}

function fatal(msg) {
  debug(msg);
  beep('WR', msg);
  // TODO: Cerrar aplicacion 
}

function showNotification(header, msg) {
  var notification = navigator.mozNotification.createNotification(
    header, msg);
  notification.show();
}