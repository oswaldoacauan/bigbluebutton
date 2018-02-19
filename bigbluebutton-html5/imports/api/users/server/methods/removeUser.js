import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis';

export default function removeUser(credentials, userId) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'EjectUserFromMeetingCmdMsg';

  const { requesterUserId, meetingId } = credentials;

  check(meetingId, String);
  check(requesterUserId, String);
  check(userId, String);

  const payload = {
    userId,
    ejectedBy: requesterUserId,
  };


  const serverSessions = Meteor.server.sessions;

  Object.keys(serverSessions)
    .forEach((k) => {
      serverSessions[k].connectionHandle.close();
    });

  // Object.keys(serverSessions)
  //   .filter(i => serverSessions[i].userId == userId)
  //   .reduce((sessions, key) => sessions[key], serverSessions)
  //   .connectionHandle.close();
  // .filter(key => Meteor.server.sessions[key].userId === userId);

  console.error(Object.keys(Meteor.server.sessions)
    .filter(i => Meteor.server.sessions[i].userId == userId)
    .reduce((sessions, key) => sessions[key], Meteor.server.sessions));


  // .reduce((obj, key) => obj[key], {})
  //

  return RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}
