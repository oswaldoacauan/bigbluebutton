import { check } from 'meteor/check';
import AnnotationsChunks from '/imports/api/annotations-chunks';
import Logger from '/imports/startup/server/logger';

export default function removeAnnotation(meetingId, whiteboardId, shapeId) {
  check(meetingId, String);
  check(whiteboardId, String);
  check(shapeId, String);

  const selector = {
    meetingId,
    whiteboardId,
    id: shapeId,
  };

  const cb = (err) => {
    if (err) {
      return Logger.error(`Removing annotation from collection: ${err}`);
    }

    return Logger.info(`Removed annotation id=${shapeId} whiteboard=${whiteboardId}`);
  };

  return Annotations.remove(selector, cb);
}
