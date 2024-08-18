import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  validate,
  IsArray,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export const validatePatchFootprintSettingReqBody = async (
  body: Record<string, unknown>,
): Promise<string[]> => {
  const dto = Object.assign(new PatchFootprintSettingReqBodyDto(), body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    return errors.map((err) => Object.values(err.constraints ?? {}).join(', '));
  }
  return [];
};

export class PatchFootprintSettingReqBodyDto {
  @IsNotEmpty()
  @IsString()
  footprintId!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  milestone?: boolean;

  @IsOptional()
  @IsDateString()
  occurAt?: string;

  @IsOptional()
  @IsEnum(['published', 'draft', 'invisible'])
  status?: string;

  @IsNotEmpty()
  @IsArray()
  tags!: string[];
}
