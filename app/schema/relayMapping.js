import {
    fromGlobalId,
    nodeDefinitions
} from 'graphql-relay';

import DataSource from 'database';

const getObjectFromId = (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
        case 'Player':
            return DataSource.findOne('players', id);

        case 'Team':
            return DataSource.findOne('teams', id);

        default:
            return null;
    }
};

// @TODO
const getTypeFromObject = (obj) => {
    if (obj instanceof Game) {
        return gameType;
    } else if (obj instanceof HidingSpot)  {
        return hidingSpotType;
    } else {
        return null;
    }
};

export const { nodeInterface, nodeField } = nodeDefinitions(getObjectFromId, getTypeFromObject);
