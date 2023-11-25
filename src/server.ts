import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as IOServer, Server } from 'socket.io'
import isJWTOk from './utils/isJWTOk'
import jwt, { JwtPayload } from 'jsonwebtoken'
import Room from './interfaces/Room'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

declare global {
  var io: Server
  var rooms: Map<number, Room>
  var users: Map<string, number>
  var votes: Map<string, string>
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)
  global.io = new IOServer(server)
  global.rooms = new Map<number, Room>()
  global.users = new Map<string, number>()

  io.on('connection', async (socket) => {
    if (!(await isJWTOk(socket.handshake.auth.token))) {
      return socket.disconnect()
    }
    const id = (jwt.decode(socket.handshake.auth.token) as JwtPayload).id
    socket.handshake.query.id = id

    socket.on('disconnect', () => {
      const roomId = global.users.get(id)
      if (!roomId) return
      const room = global.rooms.get(roomId)!

      room.users.splice(
        room.users.findIndex((user) => user.id === id),
        1
      )
      global.users.delete(id)

      room.users.forEach(async (user) => {
        const sockets = await global.io.fetchSockets()

        sockets
          .filter((socket) => socket.handshake.query.id === user.id)!
          .forEach((socket) => socket.emit('leave', id))
      })

      if (
        room.users.filter((user) => user.group === room.groups[0]).length ===
          0 &&
        room.users.filter((user) => user.group === room.groups[1]).length ===
          0 &&
        room.phase !== 0
      ) {
        // 한쪽 팀의 인원이 다 나가면 해산
        rooms.delete(roomId)
        room.users.forEach(async (user) => {
          const sockets = await global.io.fetchSockets()
          users.delete(user.id)

          sockets
            .filter((socket) => socket.handshake.query.id === user.id)!
            .forEach((socket) => socket.emit('disband'))
        })
        return
      }

      if (id == room.owner.id) {
        rooms.delete(roomId)
        room.users.forEach(async (user) => {
          const sockets = await global.io.fetchSockets()
          users.delete(user.id)

          sockets
            .filter((socket) => socket.handshake.query.id === user.id)!
            .forEach((socket) => socket.emit('disband'))
        })
      }
    })
  })

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
