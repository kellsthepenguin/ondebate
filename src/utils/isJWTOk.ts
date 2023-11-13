import { readFileSync } from 'fs'
import jwt, { VerifyErrors } from 'jsonwebtoken'

const key = readFileSync('./private.key').toString()

export default function isJWTOk(token: string) {
  return new Promise((resolve) => {
    jwt.verify(token, key, (error: VerifyErrors | null) => {
      if (error) return resolve(false)
      resolve(true)
    })
  })
}
