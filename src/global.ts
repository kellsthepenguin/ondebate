import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'
import Room from './interfaces/Room'
const prisma = new PrismaClient()
let io: Server
const rooms = new Map<number, Room>()

function initIo(ioToSet: Server) {
  io = ioToSet
}

export { prisma, io, initIo, rooms }
