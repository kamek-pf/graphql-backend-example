import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';

import { PlayerQuery, PlayerMutation } from 'schema/types/player';
import { TeamQuery } from 'schema/types/team';

// Main Query object
const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query object',
    fields: {
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

// @TODO: Remove this
// See : https://github.com/facebook/relay/issues/112
const RelaySchema = new GraphQLSchema({
    query: Root,
    mutation: Mutation
});

// The schema itself
const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export { RelaySchema, Schema };
