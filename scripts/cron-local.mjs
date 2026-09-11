import 'dotenv/config'
import cron from 'node-cron'

const URL = process.env.CRON_URL ?? 'http://localhost:3000/api/cron/scan'
const SECRET = process.env.CRON_SECRET

if (!SECRET) {
  console.error('CRON_SECRET not set in .env')
  process.exit(1)
}

console.log(`[cron-local] scheduled — hitting ${URL} every 6 hours`)

cron.schedule('0 */6 * * *', async () => {
  try {
    const res = await fetch(URL, {
      headers: { Authorization: `Bearer ${SECRET}` },
    })
    const json = await res.json()
    console.log(`[cron-local] ${new Date().toISOString()}`, json)
  } catch (e) {
    console.error('[cron-local] failed:', e)
  }
})