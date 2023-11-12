import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { readFileSync } from 'fs'

const key = readFileSync('../../../private.key').toString()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, pw } = req.body
  if (!(id && pw)) return res.json({ error: 'wrong body', token: null })
  res.json({ token: jwt.sign({ id }, key) })
}
