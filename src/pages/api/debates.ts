import { io, rooms, users } from '@/global'
import Room from '@/interfaces/Room'
import isJWTOk from '@/utils/isJWTOk'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') return res.json([...rooms.values()])
  if (req.method === 'POST') {
    const {
      token,
      topic,
      description,
      time,
      groups,
    }: {
      token: string
      topic: string
      description: string
      time: number
      groups: string[]
    } = req.body

    if (!(token && topic && description && time && groups))
      return res.json({ error: 'wrong body', ok: false })
    if (groups.length !== 2)
      return res.json({ error: 'wrong groups', ok: false })
    if (topic.length > 20)
      return res.json({ error: 'topic is too long', ok: false })
    if (!(await isJWTOk(token)))
      return res.json({ error: 'expired token', ok: false })

    const keys = [...rooms.keys()]
    const lastKey = keys[keys.length - 1]
    const userId = (jwt.decode(token) as JwtPayload).id
    const room: Room = {
      topic,
      time,
      groups,
      description,
      isOngoing: false,
      users: [
        {
          id: userId,
          group: groups[0] as string,
          isSpectator: false,
        },
      ],
    }

    if (!lastKey) {
      rooms.set(1, room)
      users.set(userId, 1)
      res.json({ id: 1, ok: true })
    } else {
      rooms.set(lastKey + 1, room)
      users.set(userId, lastKey + 1)
      res.json({ id: lastKey + 1, ok: true })
    }
  }
}
