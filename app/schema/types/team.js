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
import Registry from 'schema/registry';
import DataSource from 'database';
import Root from './root';

// Representation of the Team table
const Team = new GraphQLObjectType({
    name: 'Team',
    description: 'Team or Clan info',
    interfaces: () => [nodeInterface],
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

Registry.set('Team', Team);

// Add a new team
const AddTeamMutation = mutationWithClientMutationId({
    name: 'AddTeamMutation',
    inputFields: () => ({
        root: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) }
    }),
    outputFields: () => ({
        root: {
            type: Root,
            resolve: ({ root }) => root
        },
        team: {
            type: Team,
            resolve: ({ team }) => team
        }
    }),
    mutateAndGetPayload: async ({ root, name }) => {
        const newTeam = await DataSource.insert('teams', 'Team', { name });
        return { root, team: newTeam };
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
        args: {
            orderBy: { type: GraphQLString }
        },
        resolve: (source, args) => {
            if (!args.orderBy) args.orderBy = 'name';
            return DataSource.find('teams', args);
        }
    }
};

// Main mutation object
const TeamMutation = {
    addTeam: AddTeamMutation,
    capitalizeTeam: CapitalizeTeamMutation
};

export { Team, TeamQuery, TeamMutation };
