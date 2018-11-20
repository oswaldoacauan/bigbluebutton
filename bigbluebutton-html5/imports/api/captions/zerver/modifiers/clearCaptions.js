import Captions from '/imports/api/captions';
import Logger from '/imports/startup/zerver/logger';

export default function clearCaptions(meetingId) {
  if (meetingId) {
    return Captions.remove({ meetingId }, Logger.info(`Cleared Captions (${meetingId})`));
  }

  return Captions.remove({}, Logger.info('Cleared Captions (all)'));
}
