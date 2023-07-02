export default class User {
  constructor(readonly userName: string, readonly hashedPassword: string, readonly id = '') {}
}
