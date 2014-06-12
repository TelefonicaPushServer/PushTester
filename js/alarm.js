var PushAlarm = function() {
  function setNextAlarm() {
    var request = navigator.mozAlarms.getAll();

    request.onsuccess = function () {
      // Remove all pending alarms
      for (var i = 0; i < this.result.length; i++) {
        navigator.mozAlarms.remove(this.result[i].id);
      }

      // Esta es la fecha a programar la alarma en 1 minuto
      var nextAlarmTime  = new Date((new Date()).getTime() + /*60000*/ 10000);

      // Esta es la información a pasar a la alarma
      var data    = {
        foo: "bar",
        time: nextAlarmTime
      }

      // La cadena "ignoreTimezone" es lo que hace a la alarma ignorar esto
      var request = navigator.mozAlarms.add(nextAlarmTime, "ignoreTimezone", data);

      request.onsuccess = function () {
        console.log("La alarma ha sido programada");
      };

      request.onerror = function () {
        console.log("Ha ocurrido un error: " + this.error.name);
      };
    }
  }

  navigator.mozSetMessageHandler("alarm", function (mozAlarm) {
    //alert("alarm fired: " + JSON.stringify(mozAlarm.data));
    console.log("La alarma ha sido programada");
    PushAlarm.setNext();
  });
  setNextAlarm();

  return {
    setNext: function() {
      setNextAlarm();
    }
  }
}();
