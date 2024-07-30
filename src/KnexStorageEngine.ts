import makeMigrations from './makeMigrations'
import { Knex } from 'knex'

export default class KnexStorageEngine {
  knex: Knex
  tablePrefix: string
  migrations: {
    up: (knex: Knex) => Promise<void>
    down: (knex: Knex) => Promise<void>
  }[]

  constructor({ knex, tablePrefix = 'ump_lookup_' }) {
    this.knex = knex
    this.tablePrefix = tablePrefix
    this.migrations = makeMigrations({ tablePrefix })
  }

  /**
   * Stores a new UMP record
   * @param {object} obj all params given in an object
   * @param {string} obj.txid the transactionId of the transaction this UTXO is apart of
   * @param {Number} obj.vout index of the output
   * @param {String} obj.presentationKeyHash hashed UMP presentation key
   * @param {String} obj.recoveryKeyHash hashed UMP recover key
   */
  async storeRecord({ txid, vout, presentationKeyHash, recoveryKeyHash }) {
    await this.knex(`${this.tablePrefix}users`).insert({
      txid,
      vout,
      presentationKeyHash,
      recoveryKeyHash
    })
  }

  /**
   * Deletes an existing UMP record
   * @param {Object} obj all params given in an object
   */
  async deleteRecord({ txid, vout }) {
    await this.knex(`${this.tablePrefix}users`).where({
      txid,
      vout
    }).del()
  }

  /**
   * Look up a UMP record by the presentationKeyHash
   * @param {Object} obj params given in an object
   * @param {String} obj.presentationKeyHash hash of the UMP presentation key
   */
  async findByPresentationKeyHash({ presentationKeyHash }) {
    return await this.knex(`${this.tablePrefix}users`).where({
      presentationKeyHash
    }).select('txid', 'vout')
  }

  /**
   * Look up a UMP record by the recoverKeyHash
   * @param {Object} obj params given in an object
   * @param {String} obj.recoverKeyHash hash of the UMP recovery key
   */
  async findByRecoveryKeyHash({ recoveryKeyHash }) {
    return await this.knex(`${this.tablePrefix}users`).where({
      recoveryKeyHash
    }).select('txid', 'vout')
  }
}
