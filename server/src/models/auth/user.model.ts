export class User {
  constructor(
    public readonly sub: string,
    public readonly email?: string,
    public readonly username?: string,
    public readonly roles: string[] = [],
    public readonly givenName?: string,
    public readonly familyName?: string
  ) {}

  get fullName(): string | undefined {
    if (this.givenName && this.familyName) {
      return `${this.givenName} ${this.familyName}`;
    }
    return this.givenName || this.familyName;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.roles.includes(role));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.roles.includes(role));
  }
}
