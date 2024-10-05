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
    hashtags: string[];
    footprintId: string;
  }
  // 未來需要再回傳 tags 因為還額外多query或join
  //   type PublishFootprintDto = {
  //     id: typeof Footprint.prototype.id;
  //     title: typeof Footprint.prototype.title;
  //     content: typeof Footprint.prototype.content;
  //     category: typeof Footprint.prototype.category;
  //     milestone: typeof Footprint.prototype.milestone;
  //     occurAt: typeof Footprint.prototype.occurAt;
  //     status: typeof Footprint.prototype.status;
  //     footprintHashTags: NonNullable<
  //       NonNullable<
  //         typeof Footprint.prototype.mFootprintFootprintHashTag
  //       >[number]['footprintHashTag']
  //     >['content'][];
  //   };
  //   interface IPublishFootprintDto extends Pick<Footprint, 'id'> {}
  interface IPublishFootprintResponse {
    data: {
      footrpint: Footprint;
    };
  }
}
