import { User } from '../../../../../Database/Entities/user.js';
import { Link } from '../../../../../Database/Entities/link.js';
import { Footprint } from '../../../../../Database/Entities/footprint.ts';
import { FootprintHashTag } from '../../../../../Database/Entities/footprintHashTag.ts';
declare namespace PublishFootprint {
  interface IPublishFootprintReqBody
    extends Pick<
      Footprint,
      'title' | 'content' | 'category' | 'milestone' | 'occurAt' | 'status'
    > {
    tags: string[];
    footprintId: string;
  }
  interface IPublishFootprintDto extends Pick<Footprint, 'id'> {}
  interface IPublishFootprintResponse {
    data: {
      id: string;
      message?: string;
    };
  }
}
