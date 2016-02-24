import { Team } from 'schema/types/team';
import { Player } from 'schema/types/player';

// Kind of meh, you wouldn't need that with a proper ORM anyway
const getSchemaType = (type) => {
    switch (type) {
        case 'Player':
            return Player;

        case 'Team':
            return Team;

        default:
            return null;
    }
};

export default getSchemaType;
