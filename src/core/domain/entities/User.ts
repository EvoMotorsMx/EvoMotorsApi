export class User {
  constructor(
    public username: string,
    public attributes: { [key: string]: any },
  ) {}
}
