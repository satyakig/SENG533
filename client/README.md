# Performance Client

A nodejs client for testing REST API performance scenarios.

### How to run
- Install `Node 12.x.x`
- Run `yarn install` (or npm install) to obtain dependencies

#### Simple example:
- `yarn start --server node --db sql`

#### Complex example:
- `yarn start --server java --db nosql --size 1 --freq 5 --num_users 1 --scenario post`

This example would send 1 KB POST messages to the java server's nosql route at a rate of 5 times per second

#### Accepted Arguments:
- See `args.js` for each of the accepted options