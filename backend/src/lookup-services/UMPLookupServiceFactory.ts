import { LookupService } from '@bsv/overlay'
import { Script, PushDrop, Utils } from '@bsv/sdk'
import { UMPRecord, UTXOReference } from '../types.js'
import { Db, Collection } from 'mongodb'

/**
 * Implements a Lookup Service for the User Management Protocol
 */
class UMPLookupService implements LookupService {
  records: Collection<UMPRecord>

  constructor(db: Db) {
    this.records = db.collection<UMPRecord>('ump')
  }

  async getDocumentation(): Promise<string> {
    return '# UMP Lookup Service'
  }

  async getMetaData(): Promise<{ name: string; shortDescription: string; iconURL?: string; version?: string; informationURL?: string }> {
    return {
      name: 'UMP Lookup Service',
      shortDescription: 'Lookup Service for User Management Protocol tokens'
    }
  }

  /**
   * Notifies the lookup service of a new output added.
   * @param {Object} obj all params are given in an object
   * @param {string} obj.txid the transactionId of the transaction this UTXO is apart of
   * @param {Number} obj.outputIndex index of the output
   * @param {Buffer} obj.outputScript the outputScript data for the given UTXO
   * @returns {string} indicating the success status
   */
  async outputAdded(txid: string, outputIndex: number, outputScript: Script, topic: string) {
    if (topic !== 'tm_users') return
    // Decode the UMP fields from the Bitcoin outputScript
    const result = PushDrop.decode(outputScript)

    // UMP Account Fields to store (from the UMP protocol's PushDrop field order)
    const presentationHash = Utils.toHex(result.fields[6])
    const recoveryHash = Utils.toHex(result.fields[7])

    // Store UMP fields in db
    await this.records.insertOne({
      txid,
      outputIndex,
      presentationHash,
      recoveryHash
    })
  }

  /**
   * Deletes the output record once the UTXO has been spent
   * @param {ob} obj all params given inside an object
   * @param {string} obj.txid the transactionId the transaction the UTXO is apart of
   * @param {Number} obj.outputIndex the index of the given UTXO
   * @param {string} obj.topic the topic this UTXO is apart of
   * @returns
   */
  async outputSpent(txid: string, outputIndex: number, topic: string) {
    if (topic !== 'tm_users') return
    await this.records.deleteOne({ txid, outputIndex })
  }

  /**
   *
   * @param {object} obj all params given in an object
   * @param {object} obj.query lookup query given as an object
   * @returns {object} with the data given in an object
   */
  async lookup({ query }: any): Promise<UTXOReference[]> {
    // Validate Query
    if (!query) {
      throw new Error('Lookup must include a valid query!')
    }
    if (query.presentationHash) {
      const result = await this.records.findOne({ presentationHash: query.presentationHash })
      if (!result) return []
      return [{ txid: result.txid, outputIndex: result.outputIndex }]
    } else if (query.recoveryHash) {
      const result = await this.records.findOne({ recoveryHash: query.recoeryHash })
      if (!result) return []
      return [{ txid: result.txid, outputIndex: result.outputIndex }]
    } else if (query.outpoint) {
      const [txid, outputIndex] = (query.outpoint as string).split('.')
      const result = await this.records.findOne({ txid, outputIndex: Number(outputIndex) })
      if (!result) return []
      return [{ txid: result.txid, outputIndex: result.outputIndex }]
    } else {
      throw new Error('Query parameters must include presentationHash, recoveryHash, or outpoint!')
    }
  }
}

export default (db: Db) => new UMPLookupService(db);
