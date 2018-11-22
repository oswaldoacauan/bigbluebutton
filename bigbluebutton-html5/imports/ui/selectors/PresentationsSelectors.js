/* eslint import/prefer-default-export: 0 */
import Presentations from '/imports/api/presentations';

export const getPresentationsByPod = podId => Presentations.findOne({ podId });
