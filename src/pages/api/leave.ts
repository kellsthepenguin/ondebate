import isJWTOk from '@/utils/isJWTOk'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.body
  if (!(await isJWTOk(token)))
    return res.json({ error: 'expired token', ok: false })

  const { id } = jwt.decode(token) as JwtPayload
  const roomId = global.users.get(id)
  if (!roomId) return res.json({ error: 'no room joined', ok: false })
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
    room.users.filter((user) => user.group === room.groups[0]).length === 0 &&
    room.users.filter((user) => user.group === room.groups[1]).length === 0 &&
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

    return res.json({ ok: true })
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

  res.json({ ok: true })
}
