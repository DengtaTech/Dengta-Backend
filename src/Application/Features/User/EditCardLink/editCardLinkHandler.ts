import { userService } from '../../../../Infrastructure/Service/userService.js';
import { editCardLinkRes } from './editCardLinkRes.js';

export const editCardLinkHandler = {
  handle: async (
    userId: string,
    editLink: string,
    latest: boolean,
    footprintId?: string | null,
  ): Promise<EditCardLink.IEditCardLinkRes> => {
    const result = await userService.editLink(
      userId,
      editLink,
      latest,
      footprintId,
    );

    return editCardLinkRes.customize(result);
  },
};
