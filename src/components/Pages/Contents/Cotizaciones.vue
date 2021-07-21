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
          <h1>Cotizaciones</h1>
          <br />
          <div>
            <modal-cotizaciones
              :isOpen="isOpen"
              :idCotizacion="idCotizacion"
              v-on:cerrar="
                () => {
                  isOpen = false;
                  idCotizacion = 0;
                }
              "
              :sendCallback="getCotizaciones"
            />
          </div>
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
                <th></th>
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
                <th>Total</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, ind) in cotizacionesFiltradas" :key="ind">
                <td class="text-left">{{ item.id }}</td>
                <td class="text-left">{{ item.nombreEmpleado }}</td>
                <td class="text-left">{{ item.fecha }}</td>
                <td class="text-left">{{ item.comentarioCotizacion }}</td>
                <td class="text-left">{{ item.status }}</td>
                <td class="text-left">
                  {{ item.idRequisicion }}
                  <v-btn
                    icon
                    link
                    :to="`/RequisicionMateriales/` + item.idRequisicion"
                    ><v-icon small>mdi-flag</v-icon></v-btn
                  >
                </td>
                <td>${{ item.total }}</td>
                <td class="text-center">
                  <v-btn
                    icon
                    title="Ver detalles"
                    color="info"
                    link
                    :to="`/CotizacionesDetalles/${item.id}`"
                  >
                    <v-icon small color="info"> mdi-view-list </v-icon>
                  </v-btn>
                  <v-btn
                    title="Autorizar"
                    icon
                    color="info"
                    v-if="item.status != 'Por aprobar' ? false : true"
                    @click="
                      () => {
                        isOpen = true;
                        idCotizacion = item.id;
                      }
                    "
                  >
                    <v-icon small> mdi-cart-check</v-icon>
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
import axios from "axios";
import XLSX from "xlsx";
import { matchStrings } from "../../../tools/proStrings";
import ModalCotizaciones from "../Modals/ModalCotizaciones.vue";

export default {
  name: "Cotizaciones",
  components: { ModalCotizaciones },
  data: () => ({
    isOpen: false,
    isLoading: false,
    dialog: false,
    idCotizacion: 0,
    idEliminar: 0,
    headers: [
      { name: "Id", attr: "id", search: "" },
      { name: "Empleado", attr: "nombreEmpleado", search: "" },
      { name: "Fecha de creación", attr: "fecha", search: "" },
      { name: "Comentario", attr: "comentario", search: "" },
      { name: "Status", attr: "status", search: "" },
      { name: "Id de requisicion", attr: "idRequisicion", search: "" }
    ],
    cotizaciones: [],
    materiales: [],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    cotizacionesFiltradas() {
      let filtradas = this.cotizaciones;
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
      this.getCotizaciones();
    },
    async getCotizaciones() {
      this.isLoading = true;
      let myUrl =
        process.env.VUE_APP_API + "newModules/cotizacionesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.cotizaciones = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getMateriales(myId) {
      this.isLoading = true;
      let myUrl =
        process.env.VUE_APP_API + "newModules/cotizacionesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getMaterials",
        id: myId,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;

      if (respuesta.data.status == "Ok") {
        this.isLoading = false;
        return respuesta.data.rows;
      }
    },
    async eliminar(ind) {
      this.cotizaciones.splice(ind, 1);
      let myUrl =
        process.env.VUE_APP_API + "newModules/cotizacionesMateriales.php";
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
        this.$toasted.success("Requisicion eliminada").goAway(2000);
      }
    },
    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.cotizacionesFiltradas.map((registro, i) => {
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

      XLSX.writeFile(wb, `Cotizaciones.xlsx`);
    }
  }
};
</script>

<style scoped></style>
