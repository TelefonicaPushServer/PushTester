function PushAlarm(callback) {
  function setNextAlarm() {
    var request = navigator.mozAlarms.getAll();

    request.onsuccess = function () {
      // Remove all pending alarms
      for (var i = 0; i < this.result.length; i++) {
        navigator.mozAlarms.remove(this.result[i].id);
      }

      // Esta es la fecha a programar la alarma en 5 minutos
      var nextAlarmTime  = new Date((new Date()).getTime() + 300000);

      // Esta es la información a pasar a la alarma
      var data = {
        time: nextAlarmTime
      }

      // La cadena "ignoreTimezone" es lo que hace a la alarma ignorar esto
      var request = navigator.mozAlarms.add(nextAlarmTime, "ignoreTimezone", data);

      request.onsuccess = function () {
        debug("[PushAlarm] La alarma ha sido programada");
        callback(data);
      };

      request.onerror = function () {
        debug("[PushAlarm] Ha ocurrido un error: " + this.error.name);
        callback(null, this.error.name);
      };
    }
  }

  var self = this;
  navigator.mozSetMessageHandler("alarm", function (mozAlarm) {
    debug("[PushAlarm] La alarma ha sido disparada");
    sendPush(mozAlarm);
    setNextAlarm();
  });
  setNextAlarm();

  return {
    setNext: setNextAlarm
  }
}
