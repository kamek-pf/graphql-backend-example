import {
    GraphQLObjectType,
    GraphQLString
} from 'graphql';

import {
    connectionFromPromisedArray,
    connectionDefinitions,
    connectionArgs,
    globalIdField
} from 'graphql-relay';

import { nodeInterface } from 'schema/relayMapping';
import DataSource from 'database';
import { Team } from './team';

// Representation of the Player table
const Player = new GraphQLObjectType({
    name: 'Player',
    descripton: 'CS:GO Competitive players',
    interfaces: [nodeInterface],
    isTypeOf: () => Player,
    fields: () => ({
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
            type: Team,
            resolve: (player) => DataSource.findOne('teams', player.team)
        },
        gender: {
            type: GraphQLString,
            resolve(player) {
                return player.gender;
            }
        }
    })
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

export { Player, PlayerQuery };
