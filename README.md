# signia-services

Topic Manager and Lookup Service for Signia Key Registry

## API

<!--#region ts2md-api-merged-here-->

Links: [API](#api), [Classes](#classes)

### Classes

| |
| --- |
| [KnexStorageEngine](#class-knexstorageengine) |
| [UMPTopicManager](#class-umptopicmanager) |

Links: [API](#api), [Classes](#classes)

---

#### Class: KnexStorageEngine

```ts
export default class KnexStorageEngine {
    knex: Knex;
    tablePrefix: string;
    migrations: {
        up: (knex: Knex) => Promise<void>;
        down: (knex: Knex) => Promise<void>;
    }[];
    constructor({ knex, tablePrefix = "ump_lookup_" }) 
    async storeRecord({ txid, vout, presentationKeyHash, recoveryKeyHash }) 
    async deleteRecord({ txid, vout }) 
    async findByPresentationKeyHash({ presentationKeyHash }) 
    async findByRecoveryKeyHash({ recoveryKeyHash }) 
}
```

<details>

<summary>Class KnexStorageEngine Details</summary>

##### Method deleteRecord

Deletes an existing UMP record

```ts
async deleteRecord({ txid, vout }) 
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
async storeRecord({ txid, vout, presentationKeyHash, recoveryKeyHash }) 
```

Argument Details

+ **obj**
  + all params given in an object

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
