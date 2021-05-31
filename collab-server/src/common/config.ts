if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'local') {
  require('dotenv').config()
}

function parseNodeEnv(NODE_ENV) : 'production' | 'local' {
  if (NODE_ENV === 'production') return 'production'
  return 'local'
}

export const config = {
  ENV: parseNodeEnv(process.env.NODE_ENV),
  PORT: process.env.PORT || 3400,
  CORS_SAME_ORIGIN: process.env.CORS_SAME_ORIGIN || false,
  LOG: {
    LEVEL: process.env.LOG_LEVEL || 'info',
  }
}
