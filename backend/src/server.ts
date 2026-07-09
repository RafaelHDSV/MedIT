import { ensureDatabase } from './config/database.js'
import { PORT } from './globals/Config.js'
import app from './app.js'

try {
  await ensureDatabase()
} catch {
  process.exit(1)
}

app.listen(PORT, () => {
  console.log(`Servidor está rodando em http://localhost:${PORT}`)
})
