import { init } from "./lib.js";
import { User } from "./Entities/user.js";

export function initDbCache() {
  init(User);
}