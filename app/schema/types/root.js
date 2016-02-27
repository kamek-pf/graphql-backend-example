import {
    GraphQLObjectType
} from 'graphql';

import {
    globalIdField
} from 'graphql-relay';

import { TeamQuery } from './team';
import { nodeInterface } from 'schema/relayMapping';

// Root type, a node serving as an entry point
const Root = new GraphQLObjectType({
    name: 'Root',
    interfaces: [nodeInterface],
    isTypeOf: () => Root,
    fields: () => ({
        id: globalIdField(),
        teams: TeamQuery.teams
    })
});

export default Root;
