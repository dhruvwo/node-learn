const express = require("express");
const router = express.Router();
const { generateHtmlPdf } = require("../services/htmlToPdf");
const { buildPDF } = require("../services/pdfService");

router.get("/get-pdf", (req, res) => {
  try {
    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment;filename=invoice.pdf`,
    });
    let counter = 0;
    buildPDF(
      (chunk) => {
        counter++;
        console.log("data update", counter);
        stream.write(chunk);
      },
      () => {
        console.log("stream ended");
        stream.end();
      }
    );
  } catch (err) {
    console.log(err);
    logger.error("err", err);
    return res.status(500).send("Something went wrong!");
  }
});

router.get("/get-pdf-from-template", async (req, res) => {
  try {
    const pdfBuffer = await generateHtmlPdf();
    console.log("done", { pdfBuffer });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment;filename=template.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);
    logger.error("err", err);
    return res.status(500).send("Something went wrong!");
  }
});

module.exports = router;
