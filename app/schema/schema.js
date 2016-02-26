import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';

import getModel from './typeRegistry';
import User from './types/user';
import { nodeField } from './relayMapping';

// Main Query object
const Root = new GraphQLObjectType({
    name: 'Root',
    fields: {
        node: nodeField,
        viewer: {
            type: User,
            resolve: () => ({}) // The user type has no data, it's just an entry point
        }
    }
});

// Main mutation object
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Alter tables with this',
    fields: {
        addPlayer: getModel('Player').mutation.addPlayer,
        addTeam: getModel('Team').mutation.addTeam
    }
});

const Schema = new GraphQLSchema({
    query: Root,
    mutation: Mutation
});

export default Schema;
