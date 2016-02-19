import {
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
            resolve: (root, args) => rootResolver(root, args, 'teams')
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
            resolve: (root, args) => rootResolver(root, args, 'players')
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

// Resolver used in the root query
async function rootResolver(element, args, tableName) {
    const connection = await pendingConnection;
    const cursor = await db.table(tableName)
        .filter(args)
        .run(connection);

    return await cursor.toArray();
}

// @TODO: remove Root and use Query
// The schema itself
const RelaySchema = new GraphQLSchema({
    query: Root
});

// @TODO: remove Root and use Query
// The schema itself
const Schema = new GraphQLSchema({
    query: Query
});

export { RelaySchema, Schema };
