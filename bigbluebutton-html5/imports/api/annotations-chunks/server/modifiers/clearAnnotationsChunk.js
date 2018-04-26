import AnnotationsChunks from '/imports/api/annotations-chunks';
import Logger from '/imports/startup/server/logger';

export default function clearAnnotationsChunk(meetingId, whiteboardId, annotationId, cbDelete) {
  const selector = {};

  if (meetingId) {
    selector.meetingId = meetingId;
  }

  if (whiteboardId) {
    selector.whiteboardId = whiteboardId;
  }

  if (annotationId) {
    selector.annotationId = annotationId;
  }

  const cb = (err) => {
    if (err) {
      return Logger.error(`Removing AnnotationsChunk from collection: ${err}`);
    }

    cbDelete && cbDelete();

    if (annotationId) {
      return Logger.info(`Cleared AnnotationsChunk for annotationId=${annotationId} where whiteboard=${whiteboardId}`);
    }

    if (whiteboardId) {
      return Logger.info(`Cleared AnnotationsChunk for whiteboard=${whiteboardId}`);
    }

    if (meetingId) {
      return Logger.info(`Cleared AnnotationsChunk (${meetingId})`);
    }

    return Logger.info('Cleared AnnotationsChunk (all)');
  };

  return AnnotationsChunks.remove(selector, cb);
}
