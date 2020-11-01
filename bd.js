const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize('postgres://oscav:1234@localhost:5432/sfile', { logging: false })
try {
    (async () => sequelize.authenticate())();
    console.log('Connection établie avec succes');
} catch (error) {
    console.error('Impossible de se connecter:', error);
}
const Files = sequelize.define('File', {
    name: { type: DataTypes.STRING, unique: true },
    size: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
    ext: { type: DataTypes.STRING },
    path: { type: DataTypes.STRING, unique: true }
});
(async () => Files.sync())()
module.exports = Files