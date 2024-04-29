import { readAsArrayBuffer } from "promise-file-reader";
import { pdfjs } from "react-pdf";

const parsePDF = async (file) => {
  try {
    const buffer = await readAsArrayBuffer(file);
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const loadingTask = pdfjs.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      content.items.forEach((item) => {
        text += item.str + "\n";
      });
    }
    return text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  }
};

export default parsePDF;
