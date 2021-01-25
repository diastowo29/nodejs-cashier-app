module.exports = (sequelize, type) => {
    return sequelize.define('trx-users', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: type.STRING(100),
        password: type.STRING(100),
        state: type.STRING(100)
    });
}