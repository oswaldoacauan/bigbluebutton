/* eslint import/prefer-default-export: 0 */
import WhiteboardMultiUser from '/imports/api/whiteboard-multi-user/';

export const getMultiUserStatusByWhiteboard = (whiteboardId) => {
  const wbMultiUser = WhiteboardMultiUser.findOne({ whiteboardId });
  return wbMultiUser && wbMultiUser.multiUser;
};
