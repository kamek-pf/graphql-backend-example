import {
    db,
    conn as pendingConnection
} from '../database';

// Resolver used in the root query
async function rootResolver(parent, args, tableName) {
    const connection = await pendingConnection;
    const cursor = await db.table(tableName)
        .filter(args)
        .run(connection);

    return await cursor.toArray();
}

export { rootResolver };
