CREATE SCHEMA IF NOT EXISTS test;

CREATE TABLE IF NOT EXISTS test.foo (
    "validator_pubkey" VARCHAR(128),
    "validator_id" VARCHAR(128),
    "validator_slashed" BOOLEAN,
    "status" VARCHAR(66),
    "balance" BIGINT,
    "slot" BIGINT,
    "slot_time" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (validator_pubkey, slot)
);
