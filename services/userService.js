const { usersQuery } = require('../db');

class UserService {
  async findUser(username) {
    const {
      rows,
    } = await usersQuery(
      'SELECT "id", "username", "password" FROM public."usersInfoTable" WHERE "username"= $1',
      [username]
    );
    
    return rows[0];
  }

  async getAll() {
    const { rows } = await usersQuery(`SELECT * FROM public."usersInfoTable"`);

    return rows;
  }

  async save({
    id,
    username,
    firstName,
    lastName,
    password,
    role,
    organization,
  }) {
    
    await usersQuery(
      `INSERT INTO public."usersInfoTable" 
      ("id", "username", "firstName", "lastName", "password", "role", "organization")
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, username, firstName, lastName, password, role, organization]
    );
  
  }
}

module.exports = UserService;