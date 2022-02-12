#!/usr/bin/env node

const { EOL } = require('os')
const { createInterface } = require('readline')
const { Configuration, OpenAIApi } = require('openai')
const say = require('say')
const cld = require('cld')
const { promisify } = require('util')
const { parse: parseArgs } = require('m.args')
const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret || process.env.OPENAI_API_KEY })
const ai = new OpenAIApi(configuration)
const rl = createInterface({ input: process.stdin, output: process.stdout })

setImmediate(function next(ai, rl, { argv }) {
  const { temperature = 0.25, max_tokens = 1536, top_p = 1, frequency_penalty = 0, presence_penalty = 0 } = parseArgs(argv)
  rl.question('> ', async (prompt) => {
    try {
      const { data: { choices: [{ text: answer }] } } = await ai.createCompletion('text-davinci-001', { prompt, temperature, max_tokens, top_p, frequency_penalty, presence_penalty })
      rl.write(`${answer.trimStart()}\n`)
      if (argv.includes('--tts')) {
        const { languages: [code] } = await cld.detect(answer, { isHtml: false })
        const lang = { en: 'Daniel', it: 'Luca', sv: 'Alva', de: 'Markus', he: 'Carmit', id: 'Damayanti', ro: 'Ioana', pt: 'Joana', th: 'Kanya', ja: 'Kyoko', sk: 'Laura', hi: 'Lekha', hu: 'Mariska', el: 'Melina', ru: 'Milena', es: 'Monica', nb: 'Nora', da: 'Sara', fi: 'Satu', zh: 'Sin-ji', ar: 'Tarik', fr: 'Thomas', nl: 'Xander', tr: 'Yelda', ko: 'Yuna', pl: 'Zosia', cs: 'Zuzana' }
        await new Promise((resolve, reject) => say.speak(answer, lang[code], 0.5, (error, result) => error ? reject(error) : resolve(result)))
      }
    } catch (err) {
      console.error(err)
    } finally {
      next(ai, rl, { argv })
    }
  })
}, ai, rl, process)
