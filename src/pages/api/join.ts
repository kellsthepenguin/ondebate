import { io, rooms, users } from '@/global'
import isJWTOk from '@/utils/isJWTOk'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, roomId } = req.body

  if (!(await isJWTOk(token))) return res.json({ error: 'expired token' })

  const userId = JSON.parse(token.split('.')[1]).id

  if (rooms.has(roomId) && !users.has(userId)) {
    const room = rooms.get(roomId)!

    if (room.isOngoing) {
      const debateUser = { id: userId, isSpectator: true }
      room.users.forEach(async (user) => {
        const sockets = await io.fetchSockets()

        sockets
          .find((socket) => socket.handshake.query.id === user.id)!
          .emit('join', debateUser)
      })
      room.users.push(debateUser)
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
      const sockets = await io.fetchSockets()

      sockets
        .find((socket) => socket.handshake.query.id === user.id)!
        .emit('join', debateUser)
    })
    room.users.push(debateUser)
    res.json({ room })
  } else return res.json({ error: 'wrong roomId or already joined' })
}
