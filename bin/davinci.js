#!/usr/bin/env node

const { createInterface } = require('readline')
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret || process.env.OPENAI_API_KEY })

setImmediate(function next (ai, cli, { argv } = process) {
  cli.question('> ', async (prompt) => {
    try {
      const { data: { choices: [{ text: answer }] } } = await ai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.25,
        max_tokens: 1536,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
      cli.write(`${answer.trimStart()}\n`)
    } catch (err) {
      console.error(err)
    } finally {
      next(ai, cli, { argv })
    }
  })
}, new OpenAIApi(configuration), createInterface({ input: process.stdin, output: process.stdout }))
