import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { readFileSync } from 'fs'
import { prisma } from '@/global'
import { sha256 } from 'js-sha256'

const key = readFileSync('./private.key').toString()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, pw } = JSON.parse(req.body)
  console.log(id, pw)
  if (!(id && pw)) return res.json({ error: 'wrong body', token: null })
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) return res.json({ error: 'wrong id', token: null })
  if (sha256(pw + user.salt) === user.pw)
    return res.json({ token: jwt.sign({ id }, key) })
  else res.json({ error: 'wrong pw', token: null })
}
