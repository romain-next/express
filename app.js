const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ message: 'Mon API DevOps' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`)
  })
}

module.exports = app