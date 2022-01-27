const { Configuration, OpenAIApi } = require('openai')
const { createInterface } = require('readline')
const { EOL } = require('os')
const configuration = new Configuration({ apiKey: process.env.npm_config_openai_secret })
const ai = new OpenAIApi(configuration)
const rl = createInterface({ input: process.stdin, output: process.stdout })

setImmediate(function qa(ai, rl) {
  rl.question('> ', async (prompt) => {
    const { data: { choices: [{ text: answer }] } } = await ai.createCompletion('text-davinci-001', { prompt, temperature: 0.25, max_tokens: 480, top_p: 1, frequency_penalty: 0, presence_penalty: 0 })
    rl.write(answer.trimStart() + EOL)
    qa(ai, rl)
  })
}, ai, rl)
