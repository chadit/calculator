//eslint-disable-line
var HOST = window.location.origin.replace(/^http/, "ws");
var socket = new WebSocket(HOST + "/ws");

let connect = (calcCallback) => {
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg) => {
    console.log(msg);
    calcCallback(msg);
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };
};

let sendMsg = (msg) => {
  if (msg !== null) {
    console.log("sending msg: ", msg);
    socket.send(msg);
  }
};

export { connect, sendMsg };
