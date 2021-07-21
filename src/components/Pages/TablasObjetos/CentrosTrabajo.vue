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
            Centro de Trabajo
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
                v-model="centroTrabajo.codigo"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Descripción"
                v-model="centroTrabajo.descripcion"
                dense
                :rules="rule"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Costo Hora"
                v-model="centroTrabajo.costoHora"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Marca"
                v-model="centroTrabajo.marca"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Modelo"
                v-model="centroTrabajo.modelo"
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Numero de serie"
                v-model="centroTrabajo.numeroSerie"
                dense
                :rules="rule"
              ></v-text-field>
              <v-col cols="12"
                ><v-file-input
                  accept="image/*, .csv, .xlsx, .mp4"
                  label="Foto de placa"
                  small-chips
                  :disabled="fileLoading"
                  append-outer-icon="mdi-upload"
                  show-size
                  color="info"
                  truncate-length="12"
                  :full-width="false"
                  :rules="rules"
                  v-model="file"
                  @change="cargarArchivos"
                ></v-file-input>
                <v-row>
                  <div v-if="archivosGuardados">
                    <div
                      v-for="(archivo, indx) in archivosGuardados"
                      :key="indx"
                    >
                      <form
                        target="_blank"
                        :action="
                          `https://www.argosonline.com.mx/api/newModules/uploads/${archivo}`
                        "
                        method="post"
                      >
                        <input class="hidden" name="request" value="1" />
                        <input class="hidden" name="token" :value="token" />
                        <input class="hidden" name="file" :value="archivo" />
                        <button class="info--text">
                          {{ archivo }}
                        </button>
                        <v-btn
                          icon
                          color="error"
                          x-small
                          @click="eliminarArchivoGuardado(archivo)"
                          ><v-icon>mdi-delete</v-icon></v-btn
                        >
                      </form>
                    </div>
                  </div>
                </v-row></v-col
              >
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
                        centroTrabajo = {};
                        archivosGuardados = [];
                      }
                    "
                    block
                    >Cancelar</v-btn
                  ><v-btn
                    class="btns"
                    v-else
                    block
                    @click="
                      () => {
                        centroTrabajo = {};
                        archivosGuardados = [];
                      }
                    "
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
              <tr v-for="(item, ind) in centrosTrabajoFiltradas" :key="ind">
                <td class="text-left">{{ item.codigo }}</td>
                <td class="text-left">{{ item.descripcion }}</td>
                <td class="text-left">{{ item.costoHora }}</td>
                <td class="text-left">{{ item.marca }}</td>
                <td class="text-left">{{ item.modelo }}</td>
                <td class="text-left">{{ item.numeroSerie }}</td>
                <td class="text-left">{{ item.fotoPlaca }}</td>
                <td class="text-center">
                  <v-btn
                    title="Editar"
                    icon
                    color="info"
                    @click="
                      () => {
                        idEditing = item.id;
                        isEditing = true;
                        getCentroTrabajo(item.id);
                        getArchivosGuardados();
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
  name: "CentrosTrabajo",
  data: () => ({
    camposVisibles: true,
    fileLoading: false,
    isEditing: false,
    dialog: false,
    idEditing: 0,
    file: null,
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ],
    headers: [
      { name: "Código", attr: "codigo", search: "" },
      {
        name: "Descripción",
        attr: "descripcion",
        search: ""
      },
      { name: "Costo Hora", attr: "costoHora", search: "" },
      { name: "Marca", attr: "marca", search: "" },
      { name: "Modelo", attr: "modelo", search: "" },
      { name: "Numero de serie", attr: "numeroSerie", search: "" },
      { name: "Foto de placa", attr: "fotoPlaca", search: "" }
    ],
    archivosGuardados: [],
    centrosTrabajo: [],
    centroTrabajo: {},
    valid: false,
    rule: [v => !!v || "Este campo es requerido"],
    deleteCallback: () => {}
  }),
  created() {
    this.initialize();
  },
  computed: {
    centrosTrabajoFiltradas() {
      let filtradas = this.centrosTrabajo.filter(hoja => {
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
      this.getCentrosTrabajo();
    },
    async getCentrosTrabajo() {
      this.isLoading = true;

      let myUrl = process.env.VUE_APP_API + "newModules/centrosTrabajo.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.centrosTrabajo = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async getCentroTrabajo(myId) {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/centrosTrabajo.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.centroTrabajo = respuesta.data.rows[0];
        this.isLoading = false;
      }
    },
    async getArchivosGuardados() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuestaMateriales = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: "getArchivos",
        token: localStorage.token
      });
      if (respuestaMateriales.data.status == "Ok") {
        this.archivosGuardados = respuestaMateriales.data.rows.map(
          archivo => archivo.nombreArchivo
        );
        this.isLoading = false;
      } else {
        this.archivosGuardados = [];
        this.isLoading = false;
      }
    },

    async cargarArchivos() {
      if (!this.file) return;
      this.isSending = true;
      this.$toasted.show("Cargando archivo...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl = process.env.VUE_APP_API + "newModules/uploadFile.php";
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("request", 1);
      formData.append("token", localStorage.token);

      let respuesta = await axios.post(myUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Archivo cargados", {
          duration: 2000,
          position: "bottom-center"
        });
        this.archivosGuardados = this.archivosGuardados.concat(
          respuesta.data.rows
        );
        this.file = null;
        this.isSending = false;
      }
    },

    async updateArchivos() {
      let myUrl = process.env.VUE_APP_API + "newModules/archivos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        idOrden: this.idOrden,
        tipo: "updateArchivosOrden",
        archivos: this.archivosGuardados,
        token: localStorage.token
      });
      if (respuesta.data.status == "Ok") {
        this.archivosGuardados = respuesta.data.rows.map(
          archivo => archivo.nombreArchivo
        );
        this.cerrar();
        this.sendCallback();
      }
    },

    eliminarArchivoGuardado(nameArchivo) {
      this.archivosGuardados = this.archivosGuardados.filter(archivo => {
        if (archivo != nameArchivo) {
          return true;
        }
      });
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
      let myUrl = process.env.VUE_APP_API + "newModules/centrosTrabajo.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        items: [this.centroTrabajo],
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
        this.centroTrabajo = {};
        this.archivosGuardados = [];
        this.getCentrosTrabajo();
      }
    },

    async descargarReporte() {
      let columnasProcesadas = [];
      var registros = XLSX.utils.json_to_sheet(columnasProcesadas);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, registros, "registros");
      var sheet = wb.Sheets[wb.SheetNames[0]];
      var offset = 1;

      this.centrosTrabajoFiltradas.map((registro, i) => {
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

      XLSX.writeFile(wb, `centrosTrabajo.xlsx`);
    },
    async eliminar(ind) {
      this.centrosTrabajo.splice(ind, 1);
      let myUrl = process.env.VUE_APP_API + "newModules/centrosTrabajo.php";
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
        this.getCentrosTrabajo();
        this.$toasted.success("Elemento eliminado").goAway(2000);
      }
    }
  }
};
</script>

<style scoped></style>
