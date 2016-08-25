import http from 'http';

const BUTTON_PREFIX = '?b=';

export const handleButtonPress = (request, response, onButtonMessage) => {
    if(request.url.indexOf(BUTTON_PREFIX) < 0) {
      response.end();
      return;
    }
    const buttonNumber = Number(request.url.split(BUTTON_PREFIX)[1]);

    if(global.buttonState[buttonNumber] === undefined) {
      global.buttonState[buttonNumber] = Object.keys(global.buttonState).length;
    }

    onButtonMessage();
    response.end(`Pressed ${buttonNumber}`);
    return;
}


const httpListen = (HTTP_PORT, onButtonMessage) => {
  const handleRequest = (request, response) => {

    const handler = request.url.charAt(1);

    if(handler === "Q") {
      handleButtonPress(request, response, onButtonMessage);
      return
    }
    response.end();
  }

  const server = http.createServer(handleRequest);
  server.listen(HTTP_PORT, () => {
      console.log(`Now listening for HTTP requests on :${HTTP_PORT}`);
  });
}

export default httpListen;
