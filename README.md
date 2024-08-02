# signia-services

Topic Manager and Lookup Service for Signia Key Registry

## API

<!--#region ts2md-api-merged-here-->

Links: [API](#api), [Classes](#classes)

### Classes

| |
| --- |
| [KnexStorageEngine](#class-knexstorageengine) |
| [UMPLookupService](#class-umplookupservice) |
| [UMPTopicManager](#class-umptopicmanager) |

Links: [API](#api), [Classes](#classes)

---

#### Class: KnexStorageEngine

```ts
export class KnexStorageEngine {
    knex: Knex;
    tablePrefix: string;
    migrations: {
        up: (knex: Knex) => Promise<void>;
        down: (knex: Knex) => Promise<void>;
    }[];
    constructor({ knex, tablePrefix = "ump_lookup_" }) 
    async storeRecord({ txid, outputIndex, presentationKeyHash, recoveryKeyHash }) 
    async deleteRecord({ txid, outputIndex }) 
    async findByPresentationKeyHash({ presentationKeyHash }) 
    async findByRecoveryKeyHash({ recoveryKeyHash }) 
}
```

<details>

<summary>Class KnexStorageEngine Details</summary>

##### Method deleteRecord

Deletes an existing UMP record

```ts
async deleteRecord({ txid, outputIndex }) 
```

Argument Details

+ **obj**
  + all params given in an object

##### Method findByPresentationKeyHash

Look up a UMP record by the presentationKeyHash

```ts
async findByPresentationKeyHash({ presentationKeyHash }) 
```

Argument Details

+ **obj**
  + params given in an object

##### Method findByRecoveryKeyHash

Look up a UMP record by the recoverKeyHash

```ts
async findByRecoveryKeyHash({ recoveryKeyHash }) 
```

Argument Details

+ **obj**
  + params given in an object

##### Method storeRecord

Stores a new UMP record

```ts
async storeRecord({ txid, outputIndex, presentationKeyHash, recoveryKeyHash }) 
```

Argument Details

+ **obj**
  + all params given in an object

</details>

Links: [API](#api), [Classes](#classes)

---
#### Class: UMPLookupService

Implements a Lookup Service for the User Management Protocol

```ts
export class UMPLookupService implements LookupService {
    storageEngine: KnexStorageEngine;
    constructor(storageEngine: KnexStorageEngine) 
    async getDocumentation(): Promise<string> 
    async getMetaData(): Promise<{
        name: string;
        shortDescription: string;
        iconURL?: string;
        version?: string;
        informationURL?: string;
    }> 
    async outputAdded(txid: string, outputIndex: number, outputScript: Script, topic: string) 
    async outputSpent(txid: string, outputIndex: number, topic: string) 
    async lookup({ query }) 
}
```

<details>

<summary>Class UMPLookupService Details</summary>

##### Method lookup

```ts
async lookup({ query }) 
```

Returns

with the data given in an object

Argument Details

+ **obj**
  + all params given in an object

##### Method outputAdded

Notifies the lookup service of a new output added.

```ts
async outputAdded(txid: string, outputIndex: number, outputScript: Script, topic: string) 
```

Returns

indicating the success status

Argument Details

+ **obj**
  + all params are given in an object

##### Method outputSpent

Deletes the output record once the UTXO has been spent

```ts
async outputSpent(txid: string, outputIndex: number, topic: string) 
```

Argument Details

+ **obj**
  + all params given inside an object
+ **obj.txid**
  + the transactionId the transaction the UTXO is apart of
+ **obj.outputIndex**
  + the index of the given UTXO
+ **obj.topic**
  + the topic this UTXO is apart of

</details>

Links: [API](#api), [Classes](#classes)

---
#### Class: UMPTopicManager

Implements a topic manager for User Management Protocol

```ts
export class UMPTopicManager implements TopicManager {
    identifyNeededInputs?: ((beef: number[]) => Promise<Array<{
        txid: string;
        outputIndex: number;
    }>>) | undefined;
    async getDocumentation(): Promise<string> 
    async getMetaData(): Promise<{
        name: string;
        shortDescription: string;
        iconURL?: string;
        version?: string;
        informationURL?: string;
    }> 
    async identifyAdmissibleOutputs(beef: number[], previousCoins: number[]): Promise<AdmittanceInstructions> 
}
```

<details>

<summary>Class UMPTopicManager Details</summary>

##### Method identifyAdmissibleOutputs

Returns the outputs from the UMP transaction that are admissible.

```ts
async identifyAdmissibleOutputs(beef: number[], previousCoins: number[]): Promise<AdmittanceInstructions> 
```

</details>

Links: [API](#api), [Classes](#classes)

---

<!--#endregion ts2md-api-merged-here-->

## License

The license for the code in this repository is the Open BSV License.
