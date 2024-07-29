import { UploadAvatar } from './Types/api.js';

export const uploadAvatarRes = {
  customize: async (
    filename: string,
    presignedAvatarUrl: string,
  ): Promise<UploadAvatar.IUploadAvatarResponse> => {
    const response: UploadAvatar.IUploadAvatarResponse = {
      data: {
        filename,
        url: presignedAvatarUrl,
      },
    };
    return response;
  },
};
