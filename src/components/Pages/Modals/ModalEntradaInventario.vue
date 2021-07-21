<template>
  <v-form v-model="valid">
    <div>
      <v-btn @click="abrir">Nueva Entrada Inventario</v-btn>

      <v-dialog
        v-model="open"
        persistent
        @click:outside="cerrar"
        max-width="750px"
      >
        <v-card>
          <v-card-title>
            <span class="headline" v-if="isEditing"
              >Editar Entrada Inventario</span
            >
            <span class="headline" v-else>Agregar Entrada Inventario</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <v-autocomplete
                    label="Tipo de material"
                    color="info"
                    :items="opcionesTipo"
                    item-text="nombre"
                    item-value="nombre"
                    v-model="entradaInventario.tipo"
                    :rules="requiredRule"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="6" v-if="!isEditing">
                  <v-text-field
                    label="Cantidad"
                    color="info"
                    type="number"
                    :rules="cantidadRule"
                    :min="1"
                    v-model="entradaInventario.cantidad"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-autocomplete
                    label="Material"
                    color="info"
                    :items="materialesFiltrados"
                    item-text="nombreMaterial"
                    item-value="idRegistroMaterial"
                    v-model="entradaInventario.idRegistroMaterial"
                    :rules="requiredRule"
                  >
                    <template v-slot:item="data">
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="data.item.nombreMaterial"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-html="data.item.descripcion"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  v-if="entradaInventario.tipo == 'MAKE'"
                >
                  <v-text-field
                    label="Job"
                    v-model="entradaInventario.job"
                    :rules="requiredRule"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  v-if="
                    entradaInventario.tipo == 'BUY' ||
                      entradaInventario.tipo == 'MP'
                  "
                >
                  <v-autocomplete
                    label="PO"
                    color="info"
                    :items="ordenesCompras"
                    item-text="comentarioOrden"
                    item-value="id"
                    v-model="entradaInventario.po"
                    :rules="requiredRule"
                  >
                    <template v-slot:item="data">
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="data.item.comentarioOrden"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-html="'Id Orden: ' + data.item.id"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  v-if="
                    entradaInventario.tipo == 'BUY' ||
                      entradaInventario.tipo == 'MP'
                  "
                >
                  <v-text-field
                    label="Lote"
                    color="info"
                    type="number"
                    v-model="entradaInventario.lote"
                    :min="1"
                    :rules="loteRule"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  v-if="
                    entradaInventario.tipo == 'BUY' ||
                      entradaInventario.tipo == 'MP'
                  "
                >
                  <v-text-field
                    label="Descuento"
                    color="info"
                    type="number"
                    v-model="entradaInventario.descuento"
                    :rules="descuentoRule"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  v-if="
                    entradaInventario.tipo == 'BUY' ||
                      entradaInventario.tipo == 'MP'
                  "
                >
                  <v-file-input
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
import { generateRandomId } from "../../../tools/randomStrGus";
//import getRandomColor from "../../../tools/randomColor";
export default {
  props: [
    "isOpen",
    "isEditing",
    "idEditing",
    "sendCallback",
    "sendCallbackArchivos"
  ],
  data: () => ({
    isSending: false,
    fileLoading: false,
    valid: false,
    file: null,
    archivosGuardados: [],
    descuentos: [],
    materiales: [],
    opcionesTipo: [
      {
        id: "1",
        nombre: "BUY"
      },
      {
        id: "2",
        nombre: "MAKE"
      },
      {
        id: "3",
        nombre: "MP"
      }
    ],
    opcionesMetalico: [
      {
        idMetalico: "0",
        nombre: "No"
      },
      {
        idMetalico: "1",
        nombre: "Si"
      }
    ],
    entradaInventario: {
      cantidad: 1,
      idRegistroMaterial: 0,
      po: "",
      lote: 1,
      descuento: 0,
      job: "",
      metalico: 0
    },
    ordenesCompras: [],
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ],
    cantidadRule: [
      value => value > 0 || "La cantidad debe ser un entero positivo"
    ],
    descuentoRule: [
      value => (value >= 0 && value <= 100) || "descuento invalido"
    ],
    requiredRule: [value => !!value || "Campo requerido"],
    loteRule: [value => value > 0 || "El lote debe ser un entero positivo"]
  }),
  computed: {
    open() {
      return this.isOpen;
    },
    edit() {
      return this.isEditing;
    },
    idEdit() {
      return this.idEditing;
    },
    token() {
      return localStorage.token ? localStorage.token : "";
    },
    materialesFiltrados() {
      return this.materiales.filter(
        material => material.tipo == this.entradaInventario.tipo
      );
    }
  },

  watch: {
    idEditing() {
      if (this.isEditing) {
        this.entradaInventario = {
          cantidad: 1,
          idRegistroMaterial: 0,
          po: "",
          lote: 1,
          descuento: 0,
          job: "",
          metalico: 0
        };
        this.archivosGuardados = [];
        this.getOrdenesCompras();
        this.getElementoInventario();
        this.getArchivosGuardados();
      }
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.isSending = false;
      this.getOrdenesCompras();
      this.getMateriales();
    },
    abrir() {
      this.isSending = false;
      this.$emit("abrir");
      this.getOrdenesCompras();
      this.getMateriales();
    },
    cerrar() {
      this.$emit("cerrar");
      this.ordenesCompras = [];
      this.archivosGuardados = [];
      this.entradaInventario = {
        cantidad: 1,
        idRegistroMaterial: 0,
        po: "",
        lote: 1,
        descuento: 0,
        job: "",
        metalico: 0
      };
    },
    validate() {
      this.$refs.cantidad.validate();
    },
    async getOrdenesCompras() {
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAllApproved",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.ordenesCompras = respuesta.data.rows;
      }
    },
    async getMateriales() {
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.materiales = respuesta.data.rows;
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
        console.log(respuesta.data.rows);
        console.log(this.idEditing);
      } else {
        this.archivosGuardados = [];
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
        this.entradaInventario = respuesta.data.rows[0];
        this.tipo = this.entradaInventario.tipo;
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
    eliminarArchivoGuardado(nameArchivo) {
      this.archivosGuardados = this.archivosGuardados.filter(archivo => {
        if (archivo != nameArchivo) {
          return true;
        }
      });
    },
    async send() {
      if (this.valid == false) {
        this.$toasted.error("Revisar campos incorrectos", {
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
      let myTipo = "insert";
      if (this.idEditing != 0) {
        this.entradaInventario.idRandom = this.idEditing;
        myTipo = "update";
      }
      if (myTipo == "insert") {
        this.entradaInventario.idRandom = generateRandomId();
      }
      let respuesta = await axios.post(myUrl, {
        request: 1,
        idCulpable: localStorage.id,
        entrada: this.entradaInventario,
        tipo: myTipo,
        archivosGuardados: this.archivosGuardados,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        if (myTipo == "insert")
          this.$toasted.success("Elemento enviado", {
            duration: 2000,
            position: "bottom-center"
          });
        if (myTipo == "update")
          this.$toasted.success("Elemento actualizado", {
            duration: 2000,
            position: "bottom-center"
          });
        console.log(myTipo);
        console.table(this.entradaInventario);
        this.isSending = false;
        this.sendCallback({ tipoMateriales: this.entradaInventario.tipo });
        this.sendCallbackArchivos();
        this.cerrar();
      }
    }
  }
};
</script>
