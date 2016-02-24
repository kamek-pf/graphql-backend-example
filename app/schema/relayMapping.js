import {
    fromGlobalId,
    nodeDefinitions
} from 'graphql-relay';

import DataSource from 'database';
import getSchemaType from './typeRegistry';

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

const getTypeFromObject = (obj) => {
    return getSchemaType(obj.type);
};

export const { nodeInterface, nodeField } = nodeDefinitions(getObjectFromId, getTypeFromObject);
