import { Bowl } from '../../../../../Database/Entities/bowl.js';
declare namespace PublishBowl {
  interface IPublishBowlResponse {
    data: {
      bowl: Bowl;
    };
  }
}
