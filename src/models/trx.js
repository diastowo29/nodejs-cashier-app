module.exports = (sequelize, type) => {
    return sequelize.define('trx-data', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        barcode: type.STRING(100),
        harga: type.INTEGER,
        diskon: type.INTEGER,
        margin: type.INTEGER,
        qty: type.INTEGER,
        total: type.INTEGER,
        pembayaran: type.INTEGER,
        trx_date: type.STRING(50),
    });
}