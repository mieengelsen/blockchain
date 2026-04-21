import { connect } from './connect.js';
import upload from 'pg-upload';

const db = await connect(); // altså den skal vente med at gøre noget til forbindelsen til databasen oprettes
const timestamp = (await db.query('select now() as timestamp')).rows[0]['timestamp'];
console.log(`Recreating database on ${timestamp}...`);
/* await er den der gør at koden venter på at køre til resultatet er klar.
det er i parantes så den tages først */

await db.query('drop table if exists transactions');
await db.query('drop table if exists addresses');
await db.query('drop table if exists pricepoint');
await db.query('drop table if exists blocks');
await db.query('drop table if exists currency');
await db.query('drop table if exists transfers');

// TODO: drop more tables, if they exist

console.log('Creating tables...');
// en query er en database-forespørgsel - en slags kommando man sender til databasen for at gøre noget
await db.query(` 
    create table transactions (
        transaction_id integer,
        hash char(4),
        block_id integer
    )
`);

await db.query(` 
    create table addresses (
        address_id integer,
        address_name text
    )
`);

await db.query(` 
    create table pricepoint (
        timestamp timestamp,
        usd_price numeric,
        currency_id integer
    )
`);

await db.query(` 
    create table blocks (
        block_id integer,
        block_hash char(07),
        timestamp timestamp
    )
`);

await db.query(` 
    create table currency (
        currency_id integer,
        symbol text,
        name text
    )
`);

await db.query(` 
    create table transfers (
        transfer_id integer,
        sender_address_id integer,
        receiver_address_id integer,
        amount numeric,
        currency_id integer,
        transaction_id integer
    )
`);

await db.query(`
    insert into transactions(transaction_id, "hash", block_id)
    values (201, '5ac6', 301),
    (202, '78af', 302),
    (203, '9cb6', 302),
    (204, '04aa', 302),
    (205, 'af78', 303),
    (206, '9033', 303),
    (207, 'acdf', 303)
`);

await db.query(`
    insert into addresses(address_id, address_name)
    values (101, 'a0324425e7'), 
    (102, 'bo7c7e7df3'),
    (103, 'c0acb3be5f'),
    (104, 'd03894efe8'),
    (105, 'e088c8d932'),
    (106, 'f076a8c8b0'),
    (107, 'coinbase')
`);

await db.query(`
    insert into pricepoint("timestamp", usd_price, currency_id)
    values('2026-03-01T06:00:00Z', 1 ,401),
    ('2026-03-03T06:00:00Z', 1 ,402),
    ('2026-03-09T06:00:00Z', 1 ,403)
`);

await db.query(`
    insert into blocks(block_id, block_hash, "timestamp")
    values (301, '000ffe7', '2026-03-01T07:30:00Z'),
    (302, '0002a81', '2026-03-03T14:00:00Z'),
    (303, '0003bb6', '2026-03-09T22:30:00Z')
`);

await db.query(`
    insert into currency(currency_id, symbol, "name")
    values(401, 'ETH', 'ether'),
    (402, 'LINK', 'Chainlink'),
    (403, 'USDC', 'US coin')
`);
 
await db.query(`
    insert into transfers(transfer_id, sender_address_id, receiver_address_id, amount, currency_id, transaction_id)
    values(501, 107, 101, 5, 401, 201),
    (502, 107, 101, 5, 401, 202),
    (503, 101, 102, 2, 401, 203),
    (504, 101, 104, 2, 401, 203),
    (505, 101, 106, 3, 401, 204),
    (506, 106, 101, 760, 402, 204),
    (507, 107, 103, 5, 401, 205),
    (508, 101, 105, 540, 402, 206),
    (509, 101, 105, 1, 401, 206),
    (510, 104, 106, 1, 401, 207),
    (511, 106, 104, 2390, 403, 207)
`);





// TODO: import data from csv files into tables

await db.end();
console.log('Database successfully recreated.');