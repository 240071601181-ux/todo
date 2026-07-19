import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_SECRET ?? 'fallback-access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret'

export interface AccessTokenPayload {
  userId: string
}

export interface RefreshTokenPayload {
  userId: string
  tokenId: string
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload
}
