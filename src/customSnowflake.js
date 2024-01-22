const SnowflakeIdGenerator = require('./snowflake')

/**
 * Create a custom SnowflakeId generator
 * @param {Object} options
 * @param {number} options.MachineIdBits - Number - Number of bits for machine id (default: 10)
 * @param {number} options.SequenceBits - Number - Number of bits for sequence (default: 12)
 * @param {number} options.MachineId - Number - Machine id (default: Skipping this parameter will generate machine id from mac address)
 * @param {timestamp} options.FirstTimestamp - Number or Date - First timestamp (default: new Date('2024-01-01T00:00:00.000Z'))
 * @validations MachineIdBits and SequenceBits must be greater than 0 and sum of both must be equal to 22
 * @validations MachineId must be between 0 and power(2, MachineIdBits) - 1
 * @validations FirstTimestamp must be between 0 and current timestamp
 * @throws {Error} If options is not valid
 * @class
 * @methods newId, getFirstIdAt, getLastIdAt, parseId
 * @example
 * const { CustomSnowflakeId } = require('snowflakeid-producer')
 * const snowflakeId = new CustomSnowflakeId({
 *  MachineIdBits: 10,
 *  SequenceBits: 12,
 *  MachineId: 5,
 *  FirstTimestamp: new Date('2024-01-01T00:00:00.000Z') or 1735689600000
 * })
 *
 * const id = snowflakeId.newId()
 * console.log(id) // 1234567890123456789
 * console.log(typeof id) // string
 * 
 * const firstId = snowflakeId.getFirstIdAt(1635724800000)
 * console.log(firstId) // 1234567890123456789
 * console.log(typeof firstId) // string
 * 
 * const lastId = snowflakeId.getLastIdAt(1635724800000)
 * console.log(lastId) // 1234567890123456789
 * console.log(typeof lastId) // string
 * 
 * const content = snowflakeId.parseId('1234567890123456789')
 * console.log(content) // { timestamp: 2024-01-01T00:00:00.000Z, machineId: 0, sequence: 0 }
 * console.log(typeof content) // object
 * console.log(content.timestamp) // 2024-01-01T00:00:00.000Z
 * console.log(typeof content.timestamp) // object (Date)
 * console.log(content.machineId) // 0
 * console.log(typeof content.machineId) // number
 * console.log(content.sequence) // 0
 * console.log(typeof content.sequence) // number
*/
class CustomSnowflakeId {
    constructor(options) {       
        if (options && (typeof options !== 'object' || Array.isArray(options))) {
            throw new Error('Options must be an object')
        }
        if (options === null) {
            throw new Error('Options must be an object')
        }
        if (!options) options = {}
        const validKeys = [ 'MachineIdBits', 'SequenceBits', 'MachineId', 'FirstTimestamp' ]
        const optionKeys = Object.keys(options)
        for (const key of optionKeys) {
            if (!(validKeys.includes(key))) {
                throw new Error(`Invalid option parameter '${key}'`)
            }
        }
        const { MachineIdBits, SequenceBits, MachineId, FirstTimestamp } = options

        if (optionKeys.includes('MachineIdBits') && (MachineIdBits === null || MachineIdBits === undefined || typeof MachineIdBits !== 'number')) {
            throw new Error('MachineIdBits must be a number')
        }
        if (optionKeys.includes('SequenceBits') && (SequenceBits === null || SequenceBits === undefined || typeof SequenceBits !== 'number')) {
            throw new Error('SequenceBits must be a number')
        }
        if (optionKeys.includes('MachineId') && (MachineId === null || MachineId === undefined || typeof MachineId !== 'number')) {
            throw new Error('MachineId must be a number')
        }
        if (optionKeys.includes('FirstTimestamp') && (FirstTimestamp === null || FirstTimestamp === undefined || (typeof FirstTimestamp !== 'number' && !(FirstTimestamp instanceof Date)))) {
            throw new Error('FirstTimestamp must be a number or date instance')
        }
        if (optionKeys.includes('FirstTimestamp') && new Date(FirstTimestamp).getTime() < 0 || new Date(FirstTimestamp).getTime() > Date.now()) {
            throw new Error('FirstTimestamp must be between 0 and current timestamp')
        }
        
        let machineIdBits = 10
        let sequenceBits = 12
        if ((MachineIdBits !== null && MachineIdBits !== undefined) && (SequenceBits !== null && SequenceBits !== undefined)) {
            machineIdBits = MachineIdBits
            sequenceBits = SequenceBits
        } else if (MachineIdBits !== null && MachineIdBits !== undefined) {
            machineIdBits = MachineIdBits
            sequenceBits = 22 - machineIdBits
        } else if (SequenceBits !== null && SequenceBits !== undefined) {
            sequenceBits = SequenceBits
            machineIdBits = 22 - sequenceBits
        }

        if (machineIdBits + sequenceBits != 22) {
            throw new Error('Sum of MachineIdBits and SequenceBits must be equal to 22 because SnowflakeId is 64-bit and Timestamp is 41-bit')
        }
        if (machineIdBits <= 0 || sequenceBits <= 0) {
            throw new Error('MachineIdBits and SequenceBits must be greater than 0')
        }

        let machineId = null
        if (MachineId !== null && MachineId !== undefined) {
            if (machineId < 0 || machineId > (1 << machineIdBits) - 1)
                throw new Error(`MachineId must be between 0 and ${(2 ** machineIdBits) - 1}`)
            machineId = MachineId
        }

        const firstTimestamp = FirstTimestamp ? new Date(FirstTimestamp) : new Date('2024-01-01T00:00:00.000Z')
        
        this.snowflake = new SnowflakeIdGenerator(machineIdBits, sequenceBits, machineId, firstTimestamp)
    }

    /**
     * Generate a new SnowflakeId which is unique across all instances
     * @returns {string} SnowflakeId
     * @throws {Error} If SnowflakeId generator is not initialized properly
     * @example
     * const { CustomSnowflakeId } = require('snowflakeid-producer')
     * const snowflakeId = new CustomSnowflakeId({
     *  MachineIdBits: 10,
     *  SequenceBits: 12,
     *  MachineId: 5,
     *  FirstTimestamp: new Date('2024-01-01T00:00:00.000Z') // or 1735689600000
     * })
     * const id = snowflakeId.newId()
     * console.log(id) // 1234567890123456789
     * console.log(typeof id) // string
    */
    newId() {
        if (!this.snowflake || !(this.snowflake instanceof SnowflakeIdGenerator)) {
            throw new Error('SnowflakeId generator is not initialized. Please try again later.')
        }
        return this.snowflake.nextId()
    }

    /**
     * Get the first snowflake id at a timestamp
     * @param {timestamp} Number or Date
     * @returns {string} SnowflakeId
     * @throws {Error} If SnowflakeId generator is not initialized properly or timestamp is invalid
     * @example
     * const { CustomSnowflakeId } = require('snowflakeid-producer')
     * const snowflakeId = new CustomSnowflakeId({
     *  MachineIdBits: 10,
     *  SequenceBits: 12,
     *  MachineId: 5,
     *  FirstTimestamp: new Date('2024-01-01T00:00:00.000Z') // or 1735689600000
     * })
     * const id = snowflakeId.getFirstIdAt(1635724800000)
     * console.log(id) // 1234567890123456789
     * console.log(typeof id) // string
    */
    getFirstIdAt(timestamp) {
        if (!this.snowflake || !(this.snowflake instanceof SnowflakeIdGenerator)) {
            throw new Error('SnowflakeId generator is not initialized. Please try again later.')
        }
        return this.snowflake.getFirstIdAtTimestamp(timestamp)
    }

    /**
     * Get the last snowflake id at a timestamp
     * @param {timestamp} Number or Date
     * @returns {string} SnowflakeId
     * @throws {Error} If SnowflakeId generator is not initialized properly or timestamp is invalid
     * @example
     * const { CustomSnowflakeId } = require('snowflakeid-producer')
     * const snowflakeId = new CustomSnowflakeId({
     *  MachineIdBits: 10,
     *  SequenceBits: 12,
     *  MachineId: 5,
     *  FirstTimestamp: new Date('2024-01-01T00:00:00.000Z') // or 1735689600000
     * })
     * const id = snowflakeId.getLastIdAt(1635724800000)
     * console.log(id) // 1234567890123456789
     * console.log(typeof id) // string
    */
    getLastIdAt(timestamp) {
        if (!this.snowflake || !(this.snowflake instanceof SnowflakeIdGenerator)) {
            throw new Error('SnowflakeId generator is not initialized. Please try again later.')
        }
        return this.snowflake.getLastIdAtTimestamp(timestamp)
    }

    /**
     * Parse a snowflake id and return a object with timestamp, machineId, sequence
     * @param {string} snowflakeId - must be a numeric string
     * @returns {object} parsed object containing timestamp, machineId, sequence
     * @throws {Error} If snowflakeId is invalid
     * @example
     * const { CustomSnowflakeId } = require('snowflakeid-producer')
     * const snowflakeId = new CustomSnowflakeId({
     *  MachineIdBits: 10,
     *  SequenceBits: 12,
     *  MachineId: 5,
     *  FirstTimestamp: new Date('2024-01-01T00:00:00.000Z') // or 1735689600000
     * })
     * const content = snowflakeId.parseId('1234567890123456789')
     * console.log(content) // { timestamp: 2024-01-01T00:00:00.000Z, machineId: 0, sequence: 0 }
     * console.log(typeof content) // object
     * console.log(content.timestamp) // 2024-01-01T00:00:00.000Z
     * console.log(typeof content.timestamp) // object (Date)
     * console.log(content.machineId) // 0
     * console.log(typeof content.machineId) // number
     * console.log(content.sequence) // 0
     * console.log(typeof content.sequence) // number
    */
    parseId(snowflakeId) {
        if (!this.snowflake || !(this.snowflake instanceof SnowflakeIdGenerator)) {
            throw new Error('SnowflakeId generator is not initialized. Please try again later.')
        }

        try {
            const parsedContent = this.snowflake.parseId(snowflakeId)
            return {
                timestamp: parsedContent.timestamp,
                machineId: parsedContent.machineId,
                sequence: parsedContent.sequence,
            }
        } catch (error) {
            throw new Error('snowflakeId must be a valid numeric string')
        }
    }
}

module.exports = CustomSnowflakeId