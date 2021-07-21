<template>
  <div>
    <v-btn @click="abrir">Agregar nuevo material </v-btn>

    <v-dialog
      v-model="open"
      persistent
      @click:outside="cerrar"
      max-width="900px"
    >
      <v-card>
        <v-card-title>
          <span class="headline" v-if="isEditing">Editar Hoja de Material</span>
          <span class="headline" v-else>Agregar nuevo material</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete
                  label="Centro de Costos"
                  :items="centrosCostos"
                  item-text="nombre"
                  item-value="id"
                  v-model="material.idCentroCostos"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-select
                  :items="['BUY', 'MAKE', 'MP']"
                  label="Tipo"
                  v-model="material.tipo"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-text-field
                  label="No. Parte"
                  v-model="material.noParte"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Nombre"
                  v-model="material.nombre"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :items="['barra', 'placa', 'tubo']"
                  label="Forma"
                  v-model="material.forma"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field
                  label="Descripción"
                  v-model="material.descripcion"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="9"></v-col>
              <v-col
                cols="12"
                sm="12"
                md="3"
                class="d-flex justify-end align-end"
              >
                <v-btn
                  color="blue darken-1"
                  :disabled="isSending"
                  text
                  @click="send(false)"
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
</template>
<script>
import axios from "axios";
import { matchStrings } from "../../../tools/proStrings";

export default {
  name: "ModalMaterial",
  props: ["isOpen", "isEditing", "idEditing", "sendCallback"],
  // Orden de atributos: bool, number, string, object, array
  data: () => ({
    isSending: false,
    fileLoading: false,
    search: "",
    file: null,
    material: {
      idCentroCostos: 0
    },
    hojasRequisiciones: [],
    centrosCostos: [],
    materiales: [],
    materialesRequeridos: [],
    proveedores: [],
    archivosGuardados: [],
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ]
  }),
  watch: {
    idEditing() {
      if (this.isEditing) {
        this.materialesRequeridos = [];
        this.archivosGuardados = [];
        this.getDatosMaterial();
      }
    }
  },
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
      return localStorage.token;
    },
    materialesFiltrados() {
      if (this.search == "")
        return this.materiales.filter(
          material => this.material.idCentroCostos == material.idCentroCostos
        );
      let myMaterials = this.materiales.filter(material =>
        matchStrings({
          s: this.search,
          str: material.nombreMaterial
        })
      );
      return myMaterials.filter(
        material => this.material.idCentroCostos == material.idCentroCostos
      );
    },
    estadoCotizar() {
      let size = this.materialesRequeridos.length;
      if (size != 0) {
        let result = this.materialesRequeridos.filter(material => {
          return material.idProveedor > 0 && material.precio > 0 ? true : false;
        });
        return result.length == size ? true : false;
      } else {
        return false;
      }
    }
  },
  methods: {
    // Orden de atributos: initialize, sincronos, async
    initialize() {
      this.isSending = false;
      this.getCentrosCostos();
      this.getMateriales();
      this.getProveedores();
    },
    abrir() {
      this.isSending = false;
      this.material = {
        id: 0,
        idCentroCostos: 0,
        comentarioRequisicion: ""
      };
      this.materialesRequeridos = [];
      this.$emit("abrir");
    },
    cerrar() {
      this.$emit("cerrar");
    },
    enviar() {
      this.$emit("cerrar");
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    drag(ev, id) {
      ev.dataTransfer.setData("itemid", id);
    },
    drop(ev) {
      ev.preventDefault();
      let myId = ev.dataTransfer.getData("itemid");
      let myItem = this.materialesFiltrados.filter(item => item.id == myId)[0];
      /*let yaExiste = this.items.filter(item => item.id == myId).length > 0;
      if (yaExiste) {
        myItem.active = true;
      }*/
      this.agregarMaterial(myItem);
    },
    agregarMaterial(item) {
      let repetidos = this.materialesRequeridos.filter(material => {
        if (material.idRegistroMaterial == item.idRegistroMaterial) {
          material.cantidad = parseInt(material.cantidad) + 1;
          return true;
        }
      });
      if (repetidos.length > 0) return true;
      this.materialesRequeridos.push({
        idRegistroMaterial: item.idRegistroMaterial,
        nombreMaterial: item.nombreMaterial,
        proveedor: "",
        precio: 0,
        iva: "0",
        moneda: "USD",
        cantidad: 1,
        ...item
      });
    },
    eliminarMaterial(item) {
      this.materialesRequeridos = this.materialesRequeridos.filter(material => {
        if (material.idRegistroMaterial != item.idRegistroMaterial) {
          return true;
        }
      });
    },
    eliminarArchivoGuardado(nameArchivo) {
      this.archivosGuardados = this.archivosGuardados.filter(archivo => {
        if (archivo != nameArchivo) {
          return true;
        }
      });
    },
    async getCentrosCostos() {
      let myUrl = process.env.VUE_APP_API + "newModules/centrosCostos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.centrosCostos = respuesta.data.rows;
      }
    },
    async getProveedores() {
      let myUrl = process.env.VUE_APP_API + "newModules/proveedores.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.proveedores = respuesta.data.rows;
      }
    },
    async getDatosMaterial() {
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getOne",
        id: this.idEditing,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.material = respuesta.data.rows[0];
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
    async getMaterialesRequeridos() {
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
      let respuestaMateriales = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: "getMaterials",
        token: localStorage.token
      });
      if (respuestaMateriales.data.status == "Ok") {
        if (respuestaMateriales.data.rows.length > 0) {
          // Esto ocasiona el error
          if (respuestaMateriales.data.rows[0].idCentroCostos) {
            this.material = {
              ...this.material,
              idCentroCostos: respuestaMateriales.data.rows[0].idCentroCostos
            };
          } else {
            this.material = {
              ...this.material,
              idCentroCostos: 0
            };
          }
          // Esto ocasiona el error
          this.materialesRequeridos = respuestaMateriales.data.rows;
        } else {
          this.materialesRequeridos = [];
        }
      }
    },
    async getArchivosGuardados() {
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
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
      } else {
        this.archivosGuardados = [];
      }
    },
    async send() {
      this.isSending = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
      let myTipo = "insert";
      if (this.idEditing != 0) myTipo = "update";
      this.materialesRequeridos = this.materialesRequeridos.map(material => {
        if (!material.idProveedor) material.idProveedor = 0;
        return material;
      });
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: myTipo,
        items: [this.material],
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        if (myTipo == "insert")
          this.$toasted.success("Material enviado", {
            duration: 2000,
            position: "bottom-center"
          });
        if (myTipo == "update")
          this.$toasted.success("Material actualizado", {
            duration: 2000,
            position: "bottom-center"
          });
        this.isSending = false;
        this.sendCallback();
        this.cerrar();
      } else {
        this.$toasted.error("Verifique la información de los campos", {
          duration: 3000,
          position: "bottom-center"
        });
        this.isSending = false;
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
  },
  created() {
    this.initialize();
  }
};
</script>
