function generateToken(options) {
  let { length, min, max } = { length: 7, max: 61, min: 0, ...options };
  if (min > 61) min = 61;
  if (max > 61) max = 61;
  if (min > max) max = min;
  let characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += characters[Math.round(Math.random() * (max - min)) + min];
  }
  return randomString;
}

export function generateRandomId() {
  let myId =
    generateToken({ length: 2, min: 36, max: 62 }) +
    generateToken({ length: 1, min: 0, max: 9 }) +
    generateToken({ length: 3, min: 36, max: 62 });
  return myId;
}

//console.log(generateRandomId());
