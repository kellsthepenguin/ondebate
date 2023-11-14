import isJWTOk from '@/utils/isJWTOk'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json({ isJWTOk: await isJWTOk(req.body.token) })
}
