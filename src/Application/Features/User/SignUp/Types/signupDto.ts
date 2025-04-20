import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  ValidateNested,
  validate,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export const validateSignUpReqBodyReqBody = async (
  body: Record<string, unknown>,
): Promise<string[]> => {
  const dto = Object.assign(new SignUpReqBodyDto(), body);
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

export class SignUpReqBodyDto {
  @IsNotEmpty()
  @IsString()
  provider!: string;

  @IsNotEmpty()
  @IsString()
  clerkId!: string;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  lifeRole?: string;

  @IsNotEmpty()
  @IsDateString()
  birthday!: string;

  @IsNotEmpty()
  @IsEnum(['male', 'female', 'nonbinary', 'notdisclosed'])
  gender!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links!: LinkDto[];
}
