import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    // Set secure cookie
    res.setHeader(
      'Set-Cookie',
      `sb-access-token=${data.session?.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    )

    return res.status(200).json({ user: data.user })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' })
  }
}