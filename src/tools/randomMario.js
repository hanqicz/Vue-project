export default function myRandomMario() {
  let param = [
    {
      ciclos: 4,
      valores: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    },
    {
      ciclos: 3,
      valores: "0123456789"
    }
  ];
  let str = "";
  param.map(({ ciclos, valores }) => {
    let array = valores.split("");
    array.some((_, id) => {
      str = str + array[parseInt(Math.random() * array.length)];
      return id == ciclos - 1 ? true : false;
    });
  });
  console.log(str);
}
