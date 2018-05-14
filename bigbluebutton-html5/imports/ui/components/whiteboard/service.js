import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import { AnnotationsStreamer } from '/imports/api/annotations';
import addAnnotationQuery from '/imports/api/annotations/addAnnotation';
import { isEqual } from 'lodash';

const Annotations = new Mongo.Collection(null);
const Logger = {
  info: console.log,
  error: console.error,
};

function handleAddedAnnotation(message) {
  const { meetingId, whiteboardId, userId, annotation } = message;
  const isOwn = Auth.meetingID === meetingId && Auth.userID === userId;
  const query = addAnnotationQuery(meetingId, whiteboardId, userId, annotation);

  if (!isOwn) {
    Annotations.upsert(query.selector, query.modifier);
    return;
  }

  const fakeAnnotation = Annotations.findOne({ id: `${annotation.id}-fake` });
  const fakePoints = fakeAnnotation.annotationInfo.points;
  const lastPoints = annotation.annotationInfo.points;

  if (annotation.annotationType !== 'pencil') {
    // Means that the server "reached" the same position as the optimistic so we update the color/position
    if (isEqual(fakePoints, lastPoints) || annotation.status === "DRAW_END") {
      Annotations.update(fakeAnnotation._id, {
        $set: {
          'position': annotation.position,
          'annotationInfo.color': annotation.annotationInfo.color,
        },
        $inc: { version: 1 }, // TODO: Remove all this version stuff
      });
      return;
    }

    return;
  }

  // Make own drawing always on top
  if (annotation.status !== "DRAW_END") {
    query.modifier.$set.position = Number.MAX_SAFE_INTEGER;
  }

  Annotations.upsert(query.selector, query.modifier, err => {
    if (err) {
      console.error(err);
      return;
    }

    // Remove fake annotation for pencil on draw end
    if (annotation.status === "DRAW_END") {
      Annotations.remove({ id: `${annotation.id}-fake` });
      return;
    }

    if (annotation.position > 0) {
      console.log(annotation.position);
      Annotations.update(fakeAnnotation._id, {
        $set: {
          'position':annotation.position - 1,
        },
        $inc: { version: 1 }, // TODO: Remove all this version stuff
      });
      return;
    }
  });
}

AnnotationsStreamer.on('added', handleAddedAnnotation);
// AnnotationsStreamer.on('added', message =>
//   setTimeout(() => handleAddedAnnotation(message), 250)
// );

function increase_brightness(hex, percent){
  hex = parseInt(hex, 10).toString(16).padStart(6, 0);
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if(hex.length == 3){
      hex = hex.replace(/(.)/g, '$1$1');
  }

  var r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);

  return parseInt(
     ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
     ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
     ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1), 16);
}

export function sendAnnotation(annotation) {
  AnnotationsStreamer.emit('publish', {
		credentials: Auth.credentials,
		payload: annotation,
	});

  // skip optimistic for draw end since the smoothing is done in akka
  if (annotation.status === "DRAW_END") return;

  const queryFake = addAnnotationQuery(Auth.meetingID, annotation.wbId, Auth.userID,
    {
      ...annotation,
      id: `${annotation.id}-fake`,
      position: Number.MAX_SAFE_INTEGER - 1,
      annotationInfo: {
        ...annotation.annotationInfo,
        color: increase_brightness(annotation.annotationInfo.color, 40),
      },
    });

  return Annotations.upsert(queryFake.selector, queryFake.modifier);
}

export default Annotations;
