const Sequelize = require('sequelize')
const itemModel = require('./models/item-data')
const customerModel = require('./models/customer-data')
const supplierModel = require('./models/supplier-data')
const trxModel = require('./models/trx')

var sequelize_db;

if (process.env.DATABASE_URL === undefined) {
	sequelize_db = new Sequelize('cashier-app', 'postgres', 'R@hasia', {
	  host: 'localhost',
	  dialect: 'postgres'
	});
} else {
	sequelize_db = new Sequelize(process.env.DATABASE_URL, {
		logging: false,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
		    },
		    keepAlive: true,
		},      
		ssl: true
	})
}


const itemTabel = itemModel(sequelize_db, Sequelize)
const customerTabel = customerModel(sequelize_db, Sequelize)
const supplierTabel = supplierModel(sequelize_db, Sequelize)
const trxTabel = trxModel(sequelize_db, Sequelize)

sequelize_db.sync({ alter: true })
  .then(() => {
    console.log(`Database & tables created!`)
    })

module.exports = {
	itemTabel,
	customerTabel,
	supplierTabel,
	trxTabel
}