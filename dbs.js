/// decelarations
import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import initModels from './models/index.js';

//db concetion class
class DB_connect {
    constructor(PORT, NAME, USER, PASSWORD) {
        this.status = "on"
        this.port = PORT,
        this.db_name = NAME,
        this.db_user = USER,
        this.db_password = PASSWORD

        this.sequelize = null;
        this.models = {};
    };

    async connect() {
        this.sequelize = new Sequelize({
            dialect: PostgresDialect,
            database: this.db_name,
            user: this.db_user,
            password: this.db_password,
            host: '127.0.0.1',
            port: this.port,
        });

        this.models = initModels(this.sequelize);
        await this.sequelize.sync({ force: true });

        // the connection
        try {
            await this.sequelize.authenticate();
            console.log('[INFO] Connection to PostgreSQL established successfully.');
        } catch (error) {
            console.error('[ERROR] Unable to connect to the PostgreSQL database:', error);
        }
    };

    async disconnect() {
        if(this.status == "off" || this.status == null) return;

        try {
            await sequelize.close();
            console.log('[INFO] PostgreSQL established successfully.');
        } catch (error) {
            console.error('[ERROR] The PostgreSQL database:', error);
        }
    };
};

export default DB_connect;