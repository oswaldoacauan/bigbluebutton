import Annotations from '/imports/api/annotations';
import AnnotationsChunks from '/imports/api/annotations-chunks';

const getCurrentAnnotationsInfo = (whiteboardId) => {
  if (!whiteboardId) {
    return null;
  }

  const selector = { whiteboardId };
  const options = {
    sort: { position: 1 },
    fields: { id: 1, annotationType: 1, status: 1, },
  };

  return Annotations.find(selector, options).fetch();
};

export default {
  getCurrentAnnotationsInfo,
};
