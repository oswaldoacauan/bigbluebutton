import { check } from 'meteor/check';
import { AnnotationsStreamer } from '/imports/api/annotations';
import addAnnotation from '../modifiers/addAnnotation';

export default function handleWhiteboardSend({ header, body }, meetingId) {
  const userId = header.userId;
  const annotation = body.annotation;

  check(userId, String);
  check(annotation, Object);

  const whiteboardId = annotation.wbId;

  check(whiteboardId, String);
  AnnotationsStreamer.emit('added', { meetingId, whiteboardId, userId, annotation });
  return addAnnotation(meetingId, whiteboardId, userId, annotation);
}
