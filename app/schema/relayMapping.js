import {
    fromGlobalId,
    nodeDefinitions
} from 'graphql-relay';

import DataSource from 'database';
import Registry from 'schema/registry';

// Could do better by decoding type from global id
const getObjectFromId = async (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
        case 'Root':
            return { type: 'Root' };

        case 'Player':
            return {
                type: 'Player',
                ... await DataSource.findOne('players', id)
            };

        case 'Team':
            return {
                type: 'Team',
                ... await DataSource.findOne('teams', id)
            };

        default:
            return null;
    }
};

const getTypeFromObject = (obj) => Registry.get(obj.type);

export const { nodeInterface, nodeField } = nodeDefinitions(getObjectFromId, getTypeFromObject);
