import {
  IsString,
  IsDateString,
  IsEnum,
  validate,
  IsNotEmpty,
  IsBoolean,
  IsArray,
} from 'class-validator';

export const validatePublishFootprintReqBody = async (
  body: Record<string, unknown>,
): Promise<string[]> => {
  const dto = Object.assign(new PublishFootprintDto(), body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    return errors.map((err) => Object.values(err.constraints ?? {}).join(', '));
  }
  return [];
};

export class PublishFootprintDto {
  @IsNotEmpty()
  @IsString()
  footprintId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsString()
  category!: string;

  @IsNotEmpty()
  @IsBoolean()
  milestone!: boolean;

  @IsNotEmpty()
  @IsDateString()
  occurAt!: string;

  @IsNotEmpty()
  @IsEnum(['published', 'draft', 'invisible'])
  status!: string;

  @IsNotEmpty()
  @IsArray()
  tags!: string[];
}
