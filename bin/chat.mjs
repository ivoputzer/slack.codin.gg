#!/usr/bin/env node

import { createInterface } from 'node:readline'
import { promisify } from 'node:util'
import { EOL } from 'node:os'
import { Configuration, OpenAIApi } from 'openai'
import { parse } from 'm.args'

import say from 'say'

/* eslint-disable camelcase */

const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret })

// if system message is provided, then throttle should be set from 2 onwards since the system message is within the messages count
// if throttle is set to 1 no history will be sent to to gpt
// if throttle is set to 2 only the last message will be sent to gpt
const { system = '', throttle = Number.POSITIVE_INFINITY, talk = false } = parse(process.argv)
const stats = {
  prompt: 0,
  completion: 0,
  total: 0,
  push ({ prompt_tokens, completion_tokens, total_tokens }) {
    this.prompt += prompt_tokens
    this.completion += completion_tokens
    this.total += total_tokens
  }
}

const readLine = createInterface({ input: process.stdin, output: process.stdout })
const openAI = new OpenAIApi(configuration)
const speak = promisify(say.speak).bind(say)
const prompt = promisify(readLine.question).bind(readLine)
const createChatCompletion = (messages, model = 'gpt-3.5-turbo') => openAI.createChatCompletion({ model, messages })
const messages = [{ role: 'system', content: system }]

console.time('duration')
process.on('exit', () => {
  process.stdout.clearLine()
  process.stdout.clearLine()
  console.log('\n---')
  console.log('tokens: %d (prompt: %d, completion: %d)', stats.total, stats.prompt, stats.completion)
  console.log('cost: $%s', (stats.total * 0.000002).toFixed(4))
  console.log('date: %s', new Date().toISOString())
  console.timeEnd('duration')
})

while (true) {
  try {
    messages.push({ role: 'user', content: await prompt('> ') })
    const { data: { usage, choices: [{ message: { content } }] } } = await createChatCompletion([
      { role: 'system', content: system },
      ...messages
    ])
    stats.push(usage)
    readLine.write(content)
    if (talk) await speak(content, 'Daniel', 0.175)
    readLine.write(EOL + EOL)
  } catch (err) {
    console.error('Error:', err)
    readLine.close()
  } finally {
    console.log('messages length:', messages.length)
    if (messages.length > throttle) {
      messages.splice(1, messages.length - throttle)
      console.log('messages length:', messages.length)
    }
  }
}

// setImmediate(
//   async function asyncRecursiveQuestionLoop (ai, rl, [system, ...messages]) {
//     rl.question('> ', async content => {
//       try {
//         const {
//           data: {
//             usage: { prompt_tokens, completion_tokens, total_tokens },
//             choices: [{ message }]
//           }
//         } = await ai.createChatCompletion({
//           model: 'gpt-3.5-turbo',
//           messages: [{
//             role: 'system',
//             content
//           },
//           ...messages,
//           {
//             role: 'user',
//             content
//           }]
//         })
//         rl.write(message.content)
//         say.speak(message.content)
//         usage.prompt_tokens += prompt_tokens
//         usage.completion_tokens += completion_tokens
//         usage.total_tokens += total_tokens
//       } catch (error) {
//         console.error('openai error:', error)
//       } finally {
//         asyncRecursiveQuestionLoop(ai, rl, [...messages, { role: 'user', content }])
//       }
//     })
//   },
//   ,
//   ,
//   [{
//     role: 'system',
//     content: process.argv.slice(2).join(String.fromCharCode(160))
//   }]
// )

/* eslint-enable camelcase */
