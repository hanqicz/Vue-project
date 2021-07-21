export function proString(myString, options) {
  let { nombre, firstCapOnly, allCaps } = {
    nombre: true,
    firstCapOnly: false,
    allCaps: false,
    ...options
  };
  let newString = "";
  if (nombre) {
    let tempArr = myString.toLowerCase().split(" ");
    for (let i = 0; i < tempArr.length; i++) {
      if (i > 0)
        newString +=
          " " + tempArr[i].charAt(0).toUpperCase() + tempArr[i].substring(1);
      else
        newString +=
          tempArr[i].charAt(0).toUpperCase() + tempArr[i].substring(1);
    }
  }
  if (firstCapOnly) {
    newString = myString.toLowerCase();
    newString = newString.charAt(0).toUpperCase() + newString.substring(1);
  }
  if (allCaps) {
    newString = myString.toUpperCase();
  }
  return newString;
}

export function stringSeparator(options) {
  let { separator, myString } = { separator: " ", myString: " ", ...options };
  let myArray = myString.split(separator).map(x => x);
  return myArray;
}

export function matchStrings(options) {
  let {
    s,
    str,
    caseInsensitive,
    tildeInsensitive,
    hInsensitive,
    kInsensitive,
    sInsensitive,
    bInsensitive,
    yInsensitive,
    cInsensitive
  } = {
    s: null,
    str: null,
    caseInsensitive: true,
    tildeInsensitive: true,
    hInsensitive: true,
    kInsensitive: true,
    sInsensitive: true,
    bInsensitive: true,
    yInsensitive: true,
    cInsensitive: true,
    ...options
  };
  if (!s || !str) {
    return false;
  }
  if (caseInsensitive) {
    s = s.toLowerCase();
    str = str.toLowerCase();
  }
  if (tildeInsensitive) {
    s = s
      .normalize("NFD")
      .replace(" ", "")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    str = str
      .normalize("NFD")
      .replace(" ", "")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }
  if (kInsensitive) {
    s = s.replace(/k/g, "c");
    str = str.replace(/k/g, "c");
  }
  if (sInsensitive) {
    s = s.replace(/z/g, "s");
    str = str.replace(/z/g, "s");
  }
  if (bInsensitive) {
    s = s.replace(/b/g, "v");
    str = str.replace(/b/g, "v");
  }
  if (yInsensitive) {
    s = s.replace(/y/g, "i");
    str = str.replace(/y/g, "i");
  }
  if (cInsensitive) {
    s = s.replace(/c/g, "s");
    str = str.replace(/c/g, "s");
  }
  if (hInsensitive) {
    s = s.replace(/h/g, "");
    str = str.replace(/h/g, "");
  }
  return str.includes(s);
}

//console.log(proString("gUSTAVO ErNesTO CastiLLO mAy", { allCaps: true }));
