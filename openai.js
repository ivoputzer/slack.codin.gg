#!/usr/bin/env node

const { EOL } = require('os')
const { Configuration, OpenAIApi } = require('openai')
const { createInterface } = require('readline')
const say = require('say')
const cld = require('cld')
const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret || process.env.OPENAI_API_KEY })
const ai = new OpenAIApi(configuration)
const rl = createInterface({ input: process.stdin, output: process.stdout })
const lang = require('./lang.json')

const context = []

setImmediate(function qa(ai, rl) {
  rl.question('> ', async (prompt) => {
    prompt = context.join('\n') + `\n${prompt}`
    const { data: { choices: [{ text: answer }] } } = await ai.createCompletion('text-davinci-001', { prompt, temperature: 0.25, max_tokens: 480, top_p: 1, frequency_penalty: 0, presence_penalty: 0 })
    const { languages: [{ code }] } = await cld.detect(answer.trimStart())
    rl.write(`${answer.trimStart()}${EOL}`)
    if (process.argv.includes('--tts')) {
      say.speak(answer.trimStart(), lang[code], 0.45)
    }
    context.push(answer.trimStart())
    while (context.join('').length > 1000) { context.splice(0, 1) }
    qa(ai, rl)
  })
}, ai, rl)
