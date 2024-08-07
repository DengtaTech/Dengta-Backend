import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDateString,
  IsEnum,
  ValidateNested,
  validate,
} from 'class-validator';
import { Type } from 'class-transformer';

export const validatePatchUserInfoReqBody = async (
  body: Record<string, unknown>,
): Promise<string[]> => {
  const dto = Object.assign(new PatchUserInfoReqBodyDto(), body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    return errors.map((err) => Object.values(err.constraints ?? {}).join(', '));
  }
  return [];
};

export class LinkDto {
  @IsString()
  sourceName!: string;

  @IsString()
  url!: string;
}

export class PatchUserInfoReqBodyDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  lifeRole?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'nonbinary', 'notdisclosed'])
  gender?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('TW')
  phone?: string;

  @IsOptional()
  @IsString()
  selfIntro?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links?: LinkDto[];
}
