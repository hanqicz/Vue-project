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
            Locaciones
            <v-btn icon @click="camposVisibles = !camposVisibles">
              <v-icon>mdi-form-dropdown</v-icon>
            </v-btn>
          </h1>
          <v-icon></v-icon>
          <v-row v-if="camposVisibles">
            <v-col cols="12"><h3>General</h3></v-col>
            <v-col cols="2">
              <v-text-field
                label="Código"
                v-model="locacion.codigo"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="Direccion Envio"
                v-model="locacion.direccionEnvio"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="Direccion Facturacion"
                v-model="locacion.direccionFacturacion"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="12"><h3>Direcciones</h3></v-col>
            <v-col cols="6">
              <v-text-field
                label="Nombre de la Compañia"
                v-model="locacion.nombreCompania"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Pais"
                v-model="locacion.pais"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Estado"
                v-model="locacion.estado"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Ciudad"
                v-model="locacion.ciudad"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Codigo Postal"
                v-model="locacion.codigoPostal"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-text-field
                label="Direccion"
                v-model="locacion.direccion"
                dense
                :rules="rule"
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
                        locacion = {};
                      }
                    "
                    block
                    >Cancelar</v-btn
                  >
                  <v-btn class="btns" v-else block @click="locacion = {}"
                    >Borrar Campos</v-btn
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
              <tr v-for="(item, ind) in locacionesFiltradas" :key="ind">
                <td class="text-left">{{ item.codigo }}</td>
                <td class="text-left">{{ item.direccionEnvio }}</td>
                <td class="text-left">{{ item.direccionFacturacion }}</td>
                <td class="text-left">{{ item.nombreCompania }}</td>
                <td class="text-left">{{ item.pais }}</td>
                <td class="text-left">{{ item.estado }}</td>
                <td class="text-left">{{ item.ciudad }}</td>
                <td class="text-left">{{ item.codigoPostal }}</td>
                <td class="text-left">{{ item.direccion }}</td>
                <td class="text-center">
                  <v-btn
                    title="Editar"
                    icon
                    color="info"
                    @click="
                      () => {
                        getLocacion(item.id);
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
  name: "Locaciones",
  data: () => ({
    camposVisibles: true,
    isEditing: false,
    dialog: false,
    idEditing: 0,
    headers: [
      { name: "Código", attr: "codigo", search: "" },
      {
        name: "Direccion Envio",
        attr: "direccionEnvio",
        search: ""
      },
      {
        name: "Direccion Facturacion",
        attr: "direccionFacturacion",
        search: ""
      },
      { name: "Compañia", attr: "nombreCompania", search: "" },
      { name: "Pais", attr: "pais", search: "" },
      { name: "Estado", attr: "estado", search: "" },
      { name: "Ciudad", attr: "ciudad", search: "" },
      { name: "Codigo Postal", attr: "codigoPostal", search: "" },
      { name: "Direccion", attr: "direccion", search: "" }
    ],
    locaciones: [],
    locacion: {},
    valid: false,
    rule: [v => !!v || "Este campo es requerido"],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    locacionesFiltradas() {
      let filtradas = this.locaciones.filter(hoja => {
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
      this.getLocaciones();
    },
    async getLocaciones() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/locaciones.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.locaciones = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getLocacion(myId) {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/locaciones.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.locacion = respuesta.data.rows[0];
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
      let myUrl = process.env.VUE_APP_API + "newModules/locaciones.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        items: [this.locacion],
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
        this.locacion = {};
        this.getLocaciones();
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.locacionesFiltradas.map((registro, i) => {
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

      XLSX.writeFile(wb, `Locaciones.xlsx`);
    },
    async eliminar(ind) {
      this.locaciones.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/locaciones.php";
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
        this.getLocaciones();
        this.$toasted.success("Elemento eliminado").goAway(2000);
      }
    }
  }
};
</script>

<style scoped></style>
