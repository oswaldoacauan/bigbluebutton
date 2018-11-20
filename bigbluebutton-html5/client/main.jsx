/* eslint no-unused-vars: 0 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { render } from 'react-dom';
import logger from '/imports/startup/client/logger';
import { joinRouteHandler, authenticatedRouteHandler } from '/imports/startup/client/auth';
import Base from '/imports/startup/client/base';
import LoadingScreen from '/imports/ui/components/loading-screen/component';
import {Socket} from "phoenix";
import Omegalul from '/imports/omegalul';

import '/imports/api/group-chat/zerver/eventHandlers';
import '/imports/api/group-chat-msg/zerver/eventHandlers';

let MsgBus = {
  init(socket, token){
    socket.connect()
    socket.onOpen(() => this.onReady(socket, token));
  },

  onReady(socket, authToken) {
    let lastSeenId = 0

    let channel = socket.channel("client:" + authToken, {token: authToken})

    channel.on("ping", (resp) => {
      console.log("Received ping message from server.")
    })

    channel.on("new_msg", (msg) => {
      const { header, body } = msg;
      const { meetingId } = header;
      const eventName = header.name;
      Omegalul.emit(eventName, { header, body }, meetingId)
    })
    channel.join()
      .receive("ok", ({messages}) => console.log("catching up", messages) )
      .receive("error", ({reason}) => console.log("failed join", reason) )
      .receive("timeout", () => console.log("Networking issue. Still waiting..."))

  }

}


Meteor.startup(() => {
  render(<LoadingScreen />, document.getElementById('app'));

  // Logs all uncaught exceptions to the client logger
  window.addEventListener('error', (e) => {
    const { stack } = e.error;
    let message = e.error.toString();

    // Checks if stack includes the message, if not add the two together.
    if (stack.includes(message)) {
      message = stack;
    } else {
      message += `\n${stack}`;
    }
    logger.error(message);
  });

  // TODO make this a Promise
  joinRouteHandler((value, error) => {
    if (error) {
      logger.error(`User faced [${value}] on main.joinRouteHandler. Error was:`, JSON.stringify(error));
    } else {
      logger.info(`User successfully went through main.joinRouteHandler with [${value}].`);
    }
    authenticatedRouteHandler(() => {
      console.log('@@@', value);
      value = 'foo';
      let socket = new Socket("ws://bbb.localhost.imdt.com.br:4000/socket", {
        params: {token: value},
        logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
      })
      MsgBus.init(socket, value)


      // set defaults
      Session.set('isChatOpen', false);
      Session.set('idChatOpen', '');
      Session.set('isMeetingEnded', false);
      Session.set('isPollOpen', false);
      Session.get('breakoutRoomIsOpen', false);
      
      render(<Base />, document.getElementById('app'));
    });
  });
});

// // import '/imports/startup/zerver';

// // 2x
// import '/imports/api/meetings/zerver';
// import '/imports/api/users/zerver';
// import '/imports/api/annotations/zerver';
// import '/imports/api/cursor/zerver';
// import '/imports/api/polls/zerver';
// import '/imports/api/captions/zerver';
// import '/imports/api/presentations/zerver';
// import '/imports/api/presentation-pods/zerver';
// import '/imports/api/presentation-upload-token/zerver';
// import '/imports/api/slides/zerver';
// import '/imports/api/breakouts/zerver';
// import '/imports/api/group-chat/zerver';
// import '/imports/api/group-chat-msg/zerver';
// import '/imports/api/screenshare/zerver';
// import '/imports/api/users-settings/zerver';
// import '/imports/api/voice-users/zerver';
// import '/imports/api/whiteboard-multi-user/zerver';
// import '/imports/api/video/zerver';

// // Commons
// import '/imports/api/log-client/zerver';
// import '/imports/api/common/zerver/helpers';
// import '/imports/startup/zerver/logger';
