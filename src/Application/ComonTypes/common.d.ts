declare namespace Dengta {
  type oError = {
    error: string;
  };
  interface IUserObject {
    id: number;
    provider: string;
    email: string;
    realName: string;
    accountName: string;
    avatar: string;
  }
}
