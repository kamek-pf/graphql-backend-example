import {
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';

import getModel from './typeRegistry';
import Root from './types/root';
import { nodeField } from './relayMapping';

// Main Query object
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        root: {
            type: Root,
            resolve: () => ({}) // The user type has no data, it's just an entry point
        }
    })
});

// Main mutation object
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Alter tables with this',
    fields: () => ({
        addTeam: getModel('Team').mutation.addTeam,
        capitalizeTeam: getModel('Team').mutation.capitalizeTeam
    })
});

const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

export default Schema;
