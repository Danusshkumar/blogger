import FileSaver from "file-saver";

/**
 * exportFile()  FileSaver.js 
 *
 * FileSaver.js 
 *
 * @param data   blob 
 * @param type  
 * @param fileName 
 */
function exportFile(data, type, fileName) {
  const blob = new Blob([data], {type: type});
  FileSaver.saveAs(blob, fileName);
}

export default exportFile;