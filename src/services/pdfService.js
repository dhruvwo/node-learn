const PDFDocument = require("pdfkit-table");
const fs = require("fs");

async function buildPDF(dataCallback, endCallback) {
  const doc = new PDFDocument({ bufferPages: true, margin: 30, size: "A4" });
  doc.pipe(fs.createWriteStream("./document.pdf"));
  (async function () {
    const table = {
      title: "Webosmotic",
      subtitle: "Mari invoice",
      headers: [
        { label: "Name", property: "name", width: 60, renderer: null },
        {
          label: "Description",
          property: "description",
          width: 150,
          renderer: null,
        },
        {
          label: "Price",
          property: "price",
          width: 100,
          renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {
            return `U$ ${Number(value).toFixed(2)}`;
          },
        },
      ],
      datas: [
        {
          name: "Name 1",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ",
          price: "1",
        },
        {
          options: { fontSize: 10, separation: true },
          name: "bold:Name 2",
          description: "bold:Lorem ipsum dolor.",
          price: "bold:1",
        },
      ],
      rows: [
        [
          "Apple",
          "Nullam ut facilisis mi. Nunc dignissim ex ac vulputate facilisis.",
          "10599",
        ],
      ],
    };
    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        doc.font("Helvetica").fontSize(8);
        indexColumn === 0 && doc.addBackground(rectRow, "blue", 0.15);
      },
    });
    doc.fontSize(20).text(`A heading`);

    doc
      .fontSize(12)
      .text(
        `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores, saepe.`
      );
    doc.end();
  })();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);
}

async function buildHTMLPDF(dataCallback, endCallback) {
  const doc = new PDFDocument({ bufferPages: true, margin: 30, size: "A4" });
  doc.pipe(fs.createWriteStream("./html-document.pdf"));

  doc.on("data", dataCallback);
  doc.on("end", endCallback);
}

module.exports = { buildPDF, buildHTMLPDF };
