import isJWTOk from '@/utils/isJWTOk'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'

const phaseMinutes = [6, 3, 7, 3, 4, 6, 1]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, phase } = req.body
  if (!(await isJWTOk(token)))
    return res.json({ error: 'expired token', ok: false })
  if (!phase) return res.json({ error: 'wrong body', ok: false })
  const { id } = jwt.decode(token) as JwtPayload
  if (!global.users.has(id))
    return res.json({ error: 'no room joined', ok: false })

  res.json(changePhase(phase, req, false))
}

async function changePhase(
  phase: number,
  req: NextApiRequest,
  isManual: boolean
) {
  const { token } = req.body
  const { id } = jwt.decode(token) as JwtPayload
  const roomId = global.users.get(id)!
  const room = global.rooms.get(roomId)!
  const sockets = await global.io.fetchSockets()
  const user = room.users.find((user) => user.id === id)!

  if (phase <= room.phase) return { error: 'you cant go back', ok: false }
  if (phase > 7) return { error: 'phase cannot be higher than 7', ok: false }

  if (phase === 1) {
    if (room.owner.id !== id)
      return { error: 'only owner can start debate', ok: false }

    room.phase = 1

    room.users.forEach((user) => {
      sockets
        .filter((socket) => socket.handshake.query.id === user.id)!
        .forEach((socket) => socket.emit('start'))
    })
  } else {
    if (
      phase === 4 ||
      (phase === 5 && user.group === room.groups[1]) ||
      ((phase === 2 ||
        phase === 3 ||
        (phase === 6 && user.group === room.groups[0])) &&
        isManual)
    )
      return { error: 'you cant skip other team', ok: false }

    room.phase = phase

    room.users.forEach((user) => {
      sockets
        .filter((socket) => socket.handshake.query.id === user.id)!
        .forEach((socket) => socket.emit('phase', phase))
    })
  }

  setTimeout(() => {
    if (room.phase !== phase + 1) changePhase(phase + 1, req, false)
  }, phaseMinutes[phase - 1] * 60000)
  return { ok: true }
}
