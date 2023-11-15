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
  const user = global.rooms.get(roomId)!.users.find((user) => user.id === id)
  const socketsInRoom = sockets.filter(
    (socket) => users.get(socket.handshake.query.id as string) === roomId
  )

  socketsInRoom.forEach((socket) => socket.emit('chat', { author: user, text }))

  res.json({ ok: true })
}
