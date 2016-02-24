import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';

import { PlayerQuery, PlayerMutation } from './types/player';
import { TeamQuery, TeamMutation } from './types/team';
import { nodeField } from './relayMapping';

// Main Query object
const Root = new GraphQLObjectType({
    name: 'Root',
    description: 'Root query object',
    fields: {
        teams: TeamQuery.teams,
        players: PlayerQuery.playerList
    }
});

// Main mutation object
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Alter tables with this',
    fields: {
        addPlayer: PlayerMutation.addPlayer,
        addTeam: TeamMutation.addTeam
    }
});

// @TODO: Remove this and use Root directly
// See : https://github.com/facebook/relay/issues/112
const Viewer = new GraphQLObjectType({
    name: 'Viewer',
    fields: {
        node: nodeField,
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
