import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import { CursorStreamer } from '/imports/api/cursor';

const Cursor = new Mongo.Collection(null);

function updateCursor(meetingId, userId, x = -1, y = -1) {
  const selector = {
    meetingId,
    userId,
  };

  const modifier = {
    $set: {
      userId,
      meetingId,
      x,
      y,
    },
  };

	return Cursor.upsert(selector, modifier);
}

CursorStreamer.on('message', (message) => {
  console.log('message', message);
  const { meetingId, userId, x, y } = message;
  if (Auth.meetingID === meetingId && Auth.userID === userId) return;
  updateCursor(meetingId, userId, x, y);
});

export function publishCursorUpdate(x, y) {
  CursorStreamer.emit('publish', {
		credentials: Auth.credentials,
		payload: {
      xPercent: x,
      yPercent: y,
    },
	});

  return updateCursor(Auth.meetingID, Auth.userID, x, y);
}

export default Cursor;
