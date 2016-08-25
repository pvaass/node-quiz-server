"use strict";

let groupNames = {
  1: 'Groep 1',
  2: 'Groep 2',
  3: 'Groep 3',
  4: 'Groep 4',
  5: 'Groep 5',
  6: 'Groep 6',
  7: 'Groep 7',
  8: 'Groep 8'
}


$(function () {

  $(document).ready(function() {

    if(localStorage.getItem("groupNames") !== null) {
      groupNames = JSON.parse(localStorage.getItem("groupNames"));
    }

    function refreshGroupNames() {
      for(var i=1; i<=8; i++) {
          var group = $('[data-group=' + (i) + ']');
          group.find('div').first().html(groupNames[i]);
      }
    }

    refreshGroupNames();

    $('[data-group]').on('click', function() {
      const groupId = $(this).attr('data-group');
      groupNames[groupId] = prompt("Vul nieuwe groepnaam in") || groupNames[groupId];
      localStorage.setItem("groupNames", JSON.stringify(groupNames));
      refreshGroupNames();
    });
  });


  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  // if browser doesn't support WebSocket, just show some notification and exit
  if (!window.WebSocket) {
      alert('Use a different browser to play the quiz');
      return;
  }

  // open connection
  var connection = new WebSocket('ws://127.0.0.1:8081');

  connection.onopen = function () {
      console.log('Connection opened');

      $('.reset').on('click', function() {
        console.log('oi');
        connection.send('reset');
      });

  };

  connection.onerror = function (error) {
      console.log(error);
  };

  // most important part - incoming messages
  connection.onmessage = function (message) {
      console.log(message);

      var buttonState = JSON.parse(message.data);

      for(var i=1; i<=8; i++) {
        console.log(buttonState[i]);
        var group = $('[data-group=' + (i) + ']');
        if(buttonState[i] !== undefined) {
          group.addClass('pressed');
          group.find('.place').html(buttonState[i] + 1);
        }
        else {
          group.removeClass('pressed');
          group.find('.place').html('');
        }
      }
  };


});
