import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import Annotations from '/imports/api/annotations';

const ANNOTATION_TYPE_TEXT = 'text';
const ANNOTATION_TYPE_PENCIL = 'pencil';

// line, triangle, ellipse, rectangle
function handleCommonAnnotation(meetingId, whiteboardId, userId, annotation) {
  const {
    id, status, annotationType, annotationInfo, wbId, position,
  } = annotation;

  const selector = {
    meetingId,
    id,
    userId,
  };

  const modifier = {
    $set: {
      whiteboardId,
      meetingId,
      id,
      status,
      annotationType,
      annotationInfo,
      wbId,
      position,
    },
    $inc: { version: 1 },
  };

  return { selector, modifier };
}

function handleTextUpdate(meetingId, whiteboardId, userId, annotation) {
  const {
    id, status, annotationType, annotationInfo, wbId, position,
  } = annotation;

  const selector = {
    meetingId,
    id,
    userId,
  };

  annotationInfo.text = annotationInfo.text.replace(/[\r]/g, '\n');

  const modifier = {
    $set: {
      whiteboardId,
      meetingId,
      id,
      status,
      annotationType,
      annotationInfo,
      wbId,
      position,
    },
    $inc: { version: 1 },
  };

  return { selector, modifier };
}

function handlePencilUpdate(meetingId, whiteboardId, userId, annotation) {
  // fetching annotation statuses from the config
  const ANOTATION_STATUSES = Meteor.settings.public.whiteboard.annotations.status;
  const DRAW_START = ANOTATION_STATUSES.start;
  const DRAW_UPDATE = ANOTATION_STATUSES.update;
  const DRAW_END = ANOTATION_STATUSES.end;

  const SERVER_CONFIG = Meteor.settings.private.app;
  const PENCIL_CHUNK_SIZE = SERVER_CONFIG.pencilChunkLength || 100;

  const {
    id, status, annotationType, annotationInfo, wbId, position,
  } = annotation;

  const baseSelector = {
    meetingId,
    id,
    userId,
    whiteboardId,
  };
  let baseModifier;
  let chunkSelector;
  let chunkModifier;

  // fetching the Annotation object
  const Annotation = Annotations.findOne(baseSelector);

  // a helper func, to split the initial annotation.points into subdocuments
  // returns an array of { selector, modifier } objects for subdocuments.
  const createPencilObjects = (lastChunkLength = 0) => {
    const chunks = [];
    // if the length of the points < PENCIL_CHUNK_SIZE then we simply return an array with one chunk
    if (annotationInfo.points.length < PENCIL_CHUNK_SIZE) {
      const chunkId = `${id}--${lastChunkLength + 1}`;
      chunks.push({
        selector: {
          meetingId,
          userId,
          id: chunkId,
        },
        modifier: {
          $set: {
            whiteboardId,
            meetingId,
            id: chunkId,
            status,
            annotationType,
            annotationInfo,
            wbId,
            position,
          },
          $inc: { version: 1 },
        },
      });
      return chunks;
    }

    // *default flow*
    // length of the points >= PENCIL_CHUNK_SIZE, so we split them into subdocuments

    // counter is used for generating ids.
    let i = 0;
    let counter = 1;
    for (; i <= annotationInfo.points.length; i += PENCIL_CHUNK_SIZE, counter += 1) {
      const chunkId = `${id}--${lastChunkLength + counter}`;

      // we always need to attach the last coordinate from the previous subdocument
      // to the front of the current subdocument, to connect the pencil path
      const _annotationInfo = annotationInfo;
      _annotationInfo.points = annotationInfo.points.slice(i === 0 ? 0 : i - 2, PENCIL_CHUNK_SIZE);

      chunks.push({
        selector: {
          meetingId,
          userId,
          id: chunkId,
        },
        modifier: {
          $set: {
            whiteboardId,
            meetingId,
            id: chunkId,
            status,
            annotationType,
            annotationInfo: _annotationInfo,
            wbId,
            position,
          },
          $inc: { version: 1 },
        },
      });
    }

    return chunks;
  };

  switch (status) {
    case DRAW_START: {
      // on start we split the points
      const chunks = createPencilObjects();

      // create the 'pencil_base'
      baseModifier = {
        id,
        userId,
        meetingId,
        whiteboardId,
        position,
        annotationType: 'pencil_base',
        numberOfChunks: chunks.length,
        lastChunkLength: chunks[chunks.length - 1].length,
        lastCoordinate: [
          annotationInfo.points[annotationInfo.points.length - 2],
          annotationInfo.points[annotationInfo.points.length - 1],
        ],
      };

      // inerting all the chunks
      chunks.forEach(chunk => Annotations.insert({ ...chunk.modifier.$set, ...chunk.modifier.$inc }));

      // base will be updated in the main addAnnotation event
      return { selector: baseSelector, modifier: baseModifier };
    }
    case DRAW_UPDATE: {
      // **default flow**
      // if we are here then it means that Annotation object is not in the db
      // So creating everything similar to DRAW_START case
      const _chunks = createPencilObjects(Annotation ? Annotation.numberOfChunks : 0);

      if (Annotation) {
        // pushing the last coordinate to the front of the current chunk's points
        _chunks[_chunks.length - 1].modifier.$set.annotationInfo.points.unshift(Annotation.lastCoordinate[0], Annotation.lastCoordinate[1]);

        baseModifier = {
          $set: {
            numberOfChunks: Annotation.numberOfChunks + _chunks.length,
            lastChunkLength: _chunks[_chunks.length - 1].modifier.$set.annotationInfo.points.length,
            lastCoordinate: [
              annotationInfo.points[annotationInfo.points.length - 2],
              annotationInfo.points[annotationInfo.points.length - 1],
            ],
          },
        };
      } else {
        // creating 'pencil_base' based on the info we received from createPencilObjects()
        baseModifier = {
          id,
          userId,
          meetingId,
          whiteboardId,
          position,
          annotationType: 'pencil_base',
          numberOfChunks: _chunks.length,
          lastChunkLength: _chunks[_chunks.length - 1].length,
          lastCoordinate: [
            annotationInfo.points[annotationInfo.points.length - 2],
            annotationInfo.points[annotationInfo.points.length - 1],
          ],
        };
      }

      // upserting all the chunks
      _chunks.forEach(chunk => Annotations.insert({ ...chunk.modifier.$set, ...chunk.modifier.$inc }));

      // base will be updated in the main AddAnnotation func
      return { selector: baseSelector, modifier: baseModifier };
    }
    case DRAW_END: {
      // If a user just finished drawing with the pencil
      // Removing all the sub-documents and replacing the 'pencil_base'
      if (Annotation && Annotation.annotationType === 'pencil_base') {
        // delete everything and replace base
        const chunkIds = [];
        for (let i = 0; i <= Annotation.numberOfChunks; i += 1) {
          chunkIds.push(`${Annotation.id}--${i}`);
        }
        chunkSelector = {
          meetingId,
          userId,
          id: { $in: chunkIds },
        };

        Annotations.remove(chunkSelector);
      }

      // Updating the main pencil object with the final info
      baseModifier = {
        $set: {
          whiteboardId,
          meetingId,
          id,
          status,
          annotationType,
          annotationInfo,
          wbId,
          position,
        },
        $inc: { version: 1 },
        $unset: {
          numberOfChunks: '',
          lastChunkLength: '',
          lastCoordinate: '',
        },
      };
      return { selector: baseSelector, modifier: baseModifier };
    }
    default: {
      return {};
    }
  }
}

export default function addAnnotation(meetingId, whiteboardId, userId, annotation) {
  check(meetingId, String);
  check(whiteboardId, String);
  check(annotation, Object);

  let query;

  switch (annotation.annotationType) {
    case ANNOTATION_TYPE_TEXT:
      query = handleTextUpdate(meetingId, whiteboardId, userId, annotation);
      break;
    case ANNOTATION_TYPE_PENCIL:
      query = handlePencilUpdate(meetingId, whiteboardId, userId, annotation);
      break;
    default:
      query = handleCommonAnnotation(meetingId, whiteboardId, userId, annotation);
      break;
  }

  const cb = (err, numChanged) => {
    if (err) {
      return Logger.error(`Adding annotation to collection: ${err}`);
    }

    const { insertedId } = numChanged;
    if (insertedId) {
      return Logger.info(`Added annotation id=${annotation.id} whiteboard=${whiteboardId}`);
    }

    return Logger.info(`Upserted annotation id=${annotation.id} whiteboard=${whiteboardId}`);
  };

  return Annotations.upsert(query.selector, query.modifier, cb);
}
