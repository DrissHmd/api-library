export class NotFoundError extends Error {
  public status: number;

  constructor(message: string) {
  
    super(message);
    this.status = 404;
  }
}

export class ForbiddenError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.status = 403;
  }
}