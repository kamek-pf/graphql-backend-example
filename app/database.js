import r from 'rethinkdb';
import config from './dbConfig';

const db = r.db(config.dbName);

async function createConnection() {
    return await r.connect(config);
}

export { db, createConnection };
