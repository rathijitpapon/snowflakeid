# Snowflake ID

[![NPM Version](https://img.shields.io/npm/v/snowflakeid-producer)](https://www.npmjs.com/package/snowflakeid-producer) [![NPM](https://img.shields.io/npm/dt/snowflakeid-producer)](https://www.npmjs.com/package/snowflakeid-producer) ![NPM License](https://img.shields.io/npm/l/snowflakeid-producer)

## Overview

The Snowflake ID module provides a lightweight and efficient solution for generating unique, time-based 64-bit identifiers. Inspired by Twitter's Snowflake ID generation system, this module is designed to produce IDs at high scale while ensuring uniqueness across distributed systems.

## Structure of Snowflake ID

A Snowflake ID is a 64-bit integer composed of the following components:
- **41 bits**: Timestamp in milliseconds, allowing for a range of approximately 69 years with a custom epoch.
- **10 bits**: Configurable machine ID, enabling identification of different machines in a distributed environment.
- **12 bits**: Sequence number, which allows for the generation of multiple IDs within the same millisecond.
- **1 bit**: Unused sign bit.

This structure ensures that each generated ID is unique and can be efficiently created in high-throughput scenarios.

## Installation

```bash
npm install snowflakeid-producer
```

## Usage

#### Default Configuration

```js
const { SnowflakeId } = require('snowflakeid-producer')

// Initialize with default configuration
const snowflakeId = SnowflakeId;
```

#### Custom Configuration

```js
const { CustomSnowflakeId } = require('snowflakeid-producer')

// Initialize with machine id bits, sequence bits, machine id and first timestamp
const snowflakeId = new CustomSnowflakeId({
    MachineIdBits: 10,
    SequenceBits: 12,
    MachineId: 1,
    FirstTimestamp: new Date('2021-05-03T00:00:00.000Z'),
})
```

#### Methods

```js
// New unique id
// Returns a string e.g. "7775828467560448"
const newId = snowflakeId.newId()

// First id of a given timestamp
// Parameters: timestamp (in milliseconds or Date object)
// Returns a string e.g. "349477010654887936"
const firstId1 = snowflakeId.getFirstIdAt(1787389012309) 
const firstId2 = snowflakeId.getFirstIdAt(new Date('2025-05-03T00:00:00.000Z'))

// Last id of a given timestamp
// Parameters: timestamp (in milliseconds or Date object)
// Returns a string e.g. "349477010659082239"
const lastId1 = snowflakeId.getLastIdAt(1787389012309) 
const lastId2 = snowflakeId.getLastIdAt(new Date('2025-05-03T00:00:00.000Z'))

// Parse an id
// Parameters: id (numeric string)
// Returns an object e.g. { timestamp: 2024-01-22T10:58:08.632Z, machineId: 587, sequence: 0 }
const content = snowflakeId.parseId('7775772507156480')
```

## Custom Configuration Options
1. ```MachineIdBits```: Number of bits to use for machine id. Can be ```0``` to ```21```. Default value is ```10```.
2. ```SequenceBits```: Number of bits to use for sequence. Can be ```0``` to ```21```. Default value is ```12```.
3. ```MachineId```: Machine id to use. Can be ```0``` to ```pow(2, MachineIdBits) - 1```. Note that if ```MachineId``` is not provided, it will be generated from mac address.
4. ```FirstTimestamp```: First timestamp to use as a ```EPOCH```. This value will be subtracted from current timestamp to get the 41 bits of timestamp. Can be a milliseconds timestamp or a Date object. Default value is ```'2024-01-01T00:00:00.000Z'```.
5. Note that the sum of ```MachineIdBits``` and ```SequenceBits``` must be equal to ```22```.