#!/usr/bin/env babel-node --optional es7.asyncFunctions

import fs from 'fs';
import path from 'path';
import Schema from '../app/schema';
import { graphql }  from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

// Save JSON of full schema introspection for Babel Relay Plugin to use
async function updateSchema() {
    var result = await (graphql(Schema, introspectionQuery));
    if (result.errors) {
        console.error(
            'ERROR introspecting schema: ',
            JSON.stringify(result.errors, null, 2)
        );
    } else {
        fs.writeFileSync(
            path.join(__dirname, '../schemas/schema.json'),
            JSON.stringify(result, null, 2)
        );
        console.log('Schema generated');
    }
}

updateSchema();

// Save user readable type system shorthand of schema
fs.writeFileSync(
    path.join(__dirname, '../schemas/schema.graphql'),
    printSchema(Schema)
);