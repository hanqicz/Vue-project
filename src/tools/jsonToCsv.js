function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

export default function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
export function csvToJSON(csv, headers = []) {
  var lines = csv.split("\n");
  var result = [];
  for (var i = 0; i < lines.length; i++) {
    var obj = {};
    lines[i] = lines[i].trim();
    if (lines[i].length > 1) {
      if (lines[i].slice(lines[i].length - 1) == ",") {
        lines[i] = lines[i].slice(0, -1);
      }
      console.log(lines[i]);
    }
    var currentline = lines[i].split(",");
    let cycleLength = headers.length;
    if (currentline.length > headers.length) cycleLength = currentline.length;
    for (var j = 0; j < cycleLength; j++) {
      if (j < headers.length) {
        obj[headers[j]] = currentline[j];
      } else {
        obj[headers[headers.length - 1]] += ", " + currentline[j];
      }
    }
    result.push(obj);
  }
  return result;
}
