<style>
.myContainer {
  margin: 10px;
}
</style>
<template>
  <div class="myContainer">
    <v-card :loading="isLoading">
      <div class="contenedor">
        <h1>Entrada Inventario</h1>
        <v-row justify="space-between">
          <v-col md="3">
            <v-select
              :items="tipo"
              label="Tipo de material"
              v-model="visible"
              width="200"
              dense
            ></v-select>
          </v-col>
          <v-col md="3" class="d-flex justify-end">
            <modal-entrada-inventario
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
              :sendCallback="getInventario"
              :sendCallbackArchivos="getArchivos"
            />
            <v-spacer></v-spacer>
            <modal-entrada-inventario2
              :isOpen2="isOpen2"
              v-on:cerrar2="isOpen2 = false"
              v-on:abrir2="isOpen2 = true"
              :sendCallback="
                () => {
                  getInventario({
                    tipoMateriales: visible
                  });
                }
              "
              :sendCallbackArchivos="getArchivos"
            />
          </v-col>
        </v-row>
      </div>
      <v-simple-table fixed-header height="76vh">
        <template>
          <thead>
            <tr>
              <th
                class="text-center"
                v-for="(header, ind) in headers.filter(filtrarTipo)"
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
              <th class="text-center" v-if="isMP == true"></th>
              <th v-if="isBuy == true || isMP == true"></th>
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
                v-for="(header, ind) in headers.filter(filtrarTipo)"
                :key="ind"
              >
                {{ header["name"] }}
              </th>
              <th class="text-center" v-if="isMP == true">
                Dimensiones
              </th>
              <th class="text-center" v-if="isBuy == true || isMP == true">
                Certificado
              </th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, ind) in inventarioFiltrado" :key="ind">
              <td class="text-left">{{ item.idRandom }}</td>
              <td class="text-left" v-if="isMake">{{ item.job }}</td>
              <td class="text-left" v-if="isMP">
                <v-icon small v-if="item.metalico == '1'">mdi-anvil</v-icon>
              </td>
              <td class="text-left" style="font-size: 17px">
                {{ item.nombreMaterial }}
              </td>
              <td class="text-left">{{ item.noParte }}</td>
              <td class="text-left" v-if="isBuy">{{ item.po }}</td>
              <td class="text-left">{{ item.fecha }}</td>
              <td class="text-left" v-if="isBuy">{{ item.lote }}</td>
              <td class="text-left" v-if="isBuy">{{ item.descuento }}</td>
              <td class="text-left" v-if="isMP">
                <tubo :percent="item.porcentaje" v-if="item.forma == 'tubo'" />
                <barra
                  :percent="item.porcentaje"
                  v-if="item.forma == 'barra'"
                />
                <dibujo-placa
                  :percent="item.porcentaje"
                  v-if="item.forma == 'placa'"
                />
                <p v-if="item.porcentaje == undefined" class="danger--text">
                  Medidas no verificadas
                </p>
              </td>
              <td class="text-left" v-if="isMP">
                <span v-if="item.forma">
                  Longitud: {{ item.longitud }}<br
                /></span>
                <span v-if="item.forma == 'tubo'">
                  Diámetro interno: {{ item.innerD }}<br
                /></span>
                <span v-if="item.forma == 'tubo' || 'barra'">
                  Diámetro externo: {{ item.outerD }}
                  <br />
                </span>
                <span v-if="item.forma == 'placa'">
                  Altura: {{ item.height }}<br
                /></span>
                <span v-if="item.forma == 'placa'">
                  Espesor: {{ item.width }}<br
                /></span>
              </td>
              <td
                v-if="isBuy || isMP"
                class="text-center text-truncate"
                style="max-width: 150px;"
              >
                <div
                  v-for="archivo in archivos.filter(
                    archivo => archivo.idEntradaAlmacen == item.idRandom
                  )"
                  :key="archivo.nombreArchivo"
                >
                  <form
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
              <td class="text-center">
                <v-btn
                  title="Editar"
                  icon
                  color="info"
                  @click="
                    () => {
                      isEditing = true;
                      isOpen = true;
                      idEditing = item.idRandom;
                    }
                  "
                >
                  <v-icon small> mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  title="Eliminar"
                  icon
                  color="error"
                  @click="
                    () => {
                      dialog = true;
                      deleteCallback = () => {
                        idEliminar = item.idRandom;
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
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Advertencia </v-card-title>

        <v-card-text> Estas por eliminar este elemento </v-card-text>

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
import ModalEntradaInventario from "../Modals/ModalEntradaInventario";
import ModalEntradaInventario2 from "../Modals/ModalEntradaInventario2";
import Tubo from "../SVG/Tubo";
import Barra from "../SVG/Barra";
import DibujoPlaca from "../SVG/DibujoPlaca";
import axios from "axios";
import XLSX from "xlsx";
import { matchStrings } from "../../../tools/proStrings";

export default {
  name: "EntradaInventario",
  components: {
    ModalEntradaInventario,
    ModalEntradaInventario2,
    Barra,
    Tubo,
    DibujoPlaca
  },
  data: () => ({
    isOpen: false,
    isOpen2: false,
    isEditing: false,
    dialog: false,
    idEditing: 0,
    isMake: false,
    isBuy: true,
    isMP: false,
    mainPoints: "50,20 20,60 100,60 130,20",
    downPoints: "20,60 23,65 103,65 100,60",
    rightColor: "fill:#transparent",
    colors: ["#212121", "#D32F2F", "#FDD835", "#00695C", "#0097A7"],
    visible: "BUY",
    tipo: ["BUY", "MP", "MAKE"],
    headers: [
      { name: "Id", attr: "idRandom", search: "", tipo: "both", tipo2: "" },
      { name: "Job", attr: "job", search: "", tipo: "MAKE", tipo2: "" },
      {
        name: "Metalico",
        attr: "metalico",
        search: "",
        tipo: "MP",
        tipo2: ""
      },
      {
        name: "Nombre",
        attr: "nombreMaterial",
        search: "",
        tipo: "both",
        tipo2: ""
      },
      {
        name: "Numero de parte",
        attr: "noParte",
        search: "",
        tipo: "both",
        tipo2: ""
      },
      { name: "PO", attr: "po", search: "", tipo: "BUY", tipo2: "MP" },
      { name: "Fecha", attr: "fecha", search: "", tipo: "both", tipo2: "" },
      { name: "Lote", attr: "lote", search: "", tipo: "BUY", tipo2: "MP" },
      {
        name: "Descuento",
        attr: "descuento",
        search: "",
        tipo: "BUY",
        tipo2: "MP"
      },
      {
        name: "% disponible",
        attr: "porcentaje",
        search: "",
        tipo: "MP",
        tipo2: ""
      }
    ],
    inventario: [],
    archivos: [],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    inventarioFiltrado() {
      let filtradas = this.inventario.filter(item => item.tipo == this.visible);
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
    },
    token() {
      return localStorage.token;
    }
  },
  watch: {
    visible(tipo) {
      if (tipo == "BUY") {
        this.isBuy = true;
        this.isMake = false;
        this.isMP = false;
      }
      if (tipo == "MAKE") {
        this.isBuy = false;
        this.isMake = true;
        this.isMP = false;
      }
      if (tipo == "MP") {
        this.isBuy = true;
        this.isMake = false;
        this.isMP = true;
      }
    }
  },
  methods: {
    initialize() {
      this.getInventario();
      this.getArchivos();
    },
    filtrarTipo(header) {
      if (
        header.tipo == "both" ||
        header.tipo == this.visible ||
        header.tipo2 == this.visible
      ) {
        return header;
      }
    },
    async getInventario(options) {
      this.isLoading = true;
      // Esto solamente setea el tipo de la tabla, no tiene que ver con la api
      let { tipoMateriales } = { tipoMateriales: "BUY", ...options };
      this.visible = tipoMateriales;
      // Esto solamente setea el tipo de la tabla, no tiene que ver con la api

      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.inventario = respuesta.data.rows;
        this.inventario = this.inventario.filter(item => item.salida == 0);
        this.isLoading = false;
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.inventarioFiltrado.map((registro, i) => {
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

      XLSX.writeFile(wb, `Inventario.xlsx`);
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
    async eliminar(ind) {
      this.inventario.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
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
        this.getInventario({ tipoMateriales: this.visible });
        this.$toasted.success("Elemento eliminado").goAway(2000);
      }
    }
  }
};
</script>

<style scoped></style>
