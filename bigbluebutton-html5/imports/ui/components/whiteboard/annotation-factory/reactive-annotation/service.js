import AnnotationsChunks from '/imports/api/annotations-chunks';

const getAnnotationsById = id => AnnotationsChunks.find({
  annotationId: id,
  status: { $not: { $eq: Meteor.settings.public.whiteboard.annotations.status.end } },
}).fetch();

export default {
  getAnnotationsById,
};
