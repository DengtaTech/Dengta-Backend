declare namespace Dengta {
  type oError = {
    error: string;
  };
  type Gender = 0 | 1 | 2;

  type UserAvatar =
    | `https://${number}.${number}.${number}.${number}/${string}/${string}`
    | '';
}
