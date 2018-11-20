import { check } from 'meteor/check';
import PresentationPods from '/imports/api/presentation-pods';
import Logger from '/imports/startup/zerver/logger';
import clearPresentations from '/imports/api/presentations/zerver/modifiers/clearPresentations';
import clearPresentationUploadToken from '/imports/api/presentation-upload-token/zerver/modifiers/clearPresentationUploadToken';

export default function removePresentationPod(meetingId, podId) {
  check(meetingId, String);
  check(podId, String);

  const selector = {
    meetingId,
    podId,
  };

  const cb = (err) => {
    if (err) {
      Logger.error(`Removing presentation pod from collection: ${err}`);
      return;
    }

    if (podId) {
      Logger.info(`Removed presentation pod id=${podId} meeting=${meetingId}`);
      clearPresentations(meetingId, podId);
      clearPresentationUploadToken(meetingId, podId);
    }
  };

  return PresentationPods.remove(selector, cb);
}
