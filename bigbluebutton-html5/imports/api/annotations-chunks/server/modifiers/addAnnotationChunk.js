import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import AnnotationsChunks from '/imports/api/annotations-chunks';
import clearAnnotationsChunk from './clearAnnotationsChunk';

export default function addAnnotationChunk(meetingId, whiteboardId, annotationId, annotationInfo) {
  check(meetingId, String);
  check(whiteboardId, String);
  check(annotationId, String);
  check(annotationInfo, Object);

  const ANOTATION_STATUSES = Meteor.settings.public.whiteboard.annotations.status;
  const DRAW_START = ANOTATION_STATUSES.start;
  const DRAW_UPDATE = ANOTATION_STATUSES.update;
  const DRAW_END = ANOTATION_STATUSES.end;

  const { id, status, type, ...relevantInfo } = annotationInfo;

  const modifier = {
    ...relevantInfo,
    meetingId,
    whiteboardId,
    annotationId,
    status, type,
    text: !annotationInfo.text ? '' : annotationInfo.text.replace(/[\r]/g, '\n'),
  };

  return new Promise((resolve, reject) => {
    const cb = (err, id) => {
      if (err) {
        Logger.error(`Adding annotation-chunk to collection: ${err}`);
        reject(err);
      }

      Logger.info(`Added annotation-chunk annotationId=${annotationId} whiteboard=${whiteboardId}`);
      resolve(id);
    };

    if (status === DRAW_END || type !== 'pencil') {
      clearAnnotationsChunk(
        meetingId, whiteboardId, annotationId,
        () => AnnotationsChunks.insert(modifier, cb)
      );
    } else {
      AnnotationsChunks.insert(modifier, cb)
    }
  });
}
