// errors.ts - Define custom error classes

export class BaseError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export class EmailExistsError extends BaseError {
  constructor() {
    super('Email already exists', 403);
  }
}

export class UserNotFoundError extends BaseError {
  constructor() {
    super('Email not signed up', 403);
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
    super('Client error - Input field (images?) should not be empty', 400);
  }
}

export class EmailFormatError extends BaseError {
  constructor() {
    super('Email format problem', 403);
  }
}

export class DatabaseError extends BaseError {
  constructor() {
    super('Database Error', 500);
  }
}
