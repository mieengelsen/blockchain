--transactions
insert into transactions(transaction_id, "hash", block_id)
values (201, 5ac6, 301),
(202, 78af, 302),
(203, 9cb6, 302),
(204, 04aa, 302),
(205, af78, 303),
(206, 9033, 303),
(207, acdf, 303),


-- addresses
insert into addresses(address_id, address_name)
values (101, 'a0324425e7'), 
(102, 'bo7c7e7df3'),
(103, 'c0acb3be5f'),
(104, 'd03894efe8'),
(105, 'e088c8d932'),
(106, 'f076a8c8b0'),
(107, 'coinbase')


--Pricepoint
insert into pricepoint("timestamp", usd_price, currency_id)
values(2026-03-01T06:00:00Z, 1 ,401),
(2026-03-03T06:00:00Z, 1 ,402),
(2026-03-09T06:00:00Z, 1 ,403)


--Blocks
insert into blocks(block_id, block_hash, "timestamp")
values (301, 000ffe7, 2026-03-01T07:30:00Z),
(302, 0002a81, 2026-03-03T14:00:00Z),
(303, 0003bb6, 2026-03-09T22:30:00Z)


--Currency
insert into currency(currency_id, symbol, "name")
values(401, "ETH", "ether"),
(402, "LINK", "Chainlink")
(403, 'USDC', 'US coin')


--transfers
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



--FUNKTIONERNE

--onGetActiveAddresses
select distinct address_name, symbol
from   addresses a
join transfers t
    on a.address_id = sender_address_id
    or a.address_id = receiver_address_id
join currency c using (currency_id) 
where c.symbol = $1;


--onGetTransferWithHash
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
where tr.hash = '04aa';


--onGetTimestamp
select distinct "timestamp"
from transactions tr
join transfers t using (transaction_id)
join currency c using (currency_id)
join addresses sender
    on sender.address_id = t.sender_address_id
join addresses receiver
    on receiver.address_id = t.receiver_address_id
join blocks b using (block_id)
where tr.hash = '04aa';








