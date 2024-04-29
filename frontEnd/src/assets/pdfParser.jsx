import { readAsArrayBuffer } from "promise-file-reader"; // Importing function to read a file as an array buffer
import { pdfjs } from "react-pdf"; // Importing pdfjs from react-pdf library

// Async function to parse a PDF file
const parsePDF = async (file) => {
  try {
    const buffer = await readAsArrayBuffer(file);

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    // Create a loading task to get the PDF document
    const loadingTask = pdfjs.getDocument({ data: buffer });

    // Wait for the loading task to complete and get the PDF document
    const pdf = await loadingTask.promise;

    // Initialize an empty string to store the text content of the PDF
    let text = "";

    // Iterate through each page of the PDF
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      // Iterate through each text item on the page and append it to the text string
      content.items.forEach((item) => {
        text += item.str + "\n";
      });
    }

    // Return the parsed text content of the PDF
    return text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error; // Throw the error for further handling
  }
};

export default parsePDF;
