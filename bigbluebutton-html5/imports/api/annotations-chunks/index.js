import { Meteor } from 'meteor/meteor';

const AnnotationsChunks = new Mongo.Collection('annotations-chunks');

if (Meteor.isServer) {
  AnnotationsChunks._ensureIndex({ id: 1 });
  AnnotationsChunks._ensureIndex({ meetingId: 1, whiteboardId: 1, annotationId: 1 });
}

export default AnnotationsChunks;
