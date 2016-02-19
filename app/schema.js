import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLList
} from 'graphql';

import { createConnection, db } from './database';

// RethinkDB connection
const pendingConnection = createConnection();

// Representation of the Team table
const Team = new GraphQLObjectType({
    name: 'Team',
    descripton: 'CS:GO Teams',
    fields: {
        id: {
            type: GraphQLString,
            resolve(team) {
                return team.id;
            }
        },
        tag: {
            type: GraphQLString,
            resolve(team) {
                return team.tag;
            }
        },
        name: {
            type: GraphQLString,
            resolve(team) {
                return team.name;
            }
        }
    }
});

// Representation of the Player table
const Player = new GraphQLObjectType({
    name: 'Player',
    descripton: 'CS:GO Pro players',
    fields: {
        id: {
            type: GraphQLString,
            resolve(player) {
                return player.id;
            }
        },
        name: {
            type: GraphQLString,
            resolve(player) {
                return player.name;
            }
        },
        firstName: {
            type: GraphQLString,
            resolve(player) {
                return player.firstName;
            }
        },
        lastName: {
            type: GraphQLString,
            resolve(player) {
                return player.lastName;
            }
        },
        team: {
            type: Team,
            resolve: async function(player) {
                const connection = await pendingConnection;
                const cursor = await db.table('teams')
                    .filter({ id: player.team })
                    .run(connection);

                return await cursor.next();
            }
        },
        gender: {
            type: GraphQLString,
            resolve(player) {
                return player.gender;
            }
        }
    }
});

// Root query, using the objects defined above
const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query object',
    fields: {
        teams: {
            type: new GraphQLList(Team),
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                tag: { type: GraphQLString }
            },
            resolve: (source, args) => rootResolver(source, args, 'teams')
        },
        players: {
            type: new GraphQLList(Player),
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                team: { type: GraphQLString },
                gender: { type: GraphQLString }
            },
            resolve: (source, args) => rootResolver(source, args, 'players')
        }
    }
});

// Resolver used in the root query
async function rootResolver(parent, args, tableName) {
    const connection = await pendingConnection;
    const cursor = await db.table(tableName)
        .filter(args)
        .run(connection);

    return await cursor.toArray();
}

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Alter tables with this',
    fields: {
        addPlayer: {
            type: Player,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve: async function (source, args) {
                const connection = await pendingConnection;
                const insertion = await db.table('players')
                    .insert(args)
                    .run(connection);

                const id = insertion.generated_keys[0];
                const result = await db.table('players').get(id)
                    .run(connection);

                return result;
            }
        }
    }
});

// @TODO: Remove this
// See : https://github.com/facebook/relay/issues/112
// TL;DR: This 'root' object is a work around and should go away when #112 gets fixed
const Root = new GraphQLObjectType({
    name: 'Root',
    fields: {
        root: {
            type: Query,
            resolve: () => ({})
        }
    }
});

// @TODO: remove Root and use Query
// The schema itself
const RelaySchema = new GraphQLSchema({
    query: Root,
    mutation: Mutation
});

// @TODO: remove Root and use Query
// The schema itself
const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export { RelaySchema, Schema };
