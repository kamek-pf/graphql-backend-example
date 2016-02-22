import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

import DataSource from 'database';
import { Team } from './team';

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
        resolve: (source, args) => DataSource.find('players', args)
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
        resolve: (source, args) => DataSource.insert('players', args)
    }
};

export { Player, PlayerQuery, PlayerMutation };
