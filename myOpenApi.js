const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: "org-Rby9zG9fEpMhYLZ3DffYSU8C",
  apiKey: process.env.chatGPTKey,
});
exports.myOpenApi = new OpenAIApi(configuration);
