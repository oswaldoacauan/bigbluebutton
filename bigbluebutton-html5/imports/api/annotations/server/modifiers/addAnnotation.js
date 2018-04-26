import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import Annotations from '/imports/api/annotations';
import addAnnotationChunk from '/imports/api/annotations-chunks/server/modifiers/addAnnotationChunk';

const ANNOTATION_TYPE_TEXT = 'text';
const ANNOTATION_TYPE_PENCIL = 'pencil';

export default function addAnnotation(meetingId, whiteboardId, userId, annotation) {
  // const now = +(Date.now());
  // console.error(`COMECOU: ${now}`);
  check(meetingId, String);
  check(whiteboardId, String);
  check(annotation, Object);

  const { id, status, annotationType, annotationInfo, wbId, position } = annotation;

  const selector = {
    meetingId,
    id,
    userId,
    whiteboardId: wbId,
  };

  // console.error(`db.annotations.find(${JSON.stringify(selector)}).pretty()`);

  // const Annotation = Annotations.findOne(selector, { fields: {"_id" : 1} });
  // console.error(`TERMINOU_FIND: ${+(Date.now()) - now}`);
  // console.error(`annotation: ${status}`)
  const modifier = {
    $set: {
      id,
      userId,
      meetingId,
      whiteboardId: wbId,
      position,
      status,
      annotationType,
      lastCoordinate: !annotationInfo.points ? false : [
        annotationInfo.points[annotationInfo.points.length - 2],
        annotationInfo.points[annotationInfo.points.length - 1],
      ],
    }
  };

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding annotation to collection: ${err}`);
    }

    // console.error(`TERMINOU_DIFF: ${+(Date.now()) - now}`);
    if (numChanged) {
      return Logger.info(`Updated annotation id=${annotation.id} whiteboard=${whiteboardId}`);
    }

    return Logger.info(`Added annotation id=${annotation.id} whiteboard=${whiteboardId}`);
  };

  return addAnnotationChunk(meetingId, whiteboardId, id, annotationInfo)
    .then(() => {
      Annotations.upsert(selector, modifier, cb)
    });

  // return Annotation ?
  //   Annotations.update(Annotation._id, modifier, cb) :
  //   Annotations.insert(modifier, cb);
}
