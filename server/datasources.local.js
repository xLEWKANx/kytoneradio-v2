const MONGODB_URL = process.env.MONGODB_URL || null
const STORAGE_PATH = process.env.STORAGE_PATH || 'storage'

module.exports = {
  db: {
    name: 'db',
    connector: 'loopback-connector-mongodb',
    url: MONGODB_URL,
    allowExtendedOperators: true
  },
  'storage': {
    'name': 'trackStorage',
    'provider': 'filesystem',
    'connector': 'loopback-component-storage',
    'root': STORAGE_PATH,
    "maxFileSize": "524288000"
  }
}
