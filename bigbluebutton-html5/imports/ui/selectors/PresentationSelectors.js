/* eslint import/prefer-default-export: 0 */
import Presentations from '/imports/api/presentations';

export const getPresentation = presentationId => Presentations.findOne({ 'presentation.id': presentationId });

export const getCurrentPresentationByPod = podId => Presentations.findOne({ podId, current: true });
