declare namespace Dengta {
  type oError = {
    error: string;
  };
  type Gender = "male" | "female" | "nonbinary" | "notdisclosed";

  type UserAvatar =
    | `https://${number}.${number}.${number}.${number}/${string}/${string}`
    | '';
}
