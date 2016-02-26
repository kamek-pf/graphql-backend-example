import { Team, TeamQuery, TeamMutation } from 'schema/types/team';
import { Player, PlayerQuery, PlayerMutation } from 'schema/types/player';

// Kind of meh
const getModel = (type) => {
    switch (type) {
        case 'Player':
            return {
                type: Player,
                query: PlayerQuery,
                mutation: PlayerMutation
            };

        case 'Team':
            return {
                type: Team,
                query: TeamQuery,
                mutation: TeamMutation
            };

        default:
            return null;
    }
};

export default getModel;
