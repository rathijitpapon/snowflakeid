# Snowflake ID

A tiny and simple module to generate unique time-based 64-bit IDs. It is inspired by Twitter's Snowflake Id.

Snowflake ID is a 64-bit integer, which is composed of: 41 bits of time stamp in milliseconds (gives us 69 years with a custom epoch), 10 bits of configurable machine id, and 12 bits of sequence number, and 1 unused sign bit. It is designed to generate IDs at high scale.

## Installation

```bash
npm install snowflakeid-producer
```

## Usage

### Default Configuration

```js
const { SnowflakeId } = require('snowflakeid-producer')

// New unique id
// Returns a string e.g. "7775828467560448"
const newId = SnowflakeId.newId()

// First ID of a given timestamp. Parameters: timestamp (in milliseconds or Date object)
// Returns a string e.g. "349477010654887936"
const firstId1 = SnowflakeId.getFirstIdAt(1787389012309) 
const firstId2 = SnowflakeId.getFirstIdAt(new Date('2025-05-03T00:00:00.000Z'))

// Last ID of a given timestamp. Parameters: timestamp (in milliseconds or Date object)
// Returns a string e.g. "349477010659082239"
const lastId1 = SnowflakeId.getLastIdAt(1787389012309) 
const lastId2 = SnowflakeId.getLastIdAt(new Date('2025-05-03T00:00:00.000Z'))

// Parse an id to get its timestamp, machine id and sequence number. Parameters: id (numeric string)
// Returns an object e.g. { timestamp: 2024-01-22T10:58:08.632Z, machineId: 587, sequence: 0 }
const content = SnowflakeId.parseId('7775772507156480')
```


### Custom Configuration

```js
const { CustomSnowflakeId } = require('snowflakeid-producer')

// Initialize with machine id bits, sequence bits, machine id and first timestamp
const snowflakeId = new CustomSnowflakeId({
    MachineIdBits: 10,
    SequenceBits: 12,
    MachineId: 1,
    FirstTimestamp: new Date('2021-05-03T00:00:00.000Z'),
})

// New unique id
// Returns a string e.g. "7729254429405184"
const newId = snowflakeId.newId()

// First ID of a given timestamp. Parameters: timestamp (in milliseconds or Date object).
// Returns a string e.g. "240706963883687936"
const firstId = snowflakeId.getFirstIdAt(1677389012309)

// Last ID of a given timestamp. Parameters: timestamp (in milliseconds or Date object)
// Returns a string e.g. "240706963887882239"
const lastId = snowflakeId.getLastIdAt(1677389012309)

// Parse an id to get its timestamp, machine id and sequence number. Parameters: id (numeric string)
// Returns an object e.g. { timestamp: 2023-02-26T05:23:32.309Z, machineId: 1023, sequence: 4095 }
const content = snowflakeId.parseId('240706963887882239') 
```

## Custome Configuration Options
1. ```MachineIdBits```: Number of bits to use for machine id. Can be ```0``` to ```21```. Default value is ```10```.
2. ```SequenceBits```: Number of bits to use for sequence. Can be ```0``` to ```21```. Default value is ```12```.
3. ```MachineId```: Machine id to use. Can be ```0``` to ```pow(2, MachineIdBits) - 1```. Note that if ```MachineId``` is not provided, it will be generated from mac address.
4. ```FirstTimestamp```: First timestamp to use as a ```EPOCH```. This value will be subtracted from current timestamp to get the 41 bits of timestamp. Can be a milliseconds timestamp or a Date object. Default value is ```'2024-01-01T00:00:00.000Z'```.
5. Note that the sum of ```MachineIdBits``` and ```SequenceBits``` must be equal to ```22```.
