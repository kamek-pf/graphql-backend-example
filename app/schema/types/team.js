import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

import DataSource from 'database';

// Representation of the Team table
const Team = new GraphQLObjectType({
    name: 'Team',
    descripton: 'CS:GO Teams',
    fields: {
        id: {
            type: GraphQLString,
            resolve(team) {
                return team.id;
            }
        },
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
    teamList: {
        type: new GraphQLList(Team),
        args: {
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            tag: { type: GraphQLString }
        },
        resolve: (source, args) => DataSource.find('teams', args)
    }
};

export { Team, TeamQuery };
