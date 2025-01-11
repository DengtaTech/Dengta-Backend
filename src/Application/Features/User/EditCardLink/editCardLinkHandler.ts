import { userService } from '../../../../Infrastructure/Service/userService.js';
import { editCardLinkRes } from './editCardLinkRes.js';

export const editCardLinkHandler = {
  handle: async (
    userId: string,
    editLink: string,
    footprintId: string,
  ): Promise<EditCardLink.IEditCardLinkRes> => {
    const result = await userService.editLink(userId, editLink, footprintId);

    return editCardLinkRes.customize(result);
  },
};
