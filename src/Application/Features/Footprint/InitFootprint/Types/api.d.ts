import { Footprint } from '../../../../../Database/Entities/footprint.ts';
import { User } from '../../../../../Database/Entities/user.js';
declare namespace InitFootprint {
  interface IInitFootprintDto extends Pick<Footprint, 'id'> {
  }

  interface IInitFootprintResponse {
    data: {
      footprint: IInitFootprintDto;
    };
  }
}
