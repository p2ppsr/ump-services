# signia-services

Topic Manager and Lookup Service for Signia Key Registry

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

*   [SigniaLookupService](#signialookupservice)
    *   [Parameters](#parameters)
    *   [outputAdded](#outputadded)
        *   [Parameters](#parameters-1)
    *   [outputSpent](#outputspent)
        *   [Parameters](#parameters-2)
    *   [lookup](#lookup)
        *   [Parameters](#parameters-3)
*   [SigniaTopicManager](#signiatopicmanager)
    *   [identifyAdmissibleOutputs](#identifyadmissibleoutputs)
        *   [Parameters](#parameters-4)

### SigniaLookupService

#### Parameters
#### outputAdded

Notifies the lookup service of a new output added.

##### Parameters

*   `txid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**;
*   `vout` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**;
*   `outputScript` **any**;
*   `topic` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**;

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<void>**;

#### outputSpent

Deletes the output record once the UTXO has been spent

##### Parameters

*   `txid` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**;
*   `vout` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)**;
*   `topic` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**;

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<void>**;

#### lookup

Queries the lookup service for particular UTXOs

##### Parameters

*   `query` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** lookup query given as an object

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)>>** the data returned from the query

### SigniaTopicManager

#### identifyAdmissibleOutputs

Returns the outputs from the Signia transaction that are admissible.

##### Parameters

*   `parsedTransaction` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**;
*   `obj` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** all params given in an object

    *   `obj.parsedTransaction` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** transaction containing outputs to admit into the current topic

Returns **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)**;

## License & Confidentiality

This is proprietary software developed and owned by Peer-to-peer Privacy Systems Research, LLC.
Except as provided for in your CWI Partner Agreement with us, you may not use this software and
must keep it confidential.
