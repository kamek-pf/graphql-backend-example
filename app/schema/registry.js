let registry = new Map();

// Needed so nodeInterface doesn't shit the bed when importing types
// from relayMapping (causes circular deps)
const Registry = {
    get: (name) => {
        return registry.get(name);
    },
    set: (name, type) => {
        registry.set(name, type);
    }
};

export default Registry;
