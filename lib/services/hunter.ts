import axios from 'axios'

const hunterClient = axios.create({
  baseURL: 'https://api.hunter.io/v2',
  params: {
    api_key: process.env.HUNTER_API_KEY!
  }
})

export async function findEmail(params: {
  domain: string
  first_name?: string
  last_name?: string
  full_name?: string
}) {
  try {
    const response = await hunterClient.get('/email-finder', {
      params: {
        domain: params.domain,
        first_name: params.first_name,
        last_name: params.last_name,
      }
    })
    const data = response.data.data
    if (data && data.email) {
      return {
        email: data.email,
        score: data.score,
        sources: data.sources || []
      }
    }
    return null
  } catch (error) {
    console.error('Hunter error:', error)
    return null
  }
}

export async function verifyEmail(email: string) {
  try {
    const response = await hunterClient.get('/email-verifier', {
      params: { email }
    })
    return response.data.data
  } catch (error) {
    console.error('Verification error:', error)
    return null
  }
}