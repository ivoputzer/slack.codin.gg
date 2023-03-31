#!/usr/bin/env node

const { createReadStream } = require('fs')
const { createInterface } = require('readline')
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret || process.env.OPENAI_API_KEY })

// const { Configuration, OpenAIApi } = require('openai')
// const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret || process.env.OPENAI_API_KEY })
// const openai = new OpenAIApi(configuration)
// const response = await openai.createImage({prompt: "A cute baby sea otter", n: 2, size: "512x512"})

// console.log(response)
// response.data.data.foreach(({url}) => console.log(url))

setImmediate(function next (ai, cli, { argv } = process) {
  cli.question('> ', async (prompt) => {
    try {
      // const response = await ai.createImage({prompt, n: 1, size: '512x512'})
      const response = await ai.createImageEdit(
        createReadStream('codin.2.png'),
        createReadStream('codin.2.mask.png'),
        prompt,
        1,
        '512x512'
      )
      console.log(response.data.data[0])
      const { url } = response.data.data[0]
      cli.write(`${url.trimStart()}\n`)
    } catch (err) {
      console.error(err)
    } finally {
      next(ai, cli, { argv })
    }
  })
}, new OpenAIApi(configuration), createInterface({ input: process.stdin, output: process.stdout }))
