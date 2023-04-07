const Sequelize = require("sequelize");
const connection = new Sequelize('blog_melo', 'root', '197697', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;