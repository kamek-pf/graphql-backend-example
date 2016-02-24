import {
    GraphQLObjectType,
    GraphQLString
} from 'graphql';

import {
    connectionFromPromisedArray,
    connectionDefinitions,
    connectionArgs,
    globalIdField
} from 'graphql-relay';

import DataSource from 'database';
import { nodeInterface } from 'schema/relayMapping';

// Representation of the Team table
const Team = new GraphQLObjectType({
    name: 'Team',
    descripton: 'CS:GO Teams',
    interfaces: [nodeInterface],
    fields: {
        id: globalIdField(),
        tag: {
            type: GraphQLString,
            resolve(team) {
                return team.tag;
            }
        },
        name: {
            type: GraphQLString,
            resolve(team) {
                return team.name;
            }
        }
    }
});

// Used below, a node representing a list of teams has a connection with
// each team node
const { connectionType: teamConnection } = connectionDefinitions({
    name: 'Team',
    nodeType: Team
});

// Main query object.
// teamList is just an entry point : a node connected to all the team nodes.
const TeamQuery = {
    teamList: {
        type: teamConnection,
        args: connectionArgs,
        resolve: (source, args) => connectionFromPromisedArray(
            DataSource.find('teams', args),
            args
        )
    }
};

export { Team, TeamQuery };
