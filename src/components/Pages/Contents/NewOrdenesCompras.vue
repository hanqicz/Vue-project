<style scoped>
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div>
    <div class="contenedor">
      <v-card :loading="isLoading">
        <div class="contenedor">
          <h1>Ordenes de compra</h1>
          <br />
          <div>
            <modal-ordenes-compra
              :isOpen="isOpen"
              :idOrden="idOrden"
              v-on:cerrar="
                () => {
                  isOpen = false;
                  idOrden = 0;
                }
              "
              :sendCallback="initialize"
            />
          </div>
          <div class="d-flex justify-end"></div>
        </div>
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
              <tr v-for="(item, ind) in ordenesFiltradas" :key="ind">
                <td class="text-left">{{ item.id }}</td>
                <td class="text-left">{{ item.nombreEmpleado }}</td>
                <td class="text-left">{{ item.fecha }}</td>
                <td class="text-left">{{ item.comentarioOrden }}</td>
                <td class="text-left">
                  <select
                    class="text--primary"
                    v-model="item.status"
                    @change="actualizarColumna(item.id, item.status, 'status')"
                  >
                    <option
                      v-for="(item, indx) in arrayEstatus"
                      style="color:black"
                      :key="indx"
                    >
                      {{ item }}
                    </option>
                  </select>
                </td>
                <td class="text-left">
                  <select
                    class="text--primary"
                    v-model="item.statusPagos"
                    @change="
                      actualizarColumna(
                        item.id,
                        item.statusPagos,
                        'statusPagos'
                      )
                    "
                  >
                    <option
                      v-for="(item, indx) in arrayEstatusPagos"
                      style="color:black"
                      :key="indx"
                    >
                      {{ item }}
                    </option>
                  </select>
                </td>
                <td class="text-left">
                  {{ item.idCotizacion }}
                  <v-btn
                    icon
                    link
                    :to="`/CotizacionesDetalles/` + item.idCotizacion"
                    ><v-icon small>mdi-flag</v-icon></v-btn
                  >
                </td>
                <td class="text-left">
                  <input
                    type="datetime-local"
                    class="text--primary"
                    :value="changeDate(item.fechaVencimiento)"
                    @change="
                      actualizarColumna(
                        item.id,
                        $event.target.value,
                        'fechaVencimiento'
                      )
                    "
                  /><br />
                </td>
                <td class="text-center text-truncate" style="max-width: 150px;">
                  <div
                    v-for="archivo in archivos.filter(
                      archivo => archivo.idOrden == item.id
                    )"
                    :key="archivo.nombreArchivo"
                  >
                    <form
                      v-if="token"
                      target="_blank"
                      :action="
                        `https://www.argosonline.com.mx/api/newModules/uploads/${archivo.nombreArchivo}`
                      "
                      method="post"
                    >
                      <input class="hidden" name="request" value="1" />
                      <input class="hidden" name="token" :value="token" />
                      <input
                        class="hidden"
                        name="file"
                        :value="archivo.nombreArchivo"
                      />
                      <button class="info--text">
                        {{ archivo.nombreArchivo }}
                      </button>
                    </form>
                  </div>
                </td>
                <td class="text-left">${{ item.total }}</td>
                <td class="text-center">
                  <v-btn
                    icon
                    title="Ver detalles"
                    color="info"
                    link
                    :to="`/OrdenesComprasDetalles/${item.id}`"
                  >
                    <v-icon small color="info"> mdi-view-list </v-icon>
                  </v-btn>
                  <v-btn
                    title="Archivo"
                    icon
                    color="info"
                    @click="
                      () => {
                        isOpen = true;
                        idOrden = item.id;
                      }
                    "
                  >
                    <v-icon small> mdi-file</v-icon>
                  </v-btn>
                  <v-btn
                    title="Descargar PDF"
                    icon
                    color="info"
                    @click="printOrder(item)"
                  >
                    <v-icon small> mdi-file-pdf</v-icon>
                  </v-btn>
                  <v-btn
                    title="eliminar"
                    icon
                    color="error"
                    @click.stop="
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

        <v-card-text> Estas por eliminar esta orden de compra </v-card-text>

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
import axios from "axios";
import XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { matchStrings } from "../../../tools/proStrings";
import ModalOrdenesCompra from "../Modals/ModalOrdenesCompra.vue";
import logo from "../../../assets/logo";

export default {
  name: "OrdenesCompras",
  components: { ModalOrdenesCompra },
  data: () => ({
    isOpen: false,
    isLoading: false,
    fileLoading: false,
    dialog: false,
    files: null,
    imgData: logo,
    idOrden: 0,
    idEliminar: 0,
    totalIVA: 0,
    total: 0,
    subtotal: 0,
    placeholderObs:
      "Extra words for page break hahaha haha ha ha dasd dsa dsa dsa dsa dsa dsa dsa dsa dsas dsasd sa dad sdf sdf sdf sdf sdf sdf sdf sdf sdf Extra words for page break hahaha haha ha ha dasd dsa dsa dsa dsa dsa dsa dsa dsa dsas dsasd sa dad sdf sdf sdf sdf sdf sdf sdf sdf sdf Extra words for page break hahaha haha ha ha dasd dsa dsa dsa dsa dsa dsa dsa dsa dsas dsasd sa dad sdf sdf sdf sdf sdf sdf sdf sdf sdf still need more so I keep writing this stuff wateadasd fdsaf asdas dsad asd Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus commodo sollicitudin orci. In in eleifend lacus. In hac habitasse platea dictumst. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim cursus diam. Cras pharetra convallis viverra. Integer rhoncus justo sed sem tincidunt, non porta purus lobortis. Proin iaculis eros id fringilla blandit. Maecenas at mollis risus. Cras pharetra velit libero. Aliquam blandit, lorem vel auctor condimentum, eros felis vestibulum arcu, quis lobortis quam erat in mi. Mauris eget dapibus dolor. Duis eu urna consectetur, mollis turpis at, pharetra enim.\nAenean nec nisi vitae ligula placerat ultricies sit amet vel urna. Cras ultricies faucibus erat, non convallis justo aliquam pulvinar. Nulla volutpat purus diam, a tempus neque pellentesque at. Aliquam vitae aliquam odio, et euismod libero. Donec pharetra turpis eu nisl fringilla, vehicula ullamcorper velit molestie. Aenean iaculis mattis pulvinar. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean a auctor dui, nec eleifend purus. Phasellus ultrices quam at nisi ornare ultricies. Cras commodo erat at urna dignissim faucibus. Donec tempus tellus sed fermentum vestibulum.\nNulla vestibulum purus eu ante varius congue. Integer sem sapien, tempor quis dapibus bibendum, tincidunt ut diam. Donec vitae ligula auctor, eleifend mauris eget, sagittis velit. Etiam sapien neque, facilisis in hendrerit ut, lobortis in massa. Nam quam magna, facilisis quis fermentum sed, porta efficitur eros. Cras cursus vitae nunc sed efficitur. Integer et mauris tortor. Quisque posuere, lacus a blandit pulvinar, odio mauris suscipit neque, eu suscipit lacus diam non diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean nisl elit, egestas at vulputate eu, porta at urna. Duis at feugiat nisi, eu dapibus neque.\nEtiam viverra libero est, at cursus ex lobortis in. In volutpat elit at tortor mollis elementum. Morbi volutpat finibus mi, eget sollicitudin ante tempor vel. Quisque in felis augue. Suspendisse potenti. Donec scelerisque tincidunt erat, quis facilisis elit tristique eu. Nulla eu elementum sem. Sed rutrum placerat velit, a auctor nulla malesuada non. Integer erat lectus, bibendum quis auctor eget, tempor ut dui. Pellentesque egestas ullamcorper posuere. Aenean mauris orci, accumsan ultrices maximus quis, laoreet id nulla. Quisque mollis tempus mi non commodo. Donec ut tincidunt risus. Aliquam ultricies ac orci ut imperdiet. Duis lacus libero, lacinia non quam ut, vulputate faucibus massa.\nMauris velit dui, pellentesque in facilisis ac, accumsan et nulla. Phasellus vestibulum lorem libero, a consequat neque feugiat eget. Donec placerat, metus non porttitor consequat, nunc arcu ullamcorper nibh, vel finibus lectus risus ut orci. Pellentesque id metus quam. Phasellus vitae varius justo. Quisque sit amet orci pretium, aliquam est ac, pharetra enim. Pellentesque quis vehicula dui, in lacinia est. Aenean volutpat pulvinar lorem vel viverra. Donec ut sodales nisl. Aenean ornare placerat tortor id porttitor. Donec hendrerit ligula in eros pretium euismod. Ut leo tortor, efficitur in semper non, aliquet ut lacus. Donec tincidunt, mi id laoreet sagittis, nunc lorem efficitur justo, non dignissim augue purus sit amet diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    placeholder: [
      {
        nombre: "ASP MEXICANA SA DE CV",
        direccion: "CALLE LAUREL LOTE 32 MANZANA XIX",
        colonia: "CD. INDUSTRIAL BRUNO PAGLIAI",
        estado: "VERACRUZ, VER 91697",
        pais: "Mexico",
        numero: "229-9810-466"
      },
      {
        nombre: "ARGOS INGENIERIA DE AUTOMATIZACION Y CONTROL",
        direccion: "CALLE 19 NO. 418 ENTRE 58 y 60",
        colonia: "AV. INTERNACIONAL",
        estado: "UMAN, YUC 97390",
        pais: "Mexico"
      }
    ],
    placeholder2: [
      {
        cantidad: 1,
        nombre: "fierro pariente",
        descripcion: "CROSSOVER SUB F800 MOD A \n hsdjasdjasd \n sadsadasd",
        precio: 270,
        total: 270
      },
      {
        cantidad: 2,
        nombre: "huevos",
        descripcion: "revueltos",
        precio: 150,
        total: 150
      }
    ],
    headers: [
      { name: "Id", attr: "id", search: "" },
      { name: "Empleado", attr: "nombreEmpleado", search: "" },
      { name: "Fecha de creación", attr: "fecha", search: "" },
      { name: "Comentario", attr: "comentarioOrden", search: "" },
      { name: "Status", attr: "status", search: "" },
      { name: "Status de pago", attr: "statusPago", search: "" },
      { name: "Id de cotizacion", attr: "idCotizacion", search: "" },
      {
        name: "Vencimiento de factura",
        attr: "fechaVencimiento",
        search: ""
      },
      {
        name: "Archivo",
        attr: "files",
        search: ""
      },
      { name: "Total", attr: "total", search: "" }
    ],
    ordenes: [],
    materiales: [],
    arrayEstatus: [
      "Crédito no entregado",
      "Entregado",
      "Pagada no entregada",
      "Pendiente de importación",
      "Pendiente por pago",
      "Cancelado"
    ],
    arrayEstatusPagos: ["Pagado", "Por pagar", "Cancelado"],
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ],
    archivos: [],

    deleteCallback: () => {}
  }),
  computed: {
    token() {
      return localStorage.token ? localStorage.token : "";
    },
    ordenesFiltradas() {
      let filtradas = this.ordenes;
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
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getOrdenes();
      this.getArchivos();
    },
    changeDate(date) {
      let myDate = date.replace(" ", "T");
      return myDate;
    },
    compareStrings(obj) {
      return matchStrings(obj);
    },
    async getOrdenes() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.ordenes = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getArchivos() {
      let myUrl = process.env.VUE_APP_API + "newModules/archivos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.archivos = respuesta.data.rows;
      }
    },
    async actualizarColumna(myId, value, column) {
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        value: value,
        column: column,
        tipo: "updateColumn",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Valor actualizado").goAway(1500);
      }
    },
    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.ordenesFiltradas.map((registro, i) => {
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

      XLSX.writeFile(wb, `Ordenes de compra.xlsx`);
    },

    async eliminar(ind) {
      this.ordenes.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
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
        this.$toasted.success("Orden de compra eliminada").goAway(2000);
        console.log(this.idEliminar);
      }
    },

    async getMateriales(idMat) {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getMaterials",
        id: idMat,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;

      if (respuesta.data.status == "Ok") {
        this.materiales = respuesta.data.rows;
        this.calTotales();
        this.isLoading = false;
      }
    },

    calTotales() {
      const cantidades = this.materiales.map(
        item => parseInt(item.precio) * parseInt(item.cantidad)
      );
      const cantidadesIVA = this.materiales.map(item => parseInt(item.iva));
      cantidades.forEach(value => (this.subtotal += value));
      cantidadesIVA.forEach(
        (value, i) => (this.totalIVA += (value / 100) * cantidades[i])
      );
      this.total = this.subtotal + this.totalIVA;
    },

    async printOrder(order) {
      await this.getMateriales(order.id);
      console.table(this.materiales);
      let lineHeight = 4;
      let actualLine = 10;
      let sangria = 8;
      var doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      doc.setFont("helvetica");
      doc.setFontSize(10);

      doc.addImage(this.imgData, "JPEG", 10, 0, 100, 30);

      doc.text("ARGOS ENERGY SERVICES", sangria * 15, actualLine);
      actualLine += lineHeight;
      doc.text("www.argoses.com", sangria * 15, actualLine);
      actualLine += lineHeight;
      doc.text("E-mail: compras@argoses.com", sangria * 15, actualLine);
      actualLine += lineHeight;
      doc.text("Tel: (52)999 983 5243", sangria * 15, actualLine);

      actualLine += lineHeight * 3;
      doc.text("Orden de Compra", sangria * 18, actualLine);

      doc.line(sangria * 15, actualLine + 1, sangria * 25, actualLine + 1, "F");

      actualLine += lineHeight * 1.5;
      doc.text(
        "No. de Orden   " +
          order.id +
          `      Fecha: ${moment(order?.fecha, "yyyy-mm-dd hh:mm:ss")
            .locale("es-mx")
            .format("DD-MM-yyyy")}`,
        sangria * 15,
        actualLine
      );

      actualLine += 5 * lineHeight;

      let tableHeight = 0;

      doc.autoTable({
        styles: {
          fontSize: "7",
          fillColor: "#fff",
          textColor: "#111",
          cellPadding: 1
        },
        rowPageBreak: "auto",
        bodyStyles: { valign: "top" },
        theme: "plain",
        margin: { top: actualLine, left: sangria, right: sangria },
        head: [["Datos del Proveedor", "Direccion de Envio"]],
        body: [
          [this.placeholder[0].nombre, this.placeholder[1].nombre],
          [this.placeholder[0].direccion, this.placeholder[1].direccion],
          [this.placeholder[0].colonia, this.placeholder[1].colonia],
          [this.placeholder[0].estado, this.placeholder[1].estado],
          [this.placeholder[0].pais, this.placeholder[1].pais],
          [this.placeholder[0].numero]
        ],
        didDrawCell: data => {
          tableHeight = data.cursor.y + data.row.height;
        }
      });

      actualLine = lineHeight * 2 + tableHeight;

      tableHeight = 0;

      doc.autoTable({
        styles: {
          fontSize: "7",
          fillColor: "#fff",
          textColor: "#111",
          cellPadding: 1
        },
        theme: "striped",
        margin: { top: actualLine, left: sangria, right: sangria },
        body: this.materiales,
        pageBreak: "auto",
        columns: [
          {
            header: "Cant.",
            dataKey: "cantidad"
          },
          {
            header: "Articulo",
            dataKey: "nombre"
          },
          {
            header: "Descripcion",
            dataKey: "descripcion"
          },
          {
            header: "Precio Unitario",
            dataKey: "precio"
          },
          {
            header: "IVA",
            dataKey: "iva"
          },
          {
            header: "Monto",
            dataKey: "total"
          }
        ],
        didDrawCell: data => {
          tableHeight = data.cursor.y + data.row.height;
        }
      });

      actualLine = lineHeight * 2 + tableHeight;

      if (actualLine > 280) {
        actualLine = 10;
        doc.addPage();
      }

      doc.text(
        "Sub-Total:                       " + "$ " + this.subtotal,
        sangria * 18,
        actualLine
      );
      doc.line(sangria * 18, actualLine + 1, sangria * 25, actualLine + 1, "F");
      actualLine += lineHeight * 2;

      if (actualLine > 280) {
        actualLine = 10;
        doc.addPage();
      }

      doc.text(
        "          IVA:                       " +
          "$ " +
          this.totalIVA.toFixed(2),
        sangria * 18,
        actualLine
      );
      doc.line(sangria * 18, actualLine + 1, sangria * 25, actualLine + 1, "F");

      actualLine += lineHeight * 2;

      if (actualLine > 280) {
        actualLine = 10;
        doc.addPage();
      }

      doc.text(
        "Total:" +
          this.materiales[0].tipoMoneda +
          "               " +
          "$ " +
          this.total.toFixed(2),
        sangria * 18,
        actualLine
      );
      doc.line(sangria * 18, actualLine + 1, sangria * 25, actualLine + 1, "F");

      actualLine += lineHeight * 2;

      if (actualLine > 280) {
        actualLine = 10;
        doc.addPage();
      }

      doc
        .text("Observaciones:", sangria, actualLine)
        .getFontSize(undefined, "bold");

      actualLine += lineHeight * 2;

      let splitText = doc.splitTextToSize(this.placeholderObs, 190);

      for (var i = 0; i < splitText.length; i++) {
        if (actualLine > 280) {
          actualLine = 10;
          doc.addPage();
        }
        doc.text(sangria, actualLine, splitText[i]);
        actualLine += lineHeight;
      }

      window.open(URL.createObjectURL(doc.output("blob")));
    }
  }
};
</script>

<style scoped></style>
