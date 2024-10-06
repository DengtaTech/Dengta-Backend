import {
  ValidateNested,
  validate,
  IsArray,
  IsNumber,
  IsNotEmpty,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { extractErrors } from '../../../../../Errors/errors.js';

export function IsStringOrNull(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' || value === null;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string or null`;
        },
      },
    });
  };
}

export const validateInsertResponseReqBody = async (
  body: Record<string, unknown>,
): Promise<string[]> => {
  const dto = plainToInstance(QuestionResReqBodyDto, body, {
    enableImplicitConversion: true,
  });
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = extractErrors(errors);
    return messages;
  }
  return [];
};

export class QuestionResDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsStringOrNull({ message: 'response must be a string or null' })
  response!: string | null;
}

export class QuestionResReqBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionResDto)
  questionRes!: QuestionResDto[];
}
