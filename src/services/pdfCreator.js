const PDFDocument = require("pdfkit");
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream("/file.pdf")); // write to PDF
doc.pipe(res); // HTTP response

// add stuff to PDF here using methods described below...

// finalize the PDF and end the stream
doc.end();
