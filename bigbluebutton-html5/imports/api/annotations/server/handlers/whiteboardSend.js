import { check } from 'meteor/check';

import addAnnotation from '../modifiers/addAnnotation';

let annotationsQueue = [];
let annotationsRecieverIsRunning = false;

const proccess = () => {
  if (!annotationsQueue.length) {
    annotationsRecieverIsRunning = false;
    return;
  }
  annotationsRecieverIsRunning = true;
  console.error('queueanoo', annotationsQueue.length);
  Object.keys(Meteor.server.sessions).forEach(session => {
    Meteor.server.sessions[session].socket.send(':)'+JSON.stringify({annotations:annotationsQueue}));
  });
  annotationsQueue = [];
  Meteor.setTimeout(proccess, 60);
};

export default function handleWhiteboardSend({ header, body }, meetingId) {
  const userId = header.userId;
  const annotation = body.annotation;

  check(userId, String);
  check(annotation, Object);

  const whiteboardId = annotation.wbId;

  check(whiteboardId, String);

  annotationsQueue.push(annotation);
  if (!annotationsRecieverIsRunning) proccess();
  // return addAnnotation(meetingId, whiteboardId, userId, annotation);
}
