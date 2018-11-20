import { Meteor } from 'meteor/meteor';

const GroupChatMsg = new Mongo.Collection('group-chat-msg');
const GroupChatMsgLocal = new Mongo.Collection(null);
// if (Meteor.isServer) {
//   GroupChatMsg._ensureIndex({ meetingId: 1, chatId: 1 });
// }

GroupChatMsg.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

export default Meteor.isServer ? GroupChatMsg : GroupChatMsgLocal;
