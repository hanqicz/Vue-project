const axios = require("axios");
const myUrl = process.env.VUE_APP_API + "CSVInsertarItems.php";

const askMaterials = async () => {
  let respuesta = await axios.post(myUrl, {
    request: 1,
    token: "vJRGYvnfd3NfAQsJqKUjbAUXYlL3ifk9",
    items: [
      {
        descripcion: "ARP-Q151-036",
        tipo: "MAKE",
        noParte: "MANDREL",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-025",
        tipo: "MAKE",
        noParte: "SLEEVE COVER",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-021",
        tipo: "MAKE",
        noParte: "SHOE SUPPORT",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-020",
        tipo: "MAKE",
        noParte: "BACK-UP SHOE",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-A151-022",
        tipo: "MAKE",
        noParte: "UPPER ELEMENT- NUK 7.00",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-A151-023",
        tipo: "MAKE",
        noParte: "CENTER ELEMENT- NUK 7.00",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-A151-024",
        tipo: "MAKE",
        noParte: "END ELEMENT- NUK 7.00",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-019",
        tipo: "MAKE",
        noParte: "BACK-UP SHOE",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-018",
        tipo: "MAKE",
        noParte: "SHOE SUPPORT",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-028",
        tipo: "MAKE",
        noParte: "RETAINER ELEMENT",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-Q151-029",
        tipo: "MAKE",
        noParte: "RING SHEAR",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-Q151-003",
        tipo: "MAKE",
        noParte: "INTERNAL SLIP HOUSING",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-002",
        tipo: "MAKE",
        noParte: "SLIP INTERNAL",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-005",
        tipo: "MAKE",
        noParte: "PISTON",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-Q151-030",
        tipo: "MAKE",
        noParte: "PICKUP RING",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-004",
        tipo: "MAKE",
        noParte: "CYLINDER",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-Q151-006",
        tipo: "MAKE",
        noParte: "WEDGE UPPER",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-007",
        tipo: "MAKE",
        noParte: "SLIP MANDREL",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-008",
        tipo: "MAKE",
        noParte: "SLIP BARREL",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-009",
        tipo: "MAKE",
        noParte: "WEDGE LOWER",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-Q151-031",
        tipo: "MAKE",
        noParte: "RING PICKUP",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-010",
        tipo: "MAKE",
        noParte: "SLEEVE ANCHOR",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-P151-015",
        tipo: "MAKE",
        noParte: "RING ANCHOR",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-Q151-012",
        tipo: "MAKE",
        noParte: "SLEEVE SHIFTING",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-Q151-013",
        tipo: "MAKE",
        noParte: "SLEEVE SHEAR",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-Q151-011",
        tipo: "MAKE",
        noParte: "BOTTOM SUB",
        cantidad: 1,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-PB341-PEEK",
        tipo: "BUY",
        noParte: "BACKUP RING 341",
        cantidad: 16,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-PB342-PEEK",
        tipo: "BUY",
        noParte: "BACKUP RING 342",
        cantidad: 8,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-PB351-PEEK",
        tipo: "BUY",
        noParte: "BACK-UP RING 351",
        cantidad: 4,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-OR351-A90",
        tipo: "BUY",
        noParte: "ORING 351 AFLAS 90 DURO",
        cantidad: 2,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-OR342-A90",
        tipo: "BUY",
        noParte: "ORING 342 AFLAS 90 DURO",
        cantidad: 4,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-OR341-A90",
        tipo: "BUY",
        noParte: "ORING 341 AFLAS 90 DURO",
        cantidad: 8,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-TR0313-C-0313",
        tipo: "BUY",
        noParte: "TOR. CA. H. 5/16-18 X 5/16",
        cantidad: 4,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-PN0250-L-0380",
        tipo: "BUY",
        noParte: "PIN LISO 1/4 BRONCE",
        cantidad: 4,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARP-A151-026",
        tipo: "BUY",
        noParte: "HEX SOCKET SET SCREW",
        cantidad: 4,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-A151-037",
        tipo: "BUY",
        noParte: "RING PIN",
        cantidad: 6,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-A151-032",
        tipo: "BUY",
        noParte: "SLEEVE SHEAR PIN",
        cantidad: 3,
        ensamble: "ARE-A151-001"
      },
      {
        descripcion: "ARA-OP0250-C-0375",
        tipo: "BUY",
        noParte: "OPRESOR 1/4 X 3/8",
        cantidad: 2,
        ensamble: "ARE-A151-001"
      }
    ]
  });

  if (respuesta) {
    console.log("Sincronización exitosa");
  } else {
    console.log("Sincronización fallida");
  }
};

console.log("Corriendo el programa...");
askMaterials();
