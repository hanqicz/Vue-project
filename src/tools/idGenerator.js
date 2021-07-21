export function getId(letter, numbers) {
  var chars = "ABCDEFGHIKLMNOPQRSTVXYZabcdefghijklmnopqrstuvwxyz";
  var nums = "0123456789";
  var id = "";

  for (let i = 0; i < letter; i++) {
    let randNum = Math.floor(Math.random() * chars.length);
    id += chars.substring(randNum, randNum + 1);
  }
  for (let i = 0; i < numbers; i++) {
    let randNum = Math.floor(Math.random() * nums.length);
    id += nums.substring(randNum, randNum + 1);
  }

  return id;
}
