import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql';

import {
    connectionFromPromisedArray,
    connectionDefinitions,
    connectionArgs,
    globalIdField
} from 'graphql-relay';

import DataSource from 'database';
import getSchemaType from 'schema/typeRegistry';
import { nodeInterface } from 'schema/relayMapping';

// Representation of the Player table
const Player = new GraphQLObjectType({
    name: 'Player',
    descripton: 'CS:GO Competitive players',
    interfaces: [nodeInterface],
    fields: {
        id: globalIdField(),
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
            type: getSchemaType('Team'),
            resolve: (player) => DataSource.findOne('teams', player.team)
        },
        gender: {
            type: GraphQLString,
            resolve(player) {
                return player.gender;
            }
        }
    }
});

// Used below, a node representing a list of players has a connection with
// each player node
const { connectionType: playerConnection } = connectionDefinitions({
    name: 'Player',
    nodeType: Player
});

const PlayerQuery = {
    playerList: {
        type: playerConnection,
        args: connectionArgs,
        resolve: (source, args) => connectionFromPromisedArray(
            DataSource.find('players', args),
            args
        )
    }
};

const PlayerMutation = {
    addPlayer: {
        type: Player,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            email: { type: GraphQLString },
            team: { type: GraphQLString }
        },
        resolve: (source, args) => DataSource.insert('players', 'Player', args)
    }
};

export { Player, PlayerQuery, PlayerMutation };
