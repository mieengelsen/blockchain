import express from 'express';
import { pool } from '../db/connect.js';

const db = pool();

const port = 3003;
const server = express();
server.use(express.static('frontend'));
server.use(onEachRequest);
server.get('/api/address/active/:symbol',onGetActiveAddresses);
server.get('/api/transfer/:hash', onGetTransferHash);
server.get('/api/transactions/:hash', onGetTimestamp);
server.get('/api/blocks/:height', onGetBlocksHeight)
server.listen(port, onServerReady);

async function onGetActiveAddresses(request, response) {
    const symbol = request.params.symbol;
    const dbresult = await db.query(`
        select distinct address_name
        from   addresses a
        join transfers t
            on a.address_id = sender_address_id
            or a.address_id = receiver_address_id
        join currency c using (currency_id) 
        where c.symbol = $1`, 
        [symbol]);
    response.json(dbresult.rows);
}

async function onGetTransferHash(request, response) {
    const hash = request.params.hash;
    const dbresult = await db.query(`
    select distinct
        t.amount,
        sender.address_name as sender_address,
        receiver.address_name as receiver_address,
        c.symbol
    from transactions tr
    join transfers t using (transaction_id)
    join currency c using (currency_id)
    join addresses sender
        on sender.address_id = t.sender_address_id
    join addresses receiver
        on receiver.address_id = t.receiver_address_id
    where tr.hash = $1`,
    [hash]);
    response.json(dbresult.rows);
    }

async function onGetTimestamp(request, response) {
    const hash = request.params.hash;
    const dbresult = await db.query(`
    select distinct "timestamp"
    from transactions tr
    join transfers t using (transaction_id)
    join currency c using (currency_id)
    join addresses sender
        on sender.address_id = t.sender_address_id
    join addresses receiver
        on receiver.address_id = t.receiver_address_id
    join blocks b using (block_id)
    where tr.hash = $1`,
    [hash]);
    response.json(dbresult.rows);
}


async function onGetBlocksHeight(request, response) {
    const hash = request.params.hash;
    const dbresult = await db.query(`
    select
     
    `,
    [xxx]);
    response.json(dbresult.rows);
}

function onServerReady() {
    console.log('Webserver running on port', port);
}

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}


