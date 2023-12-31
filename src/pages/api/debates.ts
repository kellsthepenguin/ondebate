import Room from '@/interfaces/Room'
import isJWTOk from '@/utils/isJWTOk'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') return res.json([...global.rooms.values()])
  if (req.method === 'POST') {
    const {
      token,
      topic,
      description,
      groups,
    }: {
      token: string
      topic: string
      description: string
      groups: string[]
    } = req.body

    if (!(token && topic && description && groups))
      return res.json({ error: 'wrong body', ok: false })
    if (groups.length !== 2)
      return res.json({ error: 'wrong groups', ok: false })
    if (topic.length > 20)
      return res.json({ error: 'topic is too long', ok: false })
    if (!(await isJWTOk(token)))
      return res.json({ error: 'expired token', ok: false })

    const keys = [...global.rooms.keys()]
    const lastKey = keys[keys.length - 1]
    const userId = (jwt.decode(token) as JwtPayload).id
    const owner = {
      id: userId,
      group: groups[0] as string,
      isSpectator: false,
    }
    const room: Room = {
      id: 0,
      topic,
      groups,
      description,
      phase: 0,
      owner,
      users: [owner],
    }

    if (!lastKey) {
      room.id = 1
      global.rooms.set(1, room)
      global.users.set(userId, 1)
      res.json({ id: 1, room, ok: true })
    } else {
      room.id = lastKey + 1
      global.rooms.set(lastKey + 1, room)
      global.users.set(userId, lastKey + 1)
      res.json({ id: lastKey + 1, room, ok: true })
    }
  }
}
