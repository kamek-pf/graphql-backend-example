import r from 'rethinkdb';
import config from './dbConfig';

const db = r.db(config.dbName);

async function createConnection() {
    return await r.connect(config);
}

const pendingConnection = createConnection();

const DataSource = {
    // Find multiple elements
    find: async function find(tableName, args) {
        const connection = await pendingConnection;
        const cursor = await db.table(tableName)
            .filter(args)
            .run(connection);

        return await cursor.toArray();
    },

    // Find one element
    findOne: async function findOne(tableName, id) {
        const connection = await pendingConnection;
        const result = await db.table(tableName)
            .get(id)
            .run(connection);

        return result;
    },

    // Insert one element
    insert: async function insert(tableName, args) {
        const connection = await pendingConnection;
        const insertion = await db.table(tableName)
            .insert(args)
            .run(connection);

        const id = insertion.generated_keys[0];
        const result = await db.table(tableName)
            .get(id)
            .run(connection);

        return result;
    }
};

export default DataSource;
