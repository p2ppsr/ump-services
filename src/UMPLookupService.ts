import pushdrop from 'pushdrop'
import { LookupService } from '@bsv/overlay'
import { Script } from '@bsv/sdk'
import { KnexStorageEngine } from './KnexStorageEngine'

/**
 * Implements a Lookup Service for the User Management Protocol
 */
export class UMPLookupService implements LookupService {
  storageEngine: KnexStorageEngine

  constructor(storageEngine: KnexStorageEngine) {
    this.storageEngine = storageEngine
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
    if (topic !== 'tm_ump') return
    // Decode the UMP fields from the Bitcoin outputScript
    const result = pushdrop.decode({
      script: outputScript.toHex(), // Is Buffer form supported by PushDrop?
      fieldFormat: 'buffer'
    })

    // UMP Account Fields to store
    const presentationKeyHash = result.fields[8].toString('base64')
    const recoveryKeyHash = result.fields[10].toString('base64')

    // Store UMP fields in the StorageEngine
    await this.storageEngine.storeRecord({
      txid,
      outputIndex,
      presentationKeyHash, // Should this be presentationHash? CWI-Core uses presentationHash instead of presentationKeyHash...
      recoveryKeyHash
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
    if (topic !== 'tm_ump') return
    await this.storageEngine.deleteRecord({ txid, outputIndex })
  }

  /**
   *
   * @param {object} obj all params given in an object
   * @param {object} obj.query lookup query given as an object
   * @returns {object} with the data given in an object
   */
  async lookup({ query }) {
    // Validate Query
    if (!query) {
      throw new Error('Lookup must include a valid query!')
    }
    if (query.presentationKeyHash) {
      return await this.storageEngine.findByPresentationKeyHash({
        presentationKeyHash: query.presentationKeyHash
      })
    } else if (query.recoveryKeyHash) {
      return await this.storageEngine.findByRecoveryKeyHash({
        recoveryKeyHash: query.recoveryKeyHash
      })
    } else {
      throw new Error('Query parameters must include presentationKeyHash or recoveryKeyHash!')
    }
  }
}