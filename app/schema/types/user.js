import {
    GraphQLObjectType
} from 'graphql';

import {
    globalIdField
} from 'graphql-relay';

import getModel from 'schema/typeRegistry';
import { nodeInterface } from 'schema/relayMapping';

// Represents anyone using the graph
const User = new GraphQLObjectType({
    name: 'User',
    interfaces: [nodeInterface],
    fields: {
        id: globalIdField(),
        teams: getModel('Team').query.teams
    }
});

export default User;
