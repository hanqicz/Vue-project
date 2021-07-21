<style>
.espaciadorVertical {
  height: 24px;
}
.tableImage {
  max-width: 50px;
  max-height: 50px;
}
.tableSpacer {
  min-height: 6px;
}
.hidden {
  display: none;
}
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div class="contenedor">
    <v-data-table
      loading-text="Tratando de adquirir información"
      :loading="isLoading"
      v-model="selected"
      :headers="headers"
      :items="usuariosFiltrados"
      item-key="noParte"
      multi-sort
      class="elevation-1"
      show-select
      :dense="dense"
      :footer-props="{
        'usuarios-per-page-text': 'Usuarios por pagina',
        'usuarios-per-page-options': [10, 20, 30, 40, 50, 100, 200, 500]
      }"
      :items-per-page="200"
      fixed-header
      height="70vh"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title v-if="selected.length === 0">
            Listas de asistencia formativa
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
            v-if="selected.length === 0"
          ></v-divider>
          <v-toolbar-title v-if="selected.length === 0">
            <div class="espaciadorVertical"></div>
            <v-text-field
              :loading="isLoadingLista"
              :disabled="isLoadingLista"
              v-model="search"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-toolbar-title>

          <v-toolbar-title v-if="selected.length > 0">
            <v-btn
              class="mx-2"
              fab
              icon
              small
              elevation="0"
              color="danger"
              @click="deleteUsuarios()"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              icon
              small
              elevation="0"
              color="success"
              @click="exportSelectedToCSV()"
            >
              <v-icon dark>mdi-table-arrow-right</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-switch
            v-model="dense"
            hide-details
            dense
            inset
            color="secondary"
          ></v-switch>
          <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
          <v-btn
            class="ma-2"
            text
            icon
            color="blue darken-1"
            v-bind="attrs"
            v-on="on"
            v-if="false"
          >
            <v-icon>mdi-tag-outline</v-icon> </v-btn
          ><v-btn
            class="ma-2"
            text
            icon
            color="success"
            @click="descargarReporte"
          >
            <v-icon>mdi-google-spreadsheet</v-icon>
          </v-btn>
          <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
          <form
            target="_blank"
            action="https://www.argosonline.com.mx/api/templates/nombreLista!apellidoPaterno!apellidoMaterno!nombre(s).xlsx"
            method="post"
          >
            <input class="hidden" name="request" value="1" />
            <input class="hidden" name="token" :value="token" />
            <input
              class="hidden"
              name="file"
              value="nombreLista!apellidoPaterno!apellidoMaterno!nombre(s).xlsx"
            />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ma-2"
                  text
                  icon
                  color="info"
                  type="submit"
                  @click="() => {}"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-file-download-outline</v-icon>
                </v-btn>
              </template>
              <span>Descargar formato de plantilla</span>
            </v-tooltip>
          </form>
          <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
          <v-file-input
            label="Sube un formato de hoja"
            small-chips
            dense
            :disabled="fileLoading"
            show-size
            color="info"
            truncate-length="12"
            prepend-outer-icon="mdi-upload"
            append-outer-icon="mdi-upload"
            :full-width="false"
            :rules="rules"
            accept=".xlsx"
            @click:append-outer="readFile"
            v-model="file"
          ></v-file-input>
          <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
        </v-toolbar>
      </template>
      <template v-slot:[`item.nombre`]="{ item }"
        >{{ item.nombres }} {{ item.apellidoPaterno }}
        {{ item.apellidoMaterno }}</template
      >
      <template v-slot:[`item.pCumplimiento`]="{ item }"
        >{{ item.pCumplimiento }} %</template
      >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon link :to="`/CumplimientoUsuario/${item.id}`">
          <v-icon small color="info"> mdi-view-list </v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.qr`]="{ item }">
        <div class="tableSpacer"></div>
        <img
          class="tableImage"
          :src="
            `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${item.noParte}`
          "
          :lazy-src="
            `https://chart.googleapis.com/chart?chs=10x10&cht=qr&chl=${item.noParte}`
          "
          alt="QR"
        />
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Recargar</v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";
import { matchStrings, stringSeparator } from "../../../tools/proStrings";
import XLSX from "xlsx";
import xlsxFileToJson from "../../../tools/xlsxTools";
export default {
  name: "ListAsistsEmpleados",
  data: () => ({
    baseURL: process.env.VUE_APP_API,
    fileLoading: false,
    text: "",
    usuarios: [],
    nombresHoja: [],
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ],
    file: [],
    tipos: ["Materia Prima", "Make Item", "Buy Item", "Ensamble"],
    tipoSeleccionado: "",
    isLoading: false,
    isLoadingLista: false,
    selected: [],
    dense: false,
    search: "",
    items: [],
    relaciones: [],
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "% de Cumplimiento", value: "pCumplimiento" },
      { text: "Acciones", value: "actions", sortable: false }
    ],
    inventario: [],
    editedIndex: -1,
    insertListAsist: {
      nombre: "",
      descripcion: ""
    },
    editedItem: {
      item: "",
      tipo: "",
      descripcion: "",
      datos: "otros datos"
    },
    defaultItem: {
      item: "",
      tipo: "",
      descripcion: "",
      datos: "otros datos"
    },
    token: localStorage.getItem("token")
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Item" : "Editar Item";
    },
    usuariosFiltrados() {
      if (this.search) {
        return this.usuarios.filter(
          usuario =>
            matchStrings({ s: this.search, str: usuario.nombres }) ||
            matchStrings({ s: this.search, str: usuario.apellidoPaterno }) ||
            matchStrings({ s: this.search, str: usuario.apellidoMaterno })
        );
      } else {
        return this.usuarios;
      }
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getUsuarios();
      this.getRequisitos();
      this.getRelaciones();
    },
    async getRequisitos() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerRequisitosFormativos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.items = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getRelaciones() {
      if (localStorage.token != "") {
        this.isLoading = true;
        let respuesta = await axios.post(
          process.env.VUE_APP_API + "obtenerRelacionesFormativas.php",
          {
            request: 1,
            token: localStorage.token
          }
        );
        localStorage.token = respuesta.data.token;
        if (respuesta.data.status == "Ok") {
          this.relaciones = respuesta.data.rows;
          this.isLoading = false;
        }
      }
    },
    async getUsuarios() {
      if (localStorage.token != "") {
        this.isLoading = true;
        let respuesta = await axios.post(
          process.env.VUE_APP_API + "obtenerUsuariosFormativos.php",
          {
            request: 1,
            token: localStorage.token
          }
        );
        localStorage.token = respuesta.data.token;
        if (respuesta.data.status == "Ok") {
          this.usuarios = respuesta.data.rows;
          this.isLoading = false;
        }
      }
    },
    async readFile() {
      this.fileLoading = true;
      let myFileName = this.file.name.replace(/\.[^/.]+$/, "");
      let nombresHoja = stringSeparator({
        myString: myFileName,
        separator: "!"
      });
      nombresHoja.push(
        `${nombresHoja[3].trim()[0]}${nombresHoja[1].trim()}${
          nombresHoja[2].trim()[0]
        }@argosonline.com.mx`
      );
      this.nombresHoja = nombresHoja;
      console.log(this.nombresHoja);
      xlsxFileToJson(this.file, this.sendFile);
    },
    async sendFile(celdas) {
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);

      let misRequisitos = celdas.filter(
        celda => celda.row >= 10 && celda.col == 0
      );
      misRequisitos = misRequisitos.map(requisito => {
        requisito.cumpleTxt = celdas.filter(
          celda => requisito.row == celda.row && celda.col == 18
        )[0].val;
        requisito.calificacion = celdas.filter(
          celda => requisito.row == celda.row && celda.col == 15
        )[0].val;
        if (matchStrings({ s: requisito.cumpleTxt, str: "Si" })) {
          requisito.cumple = 1;
        } else {
          requisito.cumple = 0;
        }

        return requisito;
      });
      console.log(misRequisitos);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarListaFormativa.php",
        {
          request: 1,
          nombresHoja: this.nombresHoja,
          requisitos: misRequisitos,
          token: localStorage.token
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Requisitos actualizados").goAway(2000);
        this.getUsuarios();
        this.fileLoading = false;
        this.file = null;
        this.dialog = false;
      } else if (respuesta.data.status == "Error") {
        this.$toasted.error(respuesta.data.msg).goAway(2000);
      }
      console.log("Se llamó a la función que envía a la api");
    },
    async descargarReporte() {
      let columnasProcesadas = [];
      var requisitos = XLSX.utils.json_to_sheet(columnasProcesadas);
      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, requisitos, "requisitos");

      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 0;

      // Aquí podemos iterar con los usuarios y los requisitos para escribir en cada celda
      this.items.map((requisito, row) => {
        this.usuarios.map((usuario, col) => {
          if (col == 0) {
            XLSX.utils.sheet_add_aoa(sheet, [[requisito.nombre]], {
              origin: XLSX.utils.encode_cell({ r: row + 1 + offset, c: col })
            });
            XLSX.utils.sheet_add_aoa(sheet, [["Calificación"]], {
              origin: XLSX.utils.encode_cell({ r: row + 2 + offset, c: col })
            });
          }
          if (row == 0) {
            XLSX.utils.sheet_add_aoa(
              sheet,
              [
                [
                  `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`
                ]
              ],
              {
                origin: XLSX.utils.encode_cell({ r: row, c: col + 1 })
              }
            );
          }
          this.relaciones.map(relacion => {
            if (
              relacion.idRequisito == requisito.id &&
              relacion.idUsuario == usuario.id
            ) {
              const d = new Date(relacion.fechaAplicacion);

              XLSX.utils.sheet_add_aoa(sheet, [[d]], {
                origin: XLSX.utils.encode_cell({
                  r: row + 1 + offset,
                  c: col + 1,
                  t: "d"
                })
              });

              XLSX.utils.sheet_add_aoa(sheet, [[relacion.calificacion]], {
                origin: XLSX.utils.encode_cell({
                  r: row + 2 + offset,
                  c: col + 1
                })
              });
            }
          });
        });
        offset += 1;
      });

      // Aquí podemos iterSar con los usuarios y los requisitos para escribir en cada celda

      // export Excel file
      XLSX.writeFile(wb, `CumplimientoDeUsuarios.xlsx`); // name of the file is 'book.xlsx'
    }
  }
};
</script>
