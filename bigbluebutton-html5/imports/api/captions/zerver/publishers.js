import Captions from '/imports/api/captions';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Logger from '/imports/startup/zerver/logger';

function captions(credentials) {
  const { meetingId, requesterUserId, requesterToken } = credentials;

  check(meetingId, String);
  check(requesterUserId, String);
  check(requesterToken, String);

  Logger.verbose(`Publishing Captions for ${meetingId} ${requesterUserId} ${requesterToken}`);

  return Captions.find({ meetingId });
}

function publish(...args) {
  const boundCaptions = captions.bind(this);
  return boundCaptions(...args);
}

Meteor.publish('captions', publish);
