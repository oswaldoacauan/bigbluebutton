import Slides from '/imports/api/slides';
import Logger from '/imports/startup/zerver/logger';

export default function clearSlides(meetingId) {
  if (meetingId) {
    return Slides.remove({ meetingId }, Logger.info(`Cleared Slides (${meetingId})`));
  }

  return Slides.remove({}, Logger.info('Cleared Slides (all)'));
}
