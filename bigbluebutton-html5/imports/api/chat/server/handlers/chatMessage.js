import { check } from 'meteor/check';
import addChat from '../modifiers/addChat';

export default function handleChatMessage({ body }, meetingId) {
  const { message } = body;

  check(meetingId, String);
  check(message, Object);
  Object.keys(Meteor.server.sessions).forEach(session => {
    //':)'+JSON.stringify({annotation)//
    Meteor.server.sessions[session].socket.send(':){}', 'tchau');
  });
  return addChat(meetingId, message);
}
