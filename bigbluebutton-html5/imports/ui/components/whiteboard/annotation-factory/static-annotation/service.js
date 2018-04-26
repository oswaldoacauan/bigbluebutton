import AnnotationsChunks from '/imports/api/annotations-chunks';

const getAnnotationById = id => AnnotationsChunks.findOne({
  annotationId: id,
  status: { $eq: Meteor.settings.public.whiteboard.annotations.status.end },
});

export default {
  getAnnotationById,
};
