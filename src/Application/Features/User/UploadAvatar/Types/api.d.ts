import { User, UserCredential } from './entities.ts';

declare namespace UploadAvatar {
  interface IUploadAvatarResponse {
    data: {
      url: string;
    };
  }
}
