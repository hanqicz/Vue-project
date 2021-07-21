<style>
.myContainer {
  margin: 10px;
}
.btns {
  margin: 0px 5px;
}
</style>
<template>
  <v-form v-model="valid"
    ><div class="myContainer">
      <v-card :loading="isLoading">
        <div class="contenedor">
          <h1>
            Operaciones
            <v-btn icon @click="camposVisibles = !camposVisibles">
              <v-icon>mdi-form-dropdown</v-icon>
            </v-btn>
          </h1>
          <v-icon></v-icon>
          <v-row v-if="camposVisibles">
            <v-col cols="12"><h3>General</h3></v-col>
            <v-col cols="2">
              <v-autocomplete
                label="Centro de Trabajo"
                v-model="operacion.centrosTrabajo"
                :items="centrosTrabajos"
                item-value="id"
                item-text="codigo"
                dense
                :rules="rule"
                ><template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="data.item.codigo"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-html="data.item.descripcion"
                    ></v-list-item-subtitle>
                  </v-list-item-content> </template
              ></v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Codigo de Operacion"
                v-model="operacion.codigoOperacion"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Descripcion Predeterminada"
                v-model="operacion.descripcion"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Tiempo Predeterminado"
                v-model="operacion.tiempo"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-row
                ><v-col cols="6">
                  <v-btn
                    class="btns"
                    v-if="isEditing"
                    @click="send(idEditing)"
                    block
                    >Editar</v-btn
                  ><v-btn class="btns" v-else block @click="send"
                    >Agregar</v-btn
                  ></v-col
                ><v-col cols="6">
                  <v-btn
                    class="btns"
                    v-if="isEditing"
                    @click="
                      () => {
                        isEditing = !isEditing;
                        operacion = {};
                      }
                    "
                    block
                    >Cancelar</v-btn
                  ><v-btn class="btns" v-else block @click="operacion = {}"
                    >Borrar campos</v-btn
                  ></v-col
                ></v-row
              >
            </v-col>
          </v-row>
        </div>

        <v-simple-table fixed-header height="76vh">
          <template>
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
              <tr v-for="(item, ind) in operacionesFiltradas" :key="ind">
                <td class="text-left">{{ item.descripcionCentroTrabajo }}</td>
                <td class="text-left">{{ item.codigoOperacion }}</td>
                <td class="text-left">{{ item.descripcion }}</td>
                <td class="text-left">{{ item.tiempo }}</td>
                <td class="text-center">
                  <v-btn
                    title="Editar"
                    icon
                    color="info"
                    @click="
                      () => {
                        getOperacion(item.id);
                        idEditing = item.id;
                        isEditing = true;
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
    </div></v-form
  >
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";
import { matchStrings } from "../../../tools/proStrings";

export default {
  name: "Operaciones",
  data: () => ({
    camposVisibles: true,
    isEditing: false,
    dialog: false,
    idEditing: 0,
    headers: [
      {
        name: "Centro de Trabajo",
        attr: "descripcionCentroTrabajo",
        search: ""
      },
      { name: "Codigo de Operacion", attr: "codigoOperacion", search: "" },
      {
        name: "Descripción Predeterminada",
        attr: "descripcion",
        search: ""
      },
      { name: "Tiempo Predeterminado", attr: "tiempo", search: "" }
    ],
    operaciones: [],
    operacion: {},
    centrosTrabajos: [],
    valid: false,
    rule: [v => !!v || "Este campo es requerido"],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    operacionesFiltradas() {
      let filtradas = this.operaciones.filter(hoja => {
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
  methods: {
    initialize() {
      this.getOperaciones();
      this.getCentrosTrabajos();
    },
    async getOperaciones() {
      this.isLoading = true;

      let myUrl = process.env.VUE_APP_API + "newModules/operaciones.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.operaciones = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getCentrosTrabajos() {
      this.isLoading = true;

      let myUrl = process.env.VUE_APP_API + "newModules/centrosTrabajo.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.centrosTrabajos = respuesta.data.rows;
        console.log(this.centrosTrabajos);
        this.isLoading = false;
      }
    },
    async getOperacion(myId) {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/operaciones.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.operacion = respuesta.data.rows[0];
        this.isLoading = false;
      }
    },
    async send(myId) {
      if (this.valid == false) {
        this.$toasted.error("Revisar campos incorrectos", {
          duration: 2000,
          position: "bottom-center"
        });
        return;
      }
      let myTipo = "insert";
      if (this.isEditing) {
        myTipo = "update";
      }
      this.isSending = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl = process.env.VUE_APP_API + "newModules/operaciones.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        items: [this.operacion],
        tipo: myTipo,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Elemento enviado", {
          duration: 2000,
          position: "bottom-center"
        });
        this.isSending = false;
        this.isEditing = false;
        this.operacion = {};
        this.getOperaciones();
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.operacionesFiltradas.map((registro, i) => {
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

      XLSX.writeFile(wb, `Operaciones.xlsx`);
    },
    async eliminar(ind) {
      this.operaciones.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/operaciones.php";
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
        this.getOperaciones();
        this.$toasted.success("Elemento eliminado").goAway(2000);
      }
    }
  }
};
</script>

<style scoped></style>
