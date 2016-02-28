import {
    GraphQLObjectType
} from 'graphql';

import {
    globalIdField
} from 'graphql-relay';

import { nodeInterface } from 'schema/relayMapping';
import { TeamQuery } from './team';
import { PlayerQuery } from './player';

// Root type, a node serving as an entry point
const Root = new GraphQLObjectType({
    name: 'Root',
    interfaces: [nodeInterface],
    isTypeOf: () => Root,
    fields: () => ({
        id: globalIdField(),
        teams: TeamQuery.teams,
        players: PlayerQuery.players
    })
});

export default Root;
