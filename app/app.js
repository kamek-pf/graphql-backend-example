import Express from 'express';
import GraphHTTP from 'express-graphql';
import { Schema, RelaySchema } from 'schema/schema';
import cors from 'cors';

// Config
const APP_PORT = 3000;

// Start
const app = Express();
app.use(cors());

// GraphQL schema for Relay (needed, see todo in schema/schema.js)
app.use('/relay', GraphHTTP({
    schema: RelaySchema
}));

// GraphQL schema
app.use('/graphql', GraphHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true
}));

app.listen(APP_PORT, () => {
    console.log(`App listening on port ${APP_PORT}`);
});
