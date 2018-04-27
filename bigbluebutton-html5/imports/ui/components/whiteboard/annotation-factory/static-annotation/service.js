import Annotations from '/imports/ui/components/whiteboard/whiteboard-overlay/addAnnotation'

const getAnnotationById = _id => Annotations.findOne({
  _id,
});

export default {
  getAnnotationById,
};
