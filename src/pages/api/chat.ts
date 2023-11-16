import isJWTOk from '@/utils/isJWTOk'
import { JwtPayload } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, text } = req.body

  if (!(await isJWTOk(token)))
    return res.json({ error: 'expired token', ok: false })

  const { id } = jwt.decode(token) as JwtPayload
  const sockets = await global.io.fetchSockets()
  const roomId = global.users.get(id)
  if (!roomId) return res.json({ error: 'no room joined', ok: false })
  const socketsInRoom = sockets.filter(
    (socket) => users.get(socket.handshake.query.id as string) === roomId
  )

  if (text.startsWith('/kick')) {
    const userId = text.split(' ')[1]
    const room = global.rooms.get(roomId)!

    if (userId === id)
      return res.json({ error: 'you cant kick yourself', ok: false })
    if (room.owner.id !== id)
      return res.json({ error: 'you are not owner', ok: false })
    const user = room.users.find((user) => user.id === userId)
    if (!user) return res.json({ error: 'user not exists', ok: false })
    const userSockets = socketsInRoom.filter(
      (socket) => socket.handshake.query.id === userId
    )

    room.users.splice(
      room.users.findIndex((user) => user.id === userId),
      1
    )
    global.users.delete(userId)
    socketsInRoom.forEach((socket) => socket.emit('leave', userId))
    userSockets.forEach((socket) => socket.emit('kick'))
    res.json({ ok: true })
    return
  }

  const user = global.rooms.get(roomId)!.users.find((user) => user.id === id)

  socketsInRoom.forEach((socket) => socket.emit('chat', { author: user, text }))

  res.json({ ok: true })
}
