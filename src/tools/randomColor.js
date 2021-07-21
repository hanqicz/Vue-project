export default function getRandomColor(options) {
  let { caseBase, lights, darks } = {
    caseBase: null,
    lights: 0,
    darks: 0,
    ...options
  };
  let myColors = [
    "red",
    "pink",
    "purple",
    "deep-purple",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "light-green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deep-orange",
    "brown",
    "blue-grey",
    "green",
    "teal",
    "grey"
  ];
  let myIndex = myColors.length - 1;
  let lumen = "";
  if (caseBase) {
    myIndex = caseBase.charCodeAt(0) % (myColors.length - 1);
  } else {
    myIndex = Math.floor(Math.random() * (myColors.length - 1));
  }
  if (lights > 0) {
    lights > 5 ? (lights = 5) : null;
    lumen = " lighten-" + Math.ceil(Math.random() * lights);
  } else if (darks > 0) {
    darks > 5 ? (darks = 5) : null;
    lumen = " darken-" + Math.ceil(Math.random() * darks);
  }
  if (lights < 0 || darks < 0)
    console.error("Los parametros lights y darks tienen que ser mayores a 0");

  return `${myColors[myIndex]}${lumen}`;
}
//console.log(getRandomColor({ caseBase: "Mario", darks: -1 }));
