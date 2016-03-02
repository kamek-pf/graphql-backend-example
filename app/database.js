import r from 'rethinkdb';
import config from './dbConfig';

import { fromGlobalId } from 'graphql-relay';

const db = r.db(config.dbName);

async function createConnection() {
    return await r.connect(config);
}

const pendingConnection = createConnection();

// This whole thing is horrible, don't ever do that.
// Pick an ORM and define proper models
const DataSource = {
    // Find multiple elements
    find: async (tableName, args) => {
        let alteredArgs = { ...args };
        if (args.id) {
            const { id } = fromGlobalId(args.id);
            alteredArgs.id = id;
        }

        const { orderBy, ...rest } = args;
        alteredArgs = rest;

        const connection = await pendingConnection;
        const cursor = await db.table(tableName)
            .orderBy(orderBy)
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
    },

    // Useless example
    capitalize: async (tableName, nodeId, field) => {
        const { id } = fromGlobalId(nodeId);
        const connection = await pendingConnection;
        const query = await db.table(tableName)
            .get(id)
            .run(connection);

        const upperCase = query[field].toUpperCase();
        const updatedField = {};
        updatedField[field] = upperCase;

        await db.table(tableName)
            .get(id)
            .update(updatedField)
            .run(connection);

        const result = await db.table(tableName)
            .get(id)
            .run(connection);

        return result;
    }
};

export default DataSource;
