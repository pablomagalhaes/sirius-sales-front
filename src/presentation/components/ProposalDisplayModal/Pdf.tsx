import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${String(pdfjs.version)}/pdf.worker.js`

export function Pdf ({ url }: any): JSX.Element {
  const [numPages, setNumPages] = useState(null)

  const onDocumentLoadSuccess = ({ numPages }): void => {
    setNumPages(numPages)
  }

  return (
    <div>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess} loading="">
        {numPages !== null && Array.from({ length: numPages }, (_, i) => i + 1).map((num) =>
            <Page
              key={num}
              pageNumber={num}
              loading=""
              renderAnnotationLayer={false}
              renderTextLayer={false} scale={1.7}
            />
        )}
      </Document>
    </div>
  )
}
