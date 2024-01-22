// Uniqeu ID Generator Using Snowflake Algorithm
// Parameters: 41 bits timestamp, 10 bits machine id, 12 bits sequence

const os = require('os')

class SnowflakeIdGenerator {
  constructor(machineIdBits, sequenceBits, machineId, firstTimestamp) {
    // Initialize bits
    this.timestampBits = BigInt(41)
    this.machineIdBits = BigInt(machineIdBits)
    this.sequenceBits = BigInt(sequenceBits)

    // Initialize maximum values
    this.maxTimestamp = BigInt(2) ** this.timestampBits - BigInt(1)
    this.maxMachineId = BigInt(2) ** this.machineIdBits - BigInt(1)
    this.maxSequence = BigInt(2) ** this.sequenceBits - BigInt(1)

    // Initialize id generation configurations
    this.machineId = (machineId == null || machineId == undefined) ? this.generateMachineId() : BigInt(machineId)
    this.sequence = BigInt(0)
    this.lastTimestamp = firstTimestamp ? new Date(firstTimestamp) : new Date('2024-01-01T00:00:00.000Z')
    this.firstTimestamp = firstTimestamp ? new Date(firstTimestamp) : new Date('2024-01-01T00:00:00.000Z')
    this.EPOCH = BigInt(new Date(this.firstTimestamp).getTime())
  }

  generateMachineId() {
    // Parse Network Interfaces
    const interfaces = os.networkInterfaces()
    let macAddress = ''

    // Get the first non-internal IPv4 address
    for (const values of Object.values(interfaces)) {
      // Skip if values is empty or undefined
      if ((values && values.length === 0) || values === undefined) {
        continue
      }

      // Get the first non-internal IPv4 address
      for (const item of values) {
        if (item && item.family === 'IPv4' && !item.internal) {
          macAddress = item.mac
          break
        }
      }
    }

    // Generate machine id from mac address
    let machineId = BigInt(0)
    if (macAddress) {
      machineId = BigInt(parseInt(macAddress.split(':').join(''), 16))
    }
    machineId = machineId & this.maxMachineId

    return machineId
  }

  waitNextMillis() {
    // Wait until next millisecond and return timestamp
    let timestamp = BigInt(Date.now())
    while (timestamp <= this.lastTimestamp) {
      timestamp = BigInt(Date.now())
    }
    return timestamp
  }

  nextId() {
    // Generate next unique id
    let timestamp = BigInt(Date.now())
    while (timestamp < this.lastTimestamp) {
      timestamp = BigInt(Date.now())
    }

    // Update sequence if timestamp is same as last timestamp
    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + BigInt(1)) & this.maxSequence
      if (this.sequence === BigInt(0)) {
        timestamp = this.waitNextMillis()
      }
    } else {
      this.sequence = BigInt(0)
    }
    this.lastTimestamp = timestamp

    // Generate unique id
    const uniqueId =
      ((timestamp - this.EPOCH) << (this.machineIdBits + this.sequenceBits)) |
      (this.machineId << this.sequenceBits) |
      this.sequence
    return uniqueId.toString()
  }

  getFirstIdAtTimestamp(timestamp) {
    // Check if timestamp type is number or Date
    if (typeof timestamp === 'number') {
      timestamp = BigInt(timestamp)
    } else if (timestamp instanceof Date) {
      timestamp = BigInt(timestamp.getTime())
    } else {
      throw new Error('Timestamp must be a number or date instance')
    }

    // Check if timestamp is greater than or equal to EPOCH
    if (timestamp < this.EPOCH) {
      throw new Error(`Timestamp must be greater than or equal to ${this.firstTimestamp.toISOString()}`)
    }
    
    // Generate id from timestamp
    const id =
      ((BigInt(timestamp) - this.EPOCH) << (this.machineIdBits + this.sequenceBits)) |
      (BigInt(0) << this.sequenceBits) |
      BigInt(0)
    return id.toString()
  }

  getLastIdAtTimestamp(timestamp) {
    // Check if timestamp type is number or Date
    if (typeof timestamp === 'number') {
      timestamp = BigInt(timestamp)
    } else if (timestamp instanceof Date) {
      timestamp = BigInt(timestamp.getTime())
    } else {
      throw new Error('Timestamp must be a number or date instance')
    }

    // Check if timestamp is greater than or equal to EPOCH
    if (timestamp < this.EPOCH) {
      throw new Error(`Timestamp must be greater than or equal to ${this.firstTimestamp.toISOString()}`)
    }
    
    // Generate id from timestamp
    const id =
      ((BigInt(timestamp) - this.EPOCH) << (this.machineIdBits + this.sequenceBits)) |
      (this.maxMachineId << this.sequenceBits) |
      this.maxSequence
    return id.toString()
  }

  parseId(id) {
    // Parse id to get timestamp, machine id and sequence
    const idBits = BigInt(id)
    const sequence = idBits & this.maxSequence
    const machineId = (idBits >> this.sequenceBits) & this.maxMachineId
    const timestamp = (idBits >> (this.machineIdBits + this.sequenceBits)) + this.EPOCH
    
    // Return parsed object
    return { 
      timestamp: new Date(Number(timestamp)),
      machineId: Number(machineId),
      sequence: Number(sequence)
    }
  }
}

module.exports = SnowflakeIdGenerator