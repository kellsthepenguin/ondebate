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
  const room = global.rooms.get(roomId)!
  const socketsInRoom = sockets.filter(
    (socket) => users.get(socket.handshake.query.id as string) === roomId
  )
  const user = room.users.find((user) => user.id === id)!

  if (user.isSpectator)
    return res.json({ error: 'spectators cant chat', ok: false })

  if (
    (room.groups[0] === user.group && room.phase === 2) ||
    room.phase === 3 ||
    room.phase === 6
  ) {
    return res.json({ error: 'you cant chat now', ok: false })
  } else if (
    (room.groups[1] === user.group && room.phase === 1) ||
    room.phase === 4 ||
    room.phase === 5
  ) {
    return res.json({ error: 'you cant chat now', ok: false })
  }

  if (text.startsWith('/kick')) {
    const userId = text.split(' ')[1]

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

  socketsInRoom.forEach((socket) => socket.emit('chat', { author: user, text }))

  res.json({ ok: true })
}
