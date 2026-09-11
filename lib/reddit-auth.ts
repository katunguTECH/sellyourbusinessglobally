import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

type InnerToken = {
  refreshToken?: string
  accessToken: string
  expiresAt?: number
  scope?: string
  tokenType?: string
}

const TOKEN_PATH = path.join(os.homedir(), '.devvit', 'token')

let cache: { accessToken: string; expiresAt: number } | null = null

async function readTokenFile(): Promise<InnerToken> {
  const raw = await fs.readFile(TOKEN_PATH, 'utf8')
  const outer = JSON.parse(raw) as { token: string; copyPaste?: boolean }

  // The `token` field is base64-encoded JSON
  const decoded = Buffer.from(outer.token, 'base64').toString('utf8')
  return JSON.parse(decoded) as InnerToken
}

export async function getRedditAccessToken(): Promise<string> {
  if (cache && cache.expiresAt > Date.now() + 60_000) return cache.accessToken

  const inner = await readTokenFile()

  if (!inner.expiresAt || inner.expiresAt <= Date.now() + 60_000) {
    throw new Error(
      'Devvit access token expired. Re-run `npx devvit@latest login` to refresh it.',
    )
  }

  cache = { accessToken: inner.accessToken, expiresAt: inner.expiresAt }
  return inner.accessToken
}