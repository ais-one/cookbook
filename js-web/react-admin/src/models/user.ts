import { Role } from "./role";

export class User {
  constructor(
    public id: number = 0,
    public first_name: string = '',
    public last_name: string = '',
    public email: string = '',
    public role: Role = new Role()
  ) {
  }

  get name() {
    return this.first_name.substring(0, 1) + ' ' + this.last_name
  }
}
