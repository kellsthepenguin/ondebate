import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { readFileSync } from 'fs'
import prisma from '@/prisma'
import { sha256 } from 'js-sha256'
import { verify } from 'hcaptcha'

const key = readFileSync('./private.key').toString()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, pw, hCaptchaToken } = req.body
  if (!(id && pw)) return res.json({ error: 'wrong body', token: null })
  if (!(await verify(process.env.HCAPTCHA_SECRET!, hCaptchaToken)).success)
    return res.json({ error: 'wrong hcaptcha token', ok: false })
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
