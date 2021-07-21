<template>
  <v-form v-model="valid">
    <div>
      <v-dialog
        v-model="open"
        persistent
        @click:outside="cerrar"
        max-width="750px"
      >
        <v-card v-if="inventario">
          <v-card-title>
            <span class="headline">Verificar Medidas</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="5" sm="5" md="5">
                  <v-text-field
                    label="Colada"
                    color="info"
                    v-model="inventario.colada"
                    v-if="inventario.tipo == 'MP'"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" sm="4" md="4">
                  <v-file-input
                    accept="image/*, .csv, .xlsx, .mp4"
                    label="MTR"
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
                </v-col>
                <v-col cols="3" sm="3" v-if="inventario.tipo == 'MP'">
                  <v-text-field
                    label="OD"
                    type="number"
                    v-model="inventario.outerD"
                    v-if="isTubo || isBarra"
                    :min="0"
                    :rules="enteroRule"
                    suffix="m"
                  >
                  </v-text-field>
                  <v-text-field
                    label="ID"
                    type="number"
                    v-model="inventario.innerD"
                    v-if="isTubo"
                    :min="0"
                    :rules="enteroRule"
                    suffix="m"
                  >
                  </v-text-field>
                  <v-text-field
                    label="LG"
                    type="number"
                    v-model="inventario.longitud"
                    :min="0"
                    :rules="enteroRule"
                    suffix="m"
                  >
                  </v-text-field>
                  <v-text-field
                    label="HG"
                    type="number"
                    v-model="inventario.height"
                    v-if="isPlaca"
                    :min="0"
                    :rules="enteroRule"
                    suffix="m"
                  >
                  </v-text-field>
                  <v-text-field
                    label="WD"
                    type="number"
                    v-model="inventario.width"
                    v-if="isPlaca"
                    :min="0"
                    :rules="enteroRule"
                    suffix="m"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="12" md="9"></v-col>
                <v-col cols="12" sm="12" md="9"></v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="3"
                  class="d-flex justify-end align-end"
                >
                  <v-btn color="blue darken-1" text @click="cerrar">
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :disabled="isSending"
                    text
                    @click="send()"
                  >
                    Enviar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-form>
</template>

<script>
import axios from "axios";
export default {
  props: ["isOpen", "idEditing", "sendCallback"],
  data: () => ({
    isSending: false,
    fileLoading: false,
    isBarra: false,
    isTubo: false,
    isPlaca: false,
    valid: false,
    file: null,
    forma: "",
    archivosGuardados: [],
    inventario: {},
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ],
    enteroRule: [value => value >= 0 || "El valor no puede ser negativo"]
  }),
  computed: {
    open() {
      return this.isOpen;
    },
    token() {
      return localStorage.token;
    }
  },
  watch: {
    forma(forma) {
      if (forma == "tubo") {
        this.isTubo = true;
        this.isBarra = false;
        this.isPlaca = false;
      }
      if (forma == "placa") {
        this.isTubo = false;
        this.isBarra = false;
        this.isPlaca = true;
      }
      if (forma == "barra") {
        this.isTubo = false;
        this.isBarra = true;
        this.isPlaca = false;
      }
    },
    idEditing() {
      if (this.idEditing != 0) {
        this.getArchivosGuardados();
        this.getElementoInventario();
      }
    }
  },

  methods: {
    abrir() {
      this.isSending = false;
      this.$emit("abrir");
    },
    cerrar() {
      this.$emit("cerrar");
      this.inventario = { colada: "" };
      this.archivosGuardados = [];
      this.forma = "";
    },
    eliminarArchivoGuardado(nameArchivo) {
      this.archivosGuardados = this.archivosGuardados.filter(archivo => {
        if (archivo != nameArchivo) {
          return true;
        }
      });
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
    async getElementoInventario() {
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.inventario = respuesta.data.rows[0];
        this.forma = this.inventario.forma;
      }
    },
    async getArchivosGuardados() {
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: "getArchivos",
        token: localStorage.token
      });
      if (respuesta.data.status == "Ok") {
        this.archivosGuardados = respuesta.data.rows.map(
          archivo => archivo.nombreArchivo
        );
      } else {
        this.archivosGuardados = [];
      }
    },
    async send() {
      if (this.valid == false) {
        this.$toasted.error("Las medidas no pueden tener valor negativo", {
          duration: 2000,
          position: "bottom-center"
        });
        return;
      }
      this.isSending = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        entrada: this.inventario,
        tipo: "update",
        archivosGuardados: this.archivosGuardados,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Elemento actualizado", {
          duration: 2000,
          position: "bottom-center"
        });
        console.log(this.inventario);
        this.isSending = false;
        this.sendCallback();
        this.cerrar();
      }
    }
  }
};
</script>

<style scoped></style>
