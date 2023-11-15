import isJWTOk from '@/utils/isJWTOk'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, roomId } = req.body

  if (!(await isJWTOk(token))) return res.json({ error: 'expired token' })

  const userId = (jwt.decode(token) as JwtPayload).id

  if (global.rooms.has(roomId) && !global.users.has(userId)) {
    const room = global.rooms.get(roomId)!

    if (room.phase !== 0) {
      const debateUser = { id: userId, isSpectator: true }
      room.users.forEach(async (user) => {
        const sockets = await global.io.fetchSockets()
        sockets
          .filter((socket) => socket.handshake.query.id === user.id)!
          .forEach((socket) => socket.emit('join', debateUser))
      })
      room.users.push(debateUser)
      global.users.set(userId, roomId)
      res.json({ room })
      return
    }

    const userGroups = room.users.map((user) => user.group)
    const firstGroupUsers = userGroups.filter(
      (group) => group === room.groups[0]
    )
    const secondGroupUsers = userGroups.filter(
      (group) => group === room.groups[1]
    )
    let groupToJoin = ''

    if (firstGroupUsers === secondGroupUsers) groupToJoin = room.groups[0]
    if (firstGroupUsers < secondGroupUsers) groupToJoin = room.groups[0]
    if (firstGroupUsers > secondGroupUsers) groupToJoin = room.groups[1]
    const debateUser = { id: userId, group: groupToJoin, isSpectator: false }

    room.users.forEach(async (user) => {
      const sockets = await global.io.fetchSockets()

      sockets
        .filter((socket) => socket.handshake.query.id === user.id)!
        .forEach((socket) => socket.emit('join', debateUser))
    })
    room.users.push(debateUser)
    global.users.set(userId, roomId)
    res.json({ room })
  } else return res.json({ error: 'wrong roomId or already joined' })
}
