import r from 'rethinkdb';
import config from './dbConfig';

import { fromGlobalId } from 'graphql-relay';

const db = r.db(config.dbName);

async function createConnection() {
    return await r.connect(config);
}

const pendingConnection = createConnection();

const DataSource = {
    // Find multiple elements
    find: async (tableName, args) => {
        let alteredArgs = {};
        if (args.id) {
            const { id } = fromGlobalId(args.id);
            alteredArgs = { id };
        }

        const connection = await pendingConnection;
        const cursor = await db.table(tableName)
            .filter(alteredArgs)
            .run(connection);

        return await cursor.toArray();
    },

    // Find one element
    findOne: async (tableName, id) => {
        const connection = await pendingConnection;
        const result = await db.table(tableName)
            .get(id)
            .run(connection);

        return result;
    },

    // Insert one element
    insert: async (tableName, type, args) => {
        const connection = await pendingConnection;
        const insertion = await db.table(tableName)
            .insert({ type, ...args })
            .run(connection);

        const id = insertion.generated_keys[0];
        const result = await db.table(tableName)
            .get(id)
            .run(connection);

        return result;
    }
};

export default DataSource;
