module.exports = (sequelize, type) => {
    return sequelize.define('item-data', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        barcode: type.STRING(100),
        nama_barang: type.STRING(100),
        harga: type.INTEGER,
        diskon: type.INTEGER,
        margin: type.FLOAT,
        harga_jual: type.INTEGER,
        stock: type.INTEGER
    });
}