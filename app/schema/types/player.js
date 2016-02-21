import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

import {
    db,
    conn as pendingConnection
} from '../../database';

import { Team } from './team';
import { rootResolver } from '../resolvers';

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

const PlayerQuery = {
    playerList: {
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
};

const PlayerMutation = {
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
};

export { Player, PlayerQuery, PlayerMutation };
