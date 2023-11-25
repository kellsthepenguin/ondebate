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

  res.json(await changePhase(phase, req, false))
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

  if (phase !== room.phase + 1)
    return { error: 'next phase should be +1 of current phase', ok: false }
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
      // prettier-ignore
      isManual &&
      (room.groups[0] === user.group &&
        (phase === 3 || phase === 4 || phase === 7)) ||
      (room.groups[1] === user.group &&
        (phase === 2 || phase === 5 || phase === 6))
    )
      return { error: 'you cant skip other team', ok: false }

    room.phase = phase

    room.users.forEach((user) => {
      sockets
        .filter((socket) => socket.handshake.query.id === user.id)!
        .forEach((socket) => socket.emit('phase', phase))
    })

    if (phase === 7) {
      if (room.users.length < 3) {
        console.log(room.users)
        room.users.forEach((user) => {
          sockets
            .filter((socket) => socket.handshake.query.id === user.id)!
            .forEach((socket) => socket.emit('end', [0, 0]))
        })
      }

      setTimeout(() => {
        const firstGroupVoters = [...global.votes.entries()]
          .filter(({ 1: v }) => v === `${roomId}.${room.groups[0]}`)
          .map(([k]) => k)

        const secondGroupVoters = [...global.votes.entries()]
          .filter(({ 1: v }) => v === `${roomId}.${room.groups[1]}`)
          .map(([k]) => k)

        room.users.forEach((user) => {
          global.users.delete(user.id)

          sockets
            .filter((socket) => socket.handshake.query.id === user.id)!
            .forEach((socket) =>
              socket.emit('end', [
                firstGroupVoters.length,
                secondGroupVoters.length,
              ])
            )
        })

        global.rooms.delete(roomId)
      }, 60000)

      return { ok: true }
    }
  }

  setTimeout(() => {
    if (room.phase !== phase + 1) changePhase(phase + 1, req, false)
  }, phaseMinutes[phase - 1] * 60000)
  return { ok: true }
}
