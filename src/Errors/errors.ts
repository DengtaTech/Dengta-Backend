// errors.ts - Define custom error classes
import { ValidationError } from 'class-validator';

export function extractErrors(errors: ValidationError[]): string[] {
  const errorMessages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      errorMessages.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      errorMessages.push(...extractErrors(error.children));
    }
  }

  return errorMessages;
}
export class BaseError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class FootprintNotEnoughError extends BaseError {
  constructor() {
    super('Footprint not enough', 403);
  }
}

export class EmailExistsError extends BaseError {
  constructor() {
    super('Email already exists', 403);
  }
}

export class UserNotFoundError extends BaseError {
  constructor() {
    super('Email not signed up', 404);
  }
}
export class FootprintNotFoundError extends BaseError {
  constructor() {
    super('Footprint not found', 404);
  }
}

export class NoTokenError extends BaseError {
  constructor() {
    super('Client error - No token provided', 401);
  }
}

export class WrongTokenError extends BaseError {
  constructor() {
    super('Client error - Invalid token', 403);
  }
}

export class WrongPasswordError extends BaseError {
  constructor() {
    super('Client error - wrong password', 403);
  }
}

export class InputEmptyError extends BaseError {
  constructor() {
    super('Client error - Input field should not be empty', 400);
  }
}

export class InvalidInputError extends BaseError {
  constructor(message: string) {
    super(`Client error - Invalid input: ${message}`, 400);
  }
}

export class SameOperatingTargetingUserError extends BaseError {
  constructor() {
    super("Client error - You can't do this to yourself", 400);
  }
}

export class EmailFormatError extends BaseError {
  constructor() {
    super('Email format problem', 403);
  }
}

export class CardUrlAlreadyExistsError extends BaseError {
  constructor() {
    super('Card url already exists', 403);
  }
}

export class CardUrlNotExistsError extends BaseError {
  constructor() {
    super('Card url not exists', 403);
  }
}

export class UnauthorizedError extends BaseError {
  constructor() {
    super('Unauthorized - Admin privileges required', 403);
  }
}

export class DatabaseError extends BaseError {
  constructor() {
    super('Database Error', 500);
  }
}

export class EmbeddingServerError extends BaseError {
  constructor() {
    super('Embedding Server Error', 500);
  }
}
