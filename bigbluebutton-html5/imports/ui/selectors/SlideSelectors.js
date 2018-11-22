/* eslint import/prefer-default-export: 0 */
import Slides from '/imports/api/slides';

const findOneOmiting = selector => Slides.findOne(selector, {
  fields: {
    meetingId: 0,
    thumbUri: 0,
    swfUri: 0,
    txtUri: 0,
    svgUri: 0,
  },
});

export const getSlide = slideId => findOneOmiting({ id: slideId });

export const getCurrentSlideByPresentation = presentationId => findOneOmiting({ presentationId, current: true });

export const getCurrentSlideByPod = podId => findOneOmiting({ podId, current: true });
