<style scoped>
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div>
    <!-- comentario -->
    <div class="contenedor">
      <v-card :loading="isLoading">
        <div class="contenedor">
          <h1>Procesos</h1>
          <br />
          <div class="d-flex justify-end">
            <modal-procesos
              :isOpen="isOpen"
              :isEditing="isEditing"
              :idEditing="idEditing"
              v-on:cerrar="
                () => {
                  isOpen = false;
                  isEditing = false;
                  idEditing = 0;
                }
              "
              v-on:abrir="isOpen = true"
              :sendCallback="getJobs"
            />
          </div>
        </div>
        <br />

        <v-simple-table fixed-header height="70vh">
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  class="text-center"
                  v-for="(header, ind) in headers"
                  :key="ind"
                >
                  <v-text-field
                    :placeholder="header['name']"
                    append-icon="mdi-table-search"
                    dense
                    v-model="header.search"
                    class="shrink"
                  ></v-text-field>
                </th>
                <th class="text-center">
                  <v-btn
                    title="Descargar reporte excel de los registros filtrados"
                    icon
                    color="success"
                    @click="descargarReporte"
                  >
                    <v-icon small> mdi-google-spreadsheet</v-icon>
                  </v-btn>
                </th>
              </tr>
              <tr>
                <th
                  class="text-left"
                  v-for="(header, ind) in headers"
                  :key="ind"
                >
                  {{ header["name"] }}
                </th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, ind) in hojasProcesosFiltradas" :key="ind">
                <td class="text-left">{{ item.id }}</td>
                <td class="text-left">{{ item.tipo }}</td>
                <td class="text-left">{{ item.ocCliente }}</td>
                <td class="text-left">{{ item.dibujo }}</td>
                <td class="text-left">{{ item.notas }}</td>
                <td class="text-left">{{ item.nombreEmpleado }}</td>
                <td class="text-left">{{ item.fechaHora }}</td>
                <td class="text-center">
                  <v-btn
                    icon
                    title="Ver detalles"
                    color="info"
                    link
                    :to="`/ProcesosDetalles/${item.id}`"
                  >
                    <v-icon small color="info"> mdi-view-list </v-icon>
                  </v-btn>
                  <v-btn
                    title="Editar"
                    icon
                    color="info"
                    @click="
                      () => {
                        isEditing = true;
                        isOpen = true;
                        idEditing = item.id;
                      }
                    "
                  >
                    <v-icon small> mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    title="Descargar PDF"
                    icon
                    color="info"
                    @click="printJob(item.id)"
                  >
                    <v-icon small> mdi-file-pdf</v-icon>
                  </v-btn>
                  <v-btn
                    title="Eliminar"
                    icon
                    color="error"
                    @click="
                      () => {
                        dialog = true;
                        deleteCallback = () => {
                          idEliminar = item.id;
                          eliminar(ind, item);
                        };
                      }
                    "
                  >
                    <v-icon small> mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </div>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Advertencia </v-card-title>

        <v-card-text> Estas por eliminar esta cotizacion </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="info" text @click="dialog = false"> Cancelar </v-btn>

          <v-btn
            color="red"
            text
            @click="
              () => {
                dialog = false;
                deleteCallback();
              }
            "
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ModalProcesos from "../Modals/ModalProcesos";
import axios from "axios";
import XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { matchStrings } from "../../../tools/proStrings";

export default {
  name: "Procesos",
  components: {
    ModalProcesos
  },
  data: () => ({
    isOpen: false,
    isEditing: false,
    isLoading: false,
    dialog: false,
    idEditing: 0,
    headers: [
      { name: "Id", attr: "id", search: "" },
      {
        name: "Tipo",
        attr: "tipo",
        search: ""
      },
      { name: "OC Cliente", attr: "ocCliente", search: "" },
      { name: "Dibujo", attr: "dibujo", search: "" },
      { name: "Notas OT", attr: "notasOt", search: "" },
      { name: "Empleado", attr: "nombreEmpleado", search: "" },
      { name: "Fecha de creación", attr: "fechaHora", search: "" }
    ],
    hojasProcesos: [],
    singleJob: [],
    cliente: {
      nombre: "Mario Puc",
      tel1: "9983156764",
      direccion: "Domicilio conocido"
    },
    items: [
      {
        proveedor: "T003 10.70",
        claveOperacion: "344444",
        prgFecha: "9/06/2021 10/06/2021",
        descripcion: "TORNEADO SUJETAR CON CHUCK Y HACER TESTIGOS A Ø6.280",
        configurar: "1.00",
        tasaProceso: "1 Hrs/Parte",
        proceso: "1.00"
      },
      {
        proveedor: "T003 10.70",
        claveOperacion: "344444",
        prgFecha: "9/06/2021 10/06/2021",
        descripcion: "TORNEADO SUJETAR CON CHUCK Y HACER TESTIGOS A Ø6.280",
        configurar: "1.00",
        tasaProceso: "1 Hrs/Parte",
        proceso: "1.00"
      }
    ],
    hojaProcesos: {
      id: "1",
      fecha: "2021-06-24 09:47:45"
    },
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    hojasProcesosFiltradas() {
      let filtradas = this.hojasProcesos;
      filtradas = filtradas.filter(hoja => {
        let isIn = false;
        let countMatches = 0;
        this.headers.map(header => {
          if (matchStrings({ s: header.search, str: hoja[header.attr] }))
            countMatches++;
          else if (header.search == "") {
            countMatches++;
          }
        });
        if (countMatches == this.headers.length) isIn = true;
        return isIn;
      });
      return filtradas;
    }
  },
  methods: {
    initialize() {
      this.getJobs();
    },

    async printJob(id) {
      //let pdfName = "test";

      await this.getOneJob(id);
      let lineHeight = 4;
      let totalWidth = 216;
      let totalHeight = 279;
      let actualLine = 10;
      let sangria = 8;
      let firstDataJob = [
        {
          atributo: "Parte: " + this.singleJob?.noParte,
          atributo2: "Línea:"
        },
        {
          atributo: "Rev: " + this.singleJob?.revision,
          atributo2: "Dibujo: " + this.singleJob?.dibujo
        },
        {
          atributo: "Cant Orden: " + this.singleJob?.cantidadOrden,
          atributo2: "Fecha orden: " + this.singleJob?.fechaHora
        },
        {
          atributo: "Cant Fabricada: " + this.singleJob?.cantidadFabricada,
          atributo2: "Horas Est: "
        },
        {
          atributo: "OC de cliente: " + this.singleJob?.ocCliente,
          atributo2: ""
        }
      ];
      //let space = 5;
      var doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [totalWidth, totalHeight]
      });
      doc.setFont("helvetica");
      doc.setFontSize(9);
      doc.text(
        `${moment(this.hojaProcesos?.fecha, "yyyy-mm-dd hh:mm:ss")
          .locale("es-mx")
          .format("DD-mm-yyyy  h:mm a")}`,
        sangria,
        actualLine
      );
      actualLine += lineHeight;
      doc.text("ARGOS INGENIERIA DE AUTOMATIZACION Y CON", sangria, actualLine);
      actualLine += lineHeight;
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Viajero", 108, actualLine, "center");
      doc.setFont("helvetica", "normal");
      actualLine += 9;
      doc.text(`Job: ${this.singleJob.noParte}`, 108, actualLine, "center");
      doc.setFontSize(9);
      actualLine += 3;
      doc.line(sangria, actualLine, 216 - sangria, actualLine);
      actualLine += lineHeight + lineHeight / 2;
      doc.autoTable({
        styles: {
          fontSize: "9",
          fillColor: "#fff",
          textColor: "#111",
          cellPadding: 1
          //margin: { left: 0, 0, bottom: totalPageHeight - espacioUtilizado},
        },
        theme: "plain",
        startY: actualLine,
        margin: {
          top: sangria,
          left: sangria,
          right: sangria,
          bottom: sangria
        },
        body: firstDataJob,
        columns: [
          {
            dataKey: "atributo"
          },
          {
            dataKey: "atributo2"
          }
        ],
        didDrawCell: data => {
          tableHeight = data.cursor.y + data.row.height;
          let columnWidth = data.cell.width;
          doc.setDrawColor(255, 255, 255);
          data.doc.line(
            data.cursor.x,
            data.cursor.y,
            data.cursor.x + columnWidth,
            data.cursor.y
          );
          var rows = data.table.body;
          actualLine = tableHeight;
          if (data.row.index === rows.length - 1) {
            // Aquí haces la suma y la evaluación
            console.log("index iguales");
            if (data.cell.height + actualLine > totalHeight) {
              doc.addPage();
              console.log("si se alcanzó la altura");
              actualLine = sangria;
            }
          }
        }
      });

      actualLine += lineHeight;
      doc.setDrawColor(0, 0, 0);
      doc.line(sangria, actualLine, 216 - sangria, actualLine);
      actualLine += lineHeight + lineHeight / 2;
      doc.text(`Notas OT: ${this.singleJob?.notas}`, sangria, actualLine);
      actualLine += lineHeight;
      doc.setDrawColor(0, 0, 0);
      doc.line(sangria, actualLine, 216 - sangria, actualLine);
      actualLine += lineHeight + lineHeight / 2;
      doc.setFontSize(11);
      doc.line(sangria, actualLine - 1, 100 - sangria, actualLine - 1);
      doc.line(126, actualLine - 1, 216 - sangria, actualLine - 1);
      doc.setFont("helvetica", "bold");
      doc.text(`Procesos`, 108, actualLine, "center");
      doc.setFont("helvetica");
      doc.setFontSize(9);
      actualLine += lineHeight + lineHeight / 2;
      let tableHeight = 0;
      doc.autoTable({
        styles: {
          fontSize: "9",
          fillColor: "#fff",
          textColor: "#111",
          cellPadding: 1
          //margin: { left: 0, 0, bottom: totalPageHeight - espacioUtilizado},
        },
        theme: "striped",
        startY: actualLine,
        margin: {
          top: sangria,
          left: sangria,
          right: sangria,
          bottom: sangria
        },
        body: this.singleJob?.procesos,
        columns: [
          {
            header: "Provedor CT/Oper/Serv",
            dataKey: "proveedor"
          },
          {
            header: "Clave de Operación",
            dataKey: "claveOperacion"
          },
          {
            header: "Inicio Prg Fin Prg",
            dataKey: "prgFecha"
          },
          {
            header: "Descripción",
            dataKey: "descripcion"
          },
          {
            header: "Configurar",
            dataKey: "configurar"
          },
          {
            header: "Tasa Proceso",
            dataKey: "tasaProceso"
          },
          {
            header: "Proceso",
            dataKey: "proceso"
          }
        ],
        didDrawCell: data => {
          tableHeight = data.cursor.y + data.row.height;
          let columnWidth = data.cell.width;
          doc.setDrawColor(0, 0, 0);
          data.doc.line(
            data.cursor.x,
            data.cursor.y,
            data.cursor.x + columnWidth,
            data.cursor.y
          );
          var rows = data.table.body;
          actualLine = tableHeight;
          if (data.row.index === rows.length - 1) {
            // Aquí haces la suma y la evaluación
            if (data.cell.height + actualLine > totalHeight) {
              doc.addPage();
              console.log("si se alcanzó la altura");
              actualLine = sangria;
            }
          }
        }
      });
      actualLine += lineHeight * 2;
      doc.setFontSize(11);
      doc.setDrawColor(0, 0, 0);
      doc.line(sangria, actualLine - 1, 100 - sangria, actualLine - 1);
      doc.line(126, actualLine - 1, 216 - sangria, actualLine - 1);
      doc.setFont("helvetica", "bold");
      doc.text(`Materiales`, 108, actualLine, "center");
      doc.setFont("helvetica");
      doc.setFontSize(9);
      actualLine += lineHeight;
      doc.autoTable({
        styles: {
          fontSize: "9",
          fillColor: "#fff",
          textColor: "#111",
          cellPadding: 1
        },
        theme: "striped",
        startY: actualLine,
        margin: {
          top: sangria,
          left: sangria,
          right: sangria,
          bottom: sangria
        },
        body: this.singleJob?.materiales,
        columns: [
          {
            header: "Vencimiento",
            dataKey: "vencimiento"
          },
          {
            header: "Clave Requerimento",
            dataKey: "claveRequerimiento"
          },
          {
            header: "Material Descripción",
            dataKey: "descripcion"
          },
          {
            header: "Primario Ubicación",
            dataKey: "primarioUbicación"
          },
          {
            header: "Cantidad",
            dataKey: "cantidad"
          }
        ],
        didDrawCell: data => {
          tableHeight = data.cursor.y + data.row.height;
          let columnWidth = data.cell.width;
          doc.setDrawColor(0, 0, 0);
          data.doc.line(
            data.cursor.x,
            data.cursor.y,
            data.cursor.x + columnWidth,
            data.cursor.y
          );
          var rows = data.table.body;
          actualLine = tableHeight;
          if (data.row.index === rows.length - 1) {
            // Aquí haces la suma y la evaluación
            if (data.cell.height + actualLine > totalHeight) {
              doc.addPage();
              console.log("si se alcanzó la altura");
              actualLine = sangria;
            }
          }
        }
      });
      actualLine = lineHeight * 2 + tableHeight;
      //doc.autoPrint();
      //This is a key for printing
      //doc.output("dataurlnewwindow");
      window.open(URL.createObjectURL(doc.output("blob")));
      //doc.save("test.pdf");
    },
    async getJobs() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.hojasProcesos = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getOneJob(myId) {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.singleJob = respuesta.data.rows[0];
        console.log(this.singleJob);
        this.singleJob.procesos = respuesta.data.procesos.map(proceso => {
          return {
            proveedor: "T003 10.70",
            claveOperacion: "344444",
            prgFecha: "9/06/2021 10/06/2021",
            descripcion: "TORNEADO SUJETAR CON CHUCK Y HACER TESTIGOS A Ø6.280",
            configurar: "1.00",
            tasaProceso: "1 Hrs/Parte",
            proceso: "1.00",
            ...proceso
          };
        });
        this.singleJob.materiales = respuesta.data.materiales[0];
        this.singleJob.materiales = respuesta.data.materiales.map(material => {
          return {
            vencimiento: "T003 10.70",
            claveRequerimiento: "344444",
            materialDescripcion: "DNMG-432 MARCA:TUNGALOY",
            primarioUbicación: "E-0003",
            cantidad: "0.00",
            ...material
          };
        });
        this.singleJob.archivos = respuesta.data.archivos[0];
        this.isLoading = false;
      }
    },
    async eliminar(ind) {
      this.hojasProcesos.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEliminar,
        value: 1,
        column: "eliminado",
        tipo: "updateColumn",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Proceso eliminado").goAway(2000);
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.hojasProcesosFiltradas.map((registro, i) => {
        let col = 0;
        this.headers.map(header => {
          if (i == 0) {
            XLSX.utils.sheet_add_aoa(sheet, [[header.name]], {
              origin: XLSX.utils.encode_cell({ r: i, c: col })
            });
          }
          if (Object.prototype.hasOwnProperty.call(registro, header.attr)) {
            XLSX.utils.sheet_add_aoa(sheet, [[registro[header.attr]]], {
              origin: XLSX.utils.encode_cell({ r: i + offset, c: col })
            });
          }
          col++;
        });
      });

      XLSX.writeFile(wb, `RequisicionesMateriales.xlsx`);
    }
  }
};
</script>
