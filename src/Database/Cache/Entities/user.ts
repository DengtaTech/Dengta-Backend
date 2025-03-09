import { GetUserInfo } from '../../../Application/Features/User/GetUserInfo/Types/api.js';
import { BaseEntity } from '../lib.js';

export class User extends BaseEntity {
  // user:<userId>
  protected static override REDIS_ROOT = 'user';

  public id!: number;
  public name!: string;
  public lifeRole!: string;
  public avatar!: string;
  public selfIntro!: string;

  public static async getById(
    id: number,
  ): Promise<DengtaC.Cache.IUserDetailObject | undefined> {
    return await super.get<User>(id);
  }

  public static async setById(
    id: number,
    value: DengtaC.Cache.IUserDetailObject,
    expireTime?: Partial<KeyToType<Property<User>, number>> | undefined,
  ) {
    await super.set<User>(id, value, expireTime);
  }

  public static async delById(id: number) {
    await super.del<User>(id);
  }
}

export class UserInfo extends BaseEntity {
  protected static override REDIS_ROOT: string = 'userinfo';

  public data!: GetUserInfo.UserWithHashtagsAndLinks;

  public static async getByUserId(
    id: string,
  ): Promise<GetUserInfo.UserWithHashtagsAndLinks | undefined> {
    const json = await super.get<UserInfo>(id);
    if (json !== undefined) {
      return json.data;
    } else {
      return undefined;
    }
  }

  public static async setByUserId(
    id: string,
    value: GetUserInfo.UserWithHashtagsAndLinks,
    expireTime?: number | undefined,
  ) {
    await super.set<UserInfo>(id, { data: value }, { data: expireTime });
  }

  public static async delByUserId(id: string) {
    await super.del<UserInfo>(id);
  }
}
