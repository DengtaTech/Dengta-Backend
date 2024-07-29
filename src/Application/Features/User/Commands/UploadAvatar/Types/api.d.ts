import { User, UserCredential } from './entities';

declare namespace UploadAvatar {
  interface IUploadAvatarResponse {
    data: {
      filename: string;
      url: string;
    };
  }
}
