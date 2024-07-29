import { userService } from '../../../../../Infrastructure/Service/userService.js';
import { minioService } from '../../../../../Infrastructure/Service/minioService.js';
import { uploadAvatarRes } from './uploadAvatarRes.js';
import { UploadAvatar } from './Types/api.js';
import { UploadAvatarError } from '../../../../../Errors/errors.js';

export const uploadAvatarHandler = {
  handle: async (
    userId: string,
    file: Express.Multer.File,
  ): Promise<UploadAvatar.IUploadAvatarResponse> => {

    const filename = await minioService.uploadAvatar(userId, file);
    if (!filename) {
        throw new UploadAvatarError();
    }

    await userService.updateAvatar(userId, filename);

    const presignedAvatarUrl = await minioService.getPresignedAvatarUrl(filename);
    const response = await uploadAvatarRes.customize(
      filename,
      presignedAvatarUrl as string,
    );
    return response;
  },
};
