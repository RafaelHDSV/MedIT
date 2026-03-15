import { select } from '@inquirer/prompts'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import connectDatabase from '../config/database.js'
import { Script } from './types.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function loadScripts(): Promise<Script[]> {
  const scriptsDir = path.join(__dirname, 'scripts')

  const files = fs
    .readdirSync(scriptsDir)
    .filter(
      (file) => file.endsWith('.script.ts') || file.endsWith('.script.js')
    )

  const scripts: Script[] = []

  for (const file of files) {
    const filePath = path.join(scriptsDir, file)
    const module = await import(pathToFileURL(filePath).href)
    scripts.push(module.default)
  }

  return scripts
}

async function run() {
  await connectDatabase()

  const scripts = await loadScripts()
  if (!scripts.length) {
    console.error('Nenhum script encontrado na pasta scripts')
    process.exit(1)
  }

  const arg = process.argv[2]

  if (arg) {
    const script = scripts.find((s) => s.name === arg)

    if (!script) {
      console.error(`Script ${arg} não encontrado`)
      process.exit(1)
    }

    console.log(`\nExecutando: ${script.name}\n`)
    await script.run()
    console.log('\nScript finalizado!\n')

    process.exit(0)
  }

  const choices = scripts.map((script) => ({
    name: `${script.name} — ${script.description}`,
    value: script.name
  }))

  process.stdin.setRawMode?.(true)

  const selected = await select({
    message: 'Selecione o script para executar:',
    choices
  })

  const script = scripts.find((s) => s.name === selected)

  if (!script) {
    console.error('Script não encontrado')
    process.exit(1)
  }

  console.log(`\nExecutando: ${script.name}\n`)

  await script.run()

  console.log('\nScript finalizado!\n')
}

run()
