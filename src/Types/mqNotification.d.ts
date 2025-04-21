import { Footprint } from '../Database/Entities/footprint.ts';
import { NotificationType } from '../Database/Entities/notification.ts';
import { User } from '../Database/Entities/user.js';

interface IEmailForm {
  destinationEmail: string;
  subject: string;
  content: string;
  type: NotificationType;
}

type TNewFootprintMessageMetadata = Pick<User, 'fullName' | 'avatar'> & {
  footprintId: Footprint['id'];
};

export interface INewFollowMessage extends IEmailForm {
  metadata: Pick<User, 'id' | 'fullName' | 'avatar' | 'lifeRole'> & {
    cardLink: string;
  };
}

export interface INewFootprintMessage extends IEmailForm {
  metadata: TNewFootprintMessageMetadata;
}
