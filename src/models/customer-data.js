module.exports = (sequelize, type) => {
    return sequelize.define('customer-data', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nama_customer: type.STRING(100),
        telp_customer: type.STRING(100),
        alamat_customer: type.TEXT
    });
}