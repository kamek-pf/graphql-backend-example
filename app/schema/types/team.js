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

import { nodeInterface } from 'schema/relayMapping';
import DataSource from 'database';

// Representation of the Team table
const Team = new GraphQLObjectType({
    name: 'Team',
    description: 'CS:GO Teams',
    interfaces: [nodeInterface],
    isTypeOf: () => Team,
    fields: () => ({
        id: globalIdField('Team'),
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
    })
});

// Add a new team
const AddTeamMutation = mutationWithClientMutationId({
    name: 'AddTeamMutation',
    inputFields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        tag: { type: GraphQLString }
    }),
    outputFields: () => ({
        team: {
            type: Team,
            resolve: ({ team }) => team
        }
    }),
    mutateAndGetPayload: async ({ name }) => {
        const res = await DataSource.insert('teams', 'Team', { name });
        return { team: res };
    }
});

// Capitalize a team name
const CapitalizeTeamMutation = mutationWithClientMutationId({
    name: 'CapitalizeTeamMutation',
    inputFields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) }
    }),
    outputFields: () => ({
        team: {
            type: Team,
            resolve: (team) => team
        }
    }),
    mutateAndGetPayload: async ({ id }) => {
        return await DataSource.capitalize('teams', id, 'name');
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
    addTeam: AddTeamMutation,
    capitalizeTeam: CapitalizeTeamMutation
};

export { Team, TeamQuery, TeamMutation };
