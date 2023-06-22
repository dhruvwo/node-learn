const { myOpenApi } = require("../../myOpenApi");

exports.askAi = async (req, res) => {
  const question = req.body?.question || "What can you do";
  console.log("question", question);
  const completion = await myOpenApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: question }],
  });
  console.log("completion", completion);
  res.status(200).json(completion);
};
