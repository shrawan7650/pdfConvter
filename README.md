# PDF Processing Project

This project provides endpoints for compressing PDFs, converting PDFs to Word documents, converting Word documents to PDFs, and merging PDFs.

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/shrawan7650/pdf-project.git
    cd pdf-project
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## Usage

1. Start the server:

    ```sh
    npm start
    ```

2. Use the following endpoints to interact with the project:

    - **Compress PDF**: `POST /compress`
    - **Convert PDF to Word**: `POST /convertPdfToWord`
    - **Convert Word to PDF**: `POST /convertWordToPdf`
    - **Merge PDFs**: `POST /merge`

## Endpoints

### Compress PDF

- **URL**: `/compress`
- **Method**: `POST`
- **Form Data**: `file` (PDF file to compress)

### Convert PDF to Word

- **URL**: `/convertPdfToWord`
- **Method**: `POST`
- **Form Data**: `file` (PDF file to convert)

### Convert Word to PDF

- **URL**: `/convertWordToPdf`
- **Method**: `POST`
- **Form Data**: `file` (Word file to convert)

### Merge PDFs

- **URL**: `/merge`
- **Method**: `POST`
- **Form Data**: `files` (Array of PDF files to merge)

## Examples

To compress a PDF, use the following curl command:

```sh
curl -F "file=@/path/to/your/file.pdf" http://localhost:3000/compress --output compressed.pdf
