import { userService } from '../../../../Infrastructure/Service/userService.js';
import { editCardLinkRes } from './editCardLinkRes.js';

export const editCardLinkHandler = {
  handle: async (
    userId: string,
    editLink: string,
  ): Promise<EditCardLink.IEditCardLinkRes> => {
    const result = await userService.editLink(userId, editLink);

    return editCardLinkRes.customize(result);
  },
};
