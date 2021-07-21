<template>
  <div>
    <v-dialog
      v-model="open"
      persistent
      @click:outside="cerrar"
      max-width="900px"
    >
      <v-card :loading="isLoading">
        <v-card-title> <span></span> </v-card-title>
        <v-card-text>
          <v-container>
            <v-row
              ><v-col cols="12" sm="6" md="6">
                <h2 center>Subir Archivos</h2>
              </v-col></v-row
            >
            <br />
            <v-row
              ><v-file-input
                accept="image/*, .csv, .xlsx, .mp4"
                label="Subir Archivo"
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
              ></v-file-input
            ></v-row>
            <v-row>
              <div v-if="archivosGuardados">
                <div v-for="(archivo, indx) in archivosGuardados" :key="indx">
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
            </v-row>

            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
                class="d-flex justify-end align-end"
                ><v-btn
                  color="blue darken-1"
                  text
                  @click="updateArchivos()"
                  :disabled="isSending"
                >
                  Enviar
                </v-btn>
                <v-btn color="blue darken-1" text @click="cerrar"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ModalOrdenesCompra",
  props: ["isOpen", "idOrden", "sendCallback"],
  // Orden de atributos: bool, number, string, object, array
  data: () => ({
    isSending: false,
    fileLoading: false,
    isLoading: false,
    file: null,
    archivosGuardados: [],
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ]
  }),
  computed: {
    open() {
      return this.isOpen;
    },
    token() {
      return localStorage.token ? localStorage.token : "";
    }
  },
  watch: {
    idOrden() {
      if (this.isOpen) {
        this.archivosGuardados = [];
        this.getArchivosGuardados();
      }
    }
  },
  methods: {
    initialize() {
      this.getArchivos();
    },
    cerrar() {
      this.$emit("cerrar");
    },

    eliminarArchivoGuardado(nameArchivo) {
      this.archivosGuardados = this.archivosGuardados.filter(archivo => {
        if (archivo != nameArchivo) {
          return true;
        }
      });
    },

    /*     async send() {
      this.isSending = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      console.log(this.idOrden);
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idOrden,
        tipo: "update",
        cotizacionMateriales: this.cotizacionMateriales,
        materialesRequeridos: this.materialesRequeridos,
        archivosGuardados: this.archivosGuardados,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Orden actualizada", {
          duration: 2000,
          position: "bottom-center"
        });

        this.isSending = false;
        this.sendCallback();
        this.cerrar();
      }
    }, */
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
        console.log("success");
        this.cerrar();
        this.sendCallback();
      }
    },

    async getArchivosGuardados() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuestaMateriales = await axios.post(myUrl, {
        request: 1,
        id: this.idOrden,
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
    }
  }
};
</script>

<style scoped></style>
