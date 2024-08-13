import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [mergeFiles, setMergeFiles] = useState([]);
  const [compressFile, setCompressFile] = useState(null);
  const [pdfToWordFile, setPdfToWordFile] = useState(null);
  const [wordToPdfFile, setWordToPdfFile] = useState(null);

  const [mergePreviews, setMergePreviews] = useState([]);
  const [compressPreview, setCompressPreview] = useState(null);
  const [pdfToWordPreview, setPdfToWordPreview] = useState(null);
  const [wordToPdfPreview, setWordToPdfPreview] = useState(null);

  const [error, setError] = useState(null);

  const handleMergeFilesChange = (e) => {
    const selectedFiles = e.target.files;
    setMergeFiles(selectedFiles);
    const previews = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
    setMergePreviews(previews);
  };

  const handleCompressFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setCompressFile(selectedFile);
    setCompressPreview(URL.createObjectURL(selectedFile));
  };

  const handlePdfToWordFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setPdfToWordFile(selectedFile);
    setPdfToWordPreview(URL.createObjectURL(selectedFile));
  };

  const handleWordToPdfFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setWordToPdfFile(selectedFile);
    setWordToPdfPreview(URL.createObjectURL(selectedFile));
  };

  const handleMerge = async () => {
    if (mergeFiles.length < 2) {
      setError('Please select at least two PDF files to merge.');
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < mergeFiles.length; i++) {
      formData.append('files', mergeFiles[i]);
    }
    const response = await axios.post('http://localhost:5000/merge', formData, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'merged.pdf');
    document.body.appendChild(link);
    link.click();
  };

  const handleCompress = async () => {
    if (!compressFile) {
      setError('Please select a PDF file to compress.');
      return;
    }
    const formData = new FormData();
    formData.append('file', compressFile);
    const response = await axios.post('http://localhost:5000/compress', formData, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'compressed.pdf');
    document.body.appendChild(link);
    link.click();
  };

  const handlePdfToWord = async () => {
    if (!pdfToWordFile) {
      setError('Please select a PDF file to convert to Word.');
      return;
    }
    const formData = new FormData();
    formData.append('file', pdfToWordFile);
    const response = await axios.post('http://localhost:5000/pdf-to-word', formData, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'output.docx');
    document.body.appendChild(link);
    link.click();
  };

  const handleWordToPdf = async () => {
    if (!wordToPdfFile) {
      setError('Please select a Word file to convert to PDF.');
      return;
    }
    const formData = new FormData();
    formData.append('file', wordToPdfFile);
    const response = await axios.post('http://localhost:5000/word-to-pdf', formData, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'output.pdf');
    document.body.appendChild(link);
    link.click();
  };

  const handleCancelMergeFiles = () => {
    setMergeFiles([]);
    setMergePreviews([]);
    setError(null);
  };

  const handleCancelCompressFile = () => {
    setCompressFile(null);
    setCompressPreview(null);
    setError(null);
  };

  const handleCancelPdfToWordFile = () => {
    setPdfToWordFile(null);
    setPdfToWordPreview(null);
    setError(null);
  };

  const handleCancelWordToPdfFile = () => {
    setWordToPdfFile(null);
    setWordToPdfPreview(null);
    setError(null);
  };

  return (
    <div className="container">
      <h1 className="title">PDF App</h1>
      {error && <div className="error">{error}</div>}
      <div className="row">
        <div className="card">
          <h2>Merge PDFs</h2>
          <input type="file" multiple onChange={handleMergeFilesChange} />
          <div className="preview-container">
            {mergePreviews.map((preview, index) => (
              <iframe key={index} src={preview} title={`file-${index}`} className="preview"></iframe>
            ))}
          </div>
          {mergeFiles.length > 0 && <button className="cancel-button" onClick={handleCancelMergeFiles}>Cancel Selection</button>}
          <button className="action-button" onClick={handleMerge}>Merge PDFs</button>
        </div>
        <div className="card">
          <h2>Compress PDF</h2>
          <input type="file" onChange={handleCompressFileChange} />
          {compressPreview && (
            <div className="preview-container">
              <iframe src={compressPreview} title="file-preview" className="preview"></iframe>
              <button className="cancel-button" onClick={handleCancelCompressFile}>Cancel Selection</button>
            </div>
          )}
          <button className="action-button" onClick={handleCompress}>Compress PDF</button>
        </div>
      </div>
      <div className="row">
        <div className="card">
          <h2>PDF to Word</h2>
          <input type="file" onChange={handlePdfToWordFileChange} />
          {pdfToWordPreview && (
            <div className="preview-container">
              <iframe src={pdfToWordPreview} title="file-preview" className="preview"></iframe>
              <button className="cancel-button" onClick={handleCancelPdfToWordFile}>Cancel Selection</button>
            </div>
          )}
          <button className="action-button" onClick={handlePdfToWord}>Convert PDF to Word</button>
        </div>
        <div className="card">
          <h2>Word to PDF</h2>
          <input type="file" onChange={handleWordToPdfFileChange} />
          {wordToPdfPreview && (
            <div className="preview-container">
              <iframe src={wordToPdfPreview} title="file-preview" className="preview"></iframe>
              <button className="cancel-button" onClick={handleCancelWordToPdfFile}>Cancel Selection</button>
            </div>
          )}
          <button className="action-button" onClick={handleWordToPdf}>Convert Word to PDF</button>
        </div>
      </div>
    </div>
  );
}

export default App;
