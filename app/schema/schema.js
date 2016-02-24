import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';

import { PlayerQuery, PlayerMutation } from './types/player';
import { nodeField } from './relayMapping';
import { TeamQuery } from './types/team';

// Main Query object
const Root = new GraphQLObjectType({
    name: 'Root',
    description: 'Root query object',
    fields: {
        node: nodeField,
        teams: TeamQuery.teamList,
        players: PlayerQuery.playerList
    }
});

// Main mutation object
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Alter tables with this',
    fields: {
        addPlayer: PlayerMutation.addPlayer
    }
});

// @TODO: Remove this and use Root directly
// See : https://github.com/facebook/relay/issues/112
const Viewer = new GraphQLObjectType({
    name: 'Viewer',
    fields: {
        root: {
            type: Root,
            resolve: () => ({})
        }
    }
});

const Schema = new GraphQLSchema({
    query: Viewer,
    mutation: Mutation
});

export default Schema;
