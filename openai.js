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

setImmediate(function qa(ai, rl) {
  rl.question('> ', async (prompt) => {
    const { data: { choices: [{ text: answer }] } } = await ai.createCompletion('text-davinci-001', { prompt, temperature: 0.25, max_tokens: 480, top_p: 1, frequency_penalty: 0, presence_penalty: 0 })
    rl.write(`${answer.trimStart()}${EOL}`)
    if (process.argv.includes('--tts')) {
      const { languages: [{ code }] } = await cld.detect(answer.trimStart())
      say.speak(answer.trimStart(), lang[code], 0.45)
    }
    qa(ai, rl)
  })
}, ai, rl)
