import { UploadAvatar } from './Types/api.js';

export const uploadAvatarRes = {
  customize: async (
    permanentURL: string,
  ): Promise<UploadAvatar.IUploadAvatarResponse> => {
    const response: UploadAvatar.IUploadAvatarResponse = {
      data: {
        url: permanentURL,
      },
    };
    return response;
  },
};
