module.exports = (sequelize, type) => {
    return sequelize.define('trx-data', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        id_trx: type.STRING(100),
        barcode: type.STRING(100),
        harga: type.INTEGER,
        diskon: type.INTEGER,
        margin: type.INTEGER,
        qty: type.INTEGER,
        total: type.INTEGER,
        pembayaran: type.INTEGER,
        metode_pembayaran: type.STRING(100),
        trx_date: type.STRING(50),
    });
}