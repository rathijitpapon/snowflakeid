const SnowflakeIdGenerator = require('./src/snowflake')
const CustomSnowflakeId = require('./src/customSnowflake')

const defaultSnowflake = new SnowflakeIdGenerator(10, 12, null, new Date('2024-01-01T00:00:00.000Z'))

/**
 * Generate unique snowflake ids which are unique across all instances
 * SnowflakeId
 * @class
 * @methods newId, getFirstIdAt, getLastIdAt, parseId
 * @example
 * const { SnowflakeId } = require('snowflakeid')
 * const id = SnowflakeId.newId()
 * console.log(id) // 1234567890123456789
 * console.log(typeof id) // string
 * 
 * const firstId = SnowflakeId.getFirstIdAt(1635724800000)
 * console.log(firstId) // 1234567890123456789
 * console.log(typeof firstId) // string
 * 
 * const lastId = SnowflakeId.getLastIdAt(1635724800000)
 * console.log(lastId) // 1234567890123456789
 * console.log(typeof lastId) // string
 * 
 * const content = SnowflakeId.parseId('1234567890123456789')
 * console.log(content) // { timestamp: 2024-01-01T00:00:00.000Z, machineId: 0, sequence: 0 }
 * console.log(typeof content) // object
 * console.log(content.timestamp) // 2024-01-01T00:00:00.000Z
 * console.log(typeof content.timestamp) // object (Date)
 * console.log(content.machineId) // 0
 * console.log(typeof content.machineId) // number
 * console.log(content.sequence) // 0
 * console.log(typeof content.sequence) // number
*/
class SnowflakeId {
    /**
     * Generate a new SnowflakeId which is unique across all instances
     * @returns {string} SnowflakeId
     * @throws {Error} If SnowflakeId generator is not initialized properly
     * @static
     * @example
     * const { SnowflakeId } = require('snowflakeid')
     * const id = SnowflakeId.newId()
     * console.log(id) // 1234567890123456789
     * console.log(typeof id) // string
    */
    static newId() {
        if (!defaultSnowflake || !(defaultSnowflake instanceof SnowflakeIdGenerator)) {
            throw new Error('SnowflakeId generator is not initialized. Please try again later.')
        }
        return defaultSnowflake.nextId()
    }

    /**
     * Get the first snowflake id at a timestamp
     * @param {timestamp} Number or Date
     * @returns {string} SnowflakeId
     * @throws {Error} If SnowflakeId generator is not initialized properly or timestamp is invalid
     * @static
     * @example
     * const { SnowflakeId } = require('snowflakeid')
     * const id = SnowflakeId.getFirstIdAt(1635724800000)
     * console.log(id) // 1234567890123456789
     * console.log(typeof id) // string
    */
    static getFirstIdAt(timestamp) {
        if (!defaultSnowflake || !(defaultSnowflake instanceof SnowflakeIdGenerator)) {
            throw new Error('SnowflakeId generator is not initialized. Please try again later.')
        }
        return defaultSnowflake.getFirstIdAtTimestamp(timestamp)
    }

    /**
     * Get the last snowflake id at a timestamp
     * @param {timestamp} Number or Date
     * @returns {string} SnowflakeId
     * @throws {Error} If SnowflakeId generator is not initialized properly or timestamp is invalid
     * @static
     * @example
     * const { SnowflakeId } = require('snowflakeid')
     * const id = SnowflakeId.getLastIdAt(1635724800000)
     * console.log(id) // 1234567890123456789
     * console.log(typeof id) // string
    */
    static getLastIdAt(timestamp) {
        if (!defaultSnowflake || !(defaultSnowflake instanceof SnowflakeIdGenerator)) {
            throw new Error('SnowflakeId generator is not initialized. Please try again later.')
        }
        return defaultSnowflake.getLastIdAtTimestamp(timestamp)
    }

    /**
     * Parse a snowflake id and return a object with timestamp, machineId, sequence
     * @param {string} snowflakeId - must be a numeric string
     * @returns {object} parsed object containing timestamp, machineId, sequence
     * @throws {Error} If snowflakeId is invalid
     * @static
     * @example
     * const { SnowflakeId } = require('snowflakeid')
     * const content = SnowflakeId.parseId('1234567890123456789')
     * console.log(content) // { timestamp: 2024-01-01T00:00:00.000Z, machineId: 0, sequence: 0 }
     * console.log(typeof content) // object
     * console.log(content.timestamp) // 2024-01-01T00:00:00.000Z
     * console.log(typeof content.timestamp) // object (Date)
     * console.log(content.machineId) // 0
     * console.log(typeof content.machineId) // number
     * console.log(content.sequence) // 0
     * console.log(typeof content.sequence) // number
    */
    static parseId(snowflakeId) {
        if (!defaultSnowflake || !(defaultSnowflake instanceof SnowflakeIdGenerator)) {
            throw new Error('SnowflakeId generator is not initialized. Please try again later.')
        }

        try {
            const parsedContent = defaultSnowflake.parseId(snowflakeId)
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

module.exports = {
    SnowflakeId,
    CustomSnowflakeId,
}

