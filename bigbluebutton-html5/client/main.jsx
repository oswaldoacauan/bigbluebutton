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

let MsgBus = {
  init(socket){
    socket.connect()
    this.onReady(socket, "foo")
  },

  onReady(socket, authToken) {
    let lastSeenId = 0

    let clientChannel = socket.channel("client:" + authToken, () => {
      return {last_seen_id: lastSeenId}
    })

    clientChannel.on("ping", (resp) => {
      console.log("Received ping message from server.")
    })

    clientChannel.on("new_msg", (resp) => {
      console.log("Received new_msg message from server." + resp)
    })

    clientChannel.join()
      .receive("ok", resp => {
        console.log(resp)
      })
      .receive("error", reason => console.log("joined failed", reason) )

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
      let socket = new Socket("ws://bbb.localhost.imdt.com.br:4000/socket", {
        params: {token: 'foo'},//value},
        logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
      })
      MsgBus.init(socket)


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
