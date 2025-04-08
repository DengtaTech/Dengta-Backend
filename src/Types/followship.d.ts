import { User } from '../Database/Entities/user.ts';

export interface IFolloweeWithFollowers {
  followee: User;
  followers: Pick<User, 'id' | 'fullName' | 'email'>[];
}
