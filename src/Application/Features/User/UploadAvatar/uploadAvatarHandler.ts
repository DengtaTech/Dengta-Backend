import { userService } from '../../../../Infrastructure/Service/userService.js';
import { minioService } from '../../../../Infrastructure/Service/minioService.js';
import { uploadAvatarRes } from './uploadAvatarRes.js';
import { UploadAvatar } from './Types/api.js';

export const uploadAvatarHandler = {
  handle: async (
    userId: string,
    file: Express.Multer.File,
  ): Promise<UploadAvatar.IUploadAvatarResponse> => {
    const permanentURL = await minioService.uploadAvatar(userId, file);
    if (!permanentURL) {
      throw new Error('Failed to upload avatar');
    }

    await userService.updateAvatar(userId, permanentURL);

    const response = await uploadAvatarRes.customize(permanentURL);
    return response;
  },
};
