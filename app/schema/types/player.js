import {
    GraphQLList,
    GraphQLString,
    GraphQLObjectType
} from 'graphql';

import {
    globalIdField
} from 'graphql-relay';

import { nodeInterface } from 'schema/relayMapping';
import Registry from 'schema/registry';
import DataSource from 'database';
import { Team } from './team';

// Representation of the Player table
const Player = new GraphQLObjectType({
    name: 'Player',
    description: 'CS:GO Competitive players',
    interfaces: () => [nodeInterface],
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

// Main query object
const PlayerQuery = {
    players: {
        type: new GraphQLList(Player),
        resolve: (source, args) => DataSource.find('players', args)
    }
};

Registry.set('Player', Player);
Registry.set('PlayerQuery', PlayerQuery);

export { Player, PlayerQuery };
