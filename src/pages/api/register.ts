import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/global'
import { sha256 } from 'js-sha256'

function createSalt() {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let counter = 0
  while (counter < 50) {
    result += characters.charAt(Math.floor(Math.random() * 50))
    counter += 1
  }
  return result
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, pw } = JSON.parse(req.body)
  if (!(id && pw)) return res.json({ error: 'wrong body', ok: false })
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (user) return res.json({ error: 'id duplicated', ok: false })
  const salt = createSalt()
  await prisma.user
    .create({
      data: {
        id,
        salt,
        pw: sha256(pw + salt),
      },
    })
    .then(() => res.json({ ok: true }))
}
