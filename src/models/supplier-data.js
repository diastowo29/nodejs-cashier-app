module.exports = (sequelize, type) => {
    return sequelize.define('supplier-data', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nama_supplier: type.STRING(100),
        telp_supplier: type.STRING(100),
        item_supplier: type.STRING(100)
    });
}