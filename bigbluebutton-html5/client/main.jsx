/* eslint no-unused-vars: 0 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { log } from '/imports/ui/services/api';
import renderRoutes from '/imports/startup/client/routes';

import { makeCall } from '/imports/ui/services/api';
import Storage from '/imports/ui/services/storage/session';
import Auth from '/imports/ui/services/auth';
import {addAnnotation} from '/imports/ui/components/whiteboard/whiteboard-overlay/addAnnotation';

Meteor.startup(() => {
  const oldMeteorSockJSonmessage = Meteor.connection._stream.socket.onmessage;
  Meteor.connection._stream.socket.onmessage = (message) => {
    if (message.data.substring(0,2) == ':)') {
      const data = JSON.parse(message.data.substring(2));
      const annotations = data.annotations || [];
      annotations.forEach(annotation => addAnnotation(Auth.meetingID, Auth.userID, annotation.wbId, annotation));
      return;
    }
    return oldMeteorSockJSonmessage(message);
  }


  render(renderRoutes(), document.getElementById('app'));

  // Log all uncaught exceptions to the server
  // TODO: There is no StackTrace on the ErrorEvent object
  window.addEventListener('error', (e) => {
    log('error', e);
  });
});
