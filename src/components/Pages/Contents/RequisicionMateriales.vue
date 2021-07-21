<style>
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div>
    <div class="contenedor">
      <v-card :loading="isLoading">
        <div class="contenedor">
          <h1>Requisicion de materiales</h1>
          <br />
          <div class="d-flex justify-end">
            <modal-requisicion-materiales
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
              :sendCallback="getRequisiciones"
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
              <tr v-for="(item, ind) in hojasRequisicionesFiltradas" :key="ind">
                <td class="text-left">{{ item.id }}</td>
                <td class="text-left">{{ item.comentarioRequisicion }}</td>
                <td class="text-left">{{ item.nombreEmpleado }}</td>
                <td class="text-left">{{ item.fecha }}</td>
                <td class="text-left">{{ item.status }}</td>
                <td class="text-left">placeholder</td>
                <td class="text-center">
                  <v-btn
                    icon
                    title="Ver detalles"
                    color="info"
                    link
                    :to="`/RequisicionMateriales/${item.id}`"
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
import ModalRequisicionMateriales from "../Modals/ModalRequisicionMateriales";
import axios from "axios";
import XLSX from "xlsx";
import { matchStrings } from "../../../tools/proStrings";

export default {
  name: "RequisicionMateriales",
  components: {
    ModalRequisicionMateriales
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
        name: "Descripción/Comentario",
        attr: "comentarioRequisicion",
        search: ""
      },
      { name: "Empleado", attr: "nombreEmpleado", search: "" },
      { name: "Fecha de creación", attr: "fecha", search: "" },
      { name: "Status", attr: "status", search: "" },
      { name: "Total", attr: "total", search: "" }
    ],
    hojasRequisiciones: [],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    hojasRequisicionesFiltradas() {
      let filtradas = this.hojasRequisiciones;
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
      this.getRequisiciones();
    },
    async getRequisiciones() {
      this.isLoading = true;
      let myUrl =
        process.env.VUE_APP_API + "newModules/requisicionesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.hojasRequisiciones = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async eliminar(ind) {
      this.hojasRequisiciones.splice(ind, 1);
      let myUrl =
        process.env.VUE_APP_API + "newModules/requisicionesMateriales.php";
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

      this.hojasRequisicionesFiltradas.map((registro, i) => {
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

<style scoped></style>
