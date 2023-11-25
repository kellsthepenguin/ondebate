import isJWTOk from '@/utils/isJWTOk'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, group } = req.body

  if (!(token && group)) return res.json({ error: 'wrong body', ok: false })
  if (!(await isJWTOk(token)))
    return res.json({ error: 'expired token', ok: false })

  const { id } = jwt.decode(token) as JwtPayload
  const roomId = global.users.get(id)!
  const room = global.rooms.get(roomId)!
  const user = room.users.find((user) => user.id === id)!

  if (!user.isSpectator)
    return res.json({ error: 'only spectators can vote', ok: false })

  global.votes.set(id, `${roomId}.${group}`)

  res.json({ ok: true })
}
