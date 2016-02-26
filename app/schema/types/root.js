import {
    GraphQLObjectType
} from 'graphql';

import {
    globalIdField
} from 'graphql-relay';

import getModel from 'schema/typeRegistry';
import { nodeInterface } from 'schema/relayMapping';

// Root type, a node serving as an entry point
const Root = new GraphQLObjectType({
    name: 'Root',
    interfaces: [nodeInterface],
    fields: {
        id: globalIdField(),
        teams: getModel('Team').query.teams
    }
});

export default Root;
