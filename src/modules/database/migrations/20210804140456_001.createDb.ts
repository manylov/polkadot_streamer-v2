import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void[]> {
  return Promise.all([
    knex.raw('CREATE  SCHEMA IF NOT EXISTS dot_polka'),
    knex.schema.withSchema('dot_polka').createTable('_config', function (table) {
      table.string('key')
      table.string('value')
    }),
    knex.schema.withSchema('dot_polka').createTable('blocks', function (table) {
      table.bigInteger('id')
      table.primary(['id'])
      table.string('hash')
      table.string('state_root')
      table.string('extrinsics_root')
      table.string('parent_hash')
      table.string('author')
      table.integer('session_id')
      table.integer('era')
      table.integer('current_era')
      table.string('last_log')
      table.jsonb('digest')
      table.timestamp('block_time')
    }),
    knex.schema.withSchema('dot_polka').createTable('events', function (table) {
      table.integer('id')
      table.primary(['id'])
      table.bigInteger('block_id')
      table.integer('session_id')
      table.integer('era')
      table.string('section')
      table.string('method')
      table.jsonb('data')
      table.jsonb('event')
    }),
    knex.schema.withSchema('dot_polka').createTable('extrinsics', function (table) {
      table.integer('id')
      table.primary(['id'])
      table.bigInteger('block_id')
      table.integer('session_id')
      table.integer('era')
      table.string('section')
      table.string('method')
      table.integer('mortal_period')
      table.integer('mortal_phase')
      table.boolean('is_signed')
      table.string('signer')
      table.integer('tip')
      table.double('nonce')
      table.specificType('ref_event_ids', 'VARCHAR(150)[]')
      table.integer('version')
      table.jsonb('extrinsic')
      table.jsonb('args')
    }),
    knex.schema.withSchema('dot_polka').createTable('eras', function (table) {
      table.integer('era')
      table.primary(['era'])
      table.integer('session_start')
      table.bigInteger('total_reward')
      table.bigInteger('total_stake')
      table.integer('total_reward_points')
    }),
    knex.schema.withSchema('dot_polka').createTable('validators', function (table) {
      table.integer('era')
      table.string('account_id')
      table.bigInteger('total')
      table.bigInteger('own')
      table.integer('nominators_count')
      table.integer('rewards_point')
      table.string('reward_dest')
      table.string('reward_account_id')
      table.jsonb('prefs')
      table.timestamp('block_time')
      table.primary(['era', 'account_id'])
    }),
    knex.schema.withSchema('dot_polka').createTable('nominators', function (table) {
      table.integer('era')
      table.string('account_id')
      table.string('validator')
      table.boolean('is_clipped')
      table.bigInteger('value')
      table.string('reward_dest')
      table.string('reward_account_id')
      table.timestamp('block_time')
      table.primary(['era', 'account_id', 'validator'])
    }),
    knex.schema.withSchema('dot_polka').createTable('account_identity', function (table) {
      table.string('account_id')
      table.primary(['account_id'])
      table.string('root_account_id')
      table.string('display')
      table.string('legal')
      table.string('web')
      table.string('riot')
      table.string('email')
      table.string('twitter')
      table.string('judgement_status')
      table.bigInteger('registrar_index')
      table.bigInteger('created_at')
      table.bigInteger('killed_at')
    })
  ])
}

export async function down(knex: Knex): Promise<void[]> {
  return Promise.all([
    knex.schema.withSchema('dot_polka').dropTable('_config'),
    knex.schema.withSchema('dot_polka').dropTable('blocks'),
    knex.schema.withSchema('dot_polka').dropTable('events'),
    knex.schema.withSchema('dot_polka').dropTable('extrinsics'),
    knex.schema.withSchema('dot_polka').dropTable('eras'),
    knex.schema.withSchema('dot_polka').dropTable('valdators'),
    knex.schema.withSchema('dot_polka').dropTable('nominators'),
    knex.schema.withSchema('dot_polka').dropTable('account_identity')
  ])
}
