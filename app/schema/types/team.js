import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} from 'graphql';

import {
    mutationWithClientMutationId,
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

// Add a new player
const AddTeamMutation = mutationWithClientMutationId({
    name: 'AddTeamMutation',
    inputFields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        tag: { type: GraphQLString }
    },
    outputFields: {
        name: {
            type: GraphQLString,
            resolve: ({ name }) => name
        }
    },
    mutateAndGetPayload: async ({ name }) => {
        const res = await DataSource.insert('teams', 'Team', { name });
        return { ...res };
    }
});

// Main query object
const TeamQuery = {
    teams: {
        type: new GraphQLList(Team),
        resolve: (source, args) => DataSource.find('teams', args)
    }
};

// Main mutation object
const TeamMutation = {
    addTeam: AddTeamMutation
};

export { Team, TeamQuery, TeamMutation };
