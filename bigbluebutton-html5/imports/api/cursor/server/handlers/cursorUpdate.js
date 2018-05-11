import { check } from 'meteor/check';
import { CursorStreamer } from '/imports/api/cursor';

export default function handleCursorUpdate({ header, body }, meetingId) {
  const userId = header.userId;
  const x = body.xPercent;
  const y = body.yPercent;

  check(userId, String);
  check(x, Number);
  check(y, Number);

  return CursorStreamer.emit('message', { meetingId, userId, x, y });
}
