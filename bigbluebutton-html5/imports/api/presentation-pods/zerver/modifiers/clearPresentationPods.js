import PresentationPods from '/imports/api/presentation-pods';
import Logger from '/imports/startup/zerver/logger';
import clearPresentations from '/imports/api/presentations/zerver/modifiers/clearPresentations';
import clearPresentationUploadToken from '/imports/api/presentation-upload-token/zerver/modifiers/clearPresentationUploadToken';

export default function clearPresentationPods(meetingId) {
  if (meetingId) {
    return PresentationPods.remove(
      { meetingId },
      () => {
        clearPresentations(meetingId);
        clearPresentationUploadToken(meetingId);
        Logger.info(`Cleared Presentations Pods (${meetingId})`);
      },
    );
  }

  return PresentationPods.remove({}, () => {
    clearPresentations();
    clearPresentationUploadToken();
    Logger.info('Cleared Presentations Pods (all)');
  });
}
