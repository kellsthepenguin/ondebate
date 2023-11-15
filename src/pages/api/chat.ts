import isJWTOk from '@/utils/isJWTOk'
import { JwtPayload } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { io, rooms, users } from '@/global'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, text } = req.body

  if (!(await isJWTOk(token)))
    return res.json({ error: 'expired token', ok: false })

  const { id } = jwt.decode(token) as JwtPayload
  const sockets = await io.fetchSockets()
  const roomId = users.get(id)
  if (!roomId) return res.json({ error: 'no room joined', ok: false })
  const user = rooms.get(roomId)!.users.find((user) => user.id === id)
  const socketsInRoom = sockets.filter(
    (socket) => users.get(socket.handshake.query.id as string) === roomId
  )

  socketsInRoom.forEach((socket) => socket.emit('chat', { author: user, text }))

  res.json({ ok: true })
}
