/* eslint-disable @typescript-eslint/no-non-null-assertion */
import pushdrop from 'pushdrop'
import { AdmittanceInstructions, TopicManager } from '@bsv/overlay'
import { Transaction, PublicKey, Signature } from '@bsv/sdk'

const CWI_PROTOCOL_ADDRESS = '14HpZFLijstRS8H1P7b6NdMeCyH6HjeBXF'

/**
 * Implements a topic manager for User Management Protocol
 * @public
 */
export class UMPTopicManager implements TopicManager {
  identifyNeededInputs?: ((beef: number[]) => Promise<Array<{ txid: string; outputIndex: number }>>) | undefined
  async getDocumentation(): Promise<string> {
    return '# User Management Protocol'
  }

  async getMetaData(): Promise<{ name: string; shortDescription: string; iconURL?: string; version?: string; informationURL?: string }> {
    return {
      name: 'UMP',
      shortDescription: 'User Management Protocol'
    }
  }

  /**
   * Returns the outputs from the UMP transaction that are admissible.
   */
  async identifyAdmissibleOutputs(beef: number[], previousCoins: number[]): Promise<AdmittanceInstructions> {
    try {
      console.log('previous UTXOs', previousCoins.length)
      const outputs: number[] = []
      const parsedTransaction = Transaction.fromBEEF(beef)
      const previousUTXOs = previousCoins.map(x => ({
        txid: (parsedTransaction.inputs[x].sourceTXID || parsedTransaction.inputs[x].sourceTransaction?.id('hex')) as string,
        vout: parsedTransaction.inputs[x].sourceOutputIndex
      }))

      // Try to decode and validate transaction outputs
      for (const [i, output] of parsedTransaction.outputs.entries()) {
        // Decode the UMP account fields
        try {
          const result = pushdrop.decode({
            script: output.lockingScript.toHex(),
            fieldFormat: 'buffer'
          })

          if (result.fields[0].toString() === CWI_PROTOCOL_ADDRESS) {
            // Check if this is an update, or a new UMP token
            if (result.fields[2].toString('hex') !== '01') {
              // Validate the previousTXID is correct
              const previousOutpoint = result.fields[1].toString('hex')
              const previousTXID = previousOutpoint.slice(0, 64)
              const previousVout = parseInt(previousOutpoint.slice(64), 16)

              const [previousUTXO] = previousUTXOs.filter(x => x.txid === previousTXID && x.vout === previousVout)
              if (!previousUTXO) {
                throw new Error('Transaction does not spend some issuance output')
              }
            }

            const hasValidSignature = PublicKey.fromString(result.lockingPublicKey)
              .verify(
                [...Buffer.concat(result.fields)],
                Signature.fromDER(result.signature)
              )
            if (!hasValidSignature) {
              throw new Error('Invalid Signature')
            }
            outputs.push(i)
          }
        } catch (error) {
        }
      }
      if (outputs.length === 0) {
        throw new Error(
          'This transaction does not publish a valid CWI account descriptor!'
        )
      }

      // Returns an array of output numbers
      return {
        coinsToRetain: previousCoins,
        outputsToAdmit: outputs
      }
    } catch (error) {
      return {
        coinsToRetain: [],
        outputsToAdmit: []
      }
    }
  }
}