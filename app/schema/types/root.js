import {
    GraphQLObjectType
} from 'graphql';

import {
    globalIdField
} from 'graphql-relay';

import { nodeInterface } from 'schema/relayMapping';
import { TeamQuery } from './team';
import { PlayerQuery } from './player';
import Registry from 'schema/registry';
//
// const TeamQuery = Registry.get('TeamQuery');

// Root type, a node serving as an entry point
const Root = new GraphQLObjectType({
    name: 'Root',
    interfaces: () => [nodeInterface],
    fields: () => ({
        id: globalIdField(),
        teams: TeamQuery.teams,
        players: PlayerQuery.players
    })
});

Registry.set('Root', Root);

export default Root;
