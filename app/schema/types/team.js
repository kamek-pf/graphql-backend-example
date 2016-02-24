import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} from 'graphql';

import {
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

const TeamQuery = {
    teams: {
        type: new GraphQLList(Team),
        resolve: (source, args) => DataSource.find('teams', args)
    }
};

const TeamMutation = {
    addTeam: {
        type: Team,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (source, args) => DataSource.insert('teams', 'Team', args)
    }
};

export { Team, TeamQuery, TeamMutation };
