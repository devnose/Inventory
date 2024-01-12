import React, { useEffect, useRef } from "react";
import { pdfjs, getDocument } from "pdfjs-dist";

const PrintPDF = ({ pdfBuffer }) => {
  const printContainerRef = useRef(null);

  useEffect(() => {
    const loadingTask = getDocument({ data: pdfBuffer });
    loadingTask.promise.then(async (pdf) => {
      const numPages = pdf.numPages;

      // Prepare canvas using PDF page dimensions
      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        if (printContainerRef.current) {
          printContainerRef.current.appendChild(canvas);
        }
      }

      // Append to document to print
      if (printContainerRef.current) {
        document.body.appendChild(printContainerRef.current);
        window.print();
        // Remove this line if you want the canvas to stay in the DOM
      }
    });
  }, [pdfBuffer]);

  return <div ref={printContainerRef}></div>;
};

export default PrintPDF;
