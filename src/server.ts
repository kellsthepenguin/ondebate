import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as IOServer } from 'socket.io'
import { initIo } from './global'
import isJWTOk from './utils/isJWTOk'
import jwt, { JwtPayload } from 'jsonwebtoken'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)
  const io = new IOServer(server)
  initIo(io)

  io.on('connection', async (socket) => {
    if (!(await isJWTOk(socket.handshake.auth.token)))
      return socket.disconnect()
    socket.handshake.query.id = (
      jwt.decode(socket.handshake.auth.token) as JwtPayload
    ).id
  })

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
