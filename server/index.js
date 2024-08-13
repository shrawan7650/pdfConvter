const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());  // Add CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PDF Merge
app.post('/merge', upload.array('files'), async (req, res) => {
  const mergedPdf = await PDFDocument.create();
  for (const file of req.files) {
    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }
  const mergedPdfBytes = await mergedPdf.save();
  const outputPath = path.join(__dirname, 'uploads/merged.pdf');
  fs.writeFileSync(outputPath, mergedPdfBytes);
  res.download(outputPath);
});

// PDF Compress
app.post('/compress', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, 'uploads/compressed.pdf');
  
  try {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(inputPath));
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const images = page.node.Resources.XObject;
      if (images) {
        const imageKeys = Object.keys(images);
        for (const key of imageKeys) {
          const image = images[key];
          if (image.lookupMaybe('Subtype')?.name === 'Image') {
            const originalImage = image.lookupMaybe('XObject');
            const imageData = originalImage?.contents?.buffer;

            if (imageData) {
              const compressedImageData = await sharp(imageData)
                .jpeg({ quality: 50 }) // Adjust the quality as needed
                .toBuffer();

              originalImage.contents = compressedImageData;
              originalImage.set('Length', compressedImageData.length);
            }
          }
        }
      }
    }

    const lowQualityPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, lowQualityPdfBytes);

    res.download(outputPath);
  } catch (error) {
    console.error('Error compressing PDF:', error);
    res.status(500).send('Error compressing PDF');
  } finally {
    fs.unlinkSync(inputPath); // Clean up the uploaded file
  }
});

// PDF to Word (Placeholder as pdf-lib doesn't support this directly)
app.post('/pdf-to-word', upload.single('file'), (req, res) => {
  // Implement conversion logic
  res.send('PDF to Word conversion not implemented');
});

// Word to PDF (Placeholder as pdf-lib doesn't support this directly)
app.post('/word-to-pdf', upload.single('file'), (req, res) => {
  // Implement conversion logic
  res.send('Word to PDF conversion not implemented');
});

app.listen(5000, () => console.log('Server running on port 5000'));
