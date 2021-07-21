<template>
  <v-form v-model="valid">
    <div>
      <v-btn @click="abrir">Nueva Hoja de Requisición</v-btn>

      <v-dialog
        v-model="open"
        persistent
        @click:outside="cerrar"
        max-width="1200px"
      >
        <v-card :loading="isLoading">
          <v-card-title>
            <span class="headline" v-if="isEditing"
              >Editar Hoja de Requisición</span
            >
            <span class="headline" v-else>Agregar Hoja de Requisición</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="3">
                  <v-text-field
                    label="Buscador de materiales"
                    prepend-inner-icon="mdi-magnify"
                    v-model="search"
                    dense
                  ></v-text-field>

                  <v-card max-width="400" class="mx-auto">
                    <v-virtual-scroll
                      :items="materialesFiltrados"
                      height="180"
                      item-height="50"
                    >
                      <template v-slot:default="{ item }">
                        <v-list-item
                          :key="item.id"
                          :draggable="true"
                          @dragstart="
                            ev => {
                              drag(ev, item.idRegistroMaterial);
                            }
                          "
                          @dblclick="agregarMaterial(item)"
                        >
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item.nombreMaterial }}
                              <v-icon small>
                                mdi-arrow-right-thick
                              </v-icon>
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                        <v-divider></v-divider>
                      </template>
                    </v-virtual-scroll> </v-card
                  ><br />
                  <v-divider></v-divider>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="9"
                  @drop="drop"
                  @dragover="allowDrop"
                >
                  <v-simple-table fixed-header height="250px" dense>
                    <thead>
                      <tr>
                        <th class="text-left">Material</th>
                        <th class="text-left">Proveedor</th>
                        <th class="text-left">Precio</th>
                        <th class="text-left">IVA</th>
                        <th class="text-left">Tipo de moneda</th>
                        <th class="text-left">Cantidad</th>
                        <th class="text-left">Total</th>
                        <th class="text-left">Descripcion</th>
                        <th class="text-left">Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, ind) in materialesRequeridos"
                        :key="ind"
                      >
                        <td>{{ item.nombreMaterial }}</td>
                        <td>
                          <v-autocomplete
                            :items="proveedores"
                            item-text="nombre"
                            item-value="id"
                            v-model="item.idProveedor"
                          ></v-autocomplete>
                        </td>
                        <td>
                          <v-text-field
                            type="number"
                            v-model="item.precio"
                            :min="0"
                            :rules="priceRules"
                          >
                          </v-text-field>
                        </td>
                        <td>
                          <v-autocomplete
                            :items="['0', '16']"
                            v-model="item.iva"
                          ></v-autocomplete>
                        </td>
                        <td>
                          <v-autocomplete
                            :items="['USD', 'MXN']"
                            v-model="item.moneda"
                          ></v-autocomplete>
                        </td>
                        <td>
                          <v-text-field
                            type="number"
                            v-model="item.cantidad"
                            :rules="numericRules"
                            :min="1"
                          >
                          </v-text-field>
                        </td>
                        <td>
                          {{ item.cantidad * item.precio }}
                        </td>
                        <td>
                          <v-text-field v-model="item.descripcion">
                          </v-text-field>
                        </td>
                        <td>
                          <v-btn
                            icon
                            @click="eliminarMaterial(item)"
                            color="error"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                  <v-divider></v-divider>
                  <v-card-text
                    >Sub-total: {{ calSubtotal }} IVA: {{ calIVA }} Total:
                    {{
                      Math.round((calSubtotal + calIVA) * 100) / 100
                    }}</v-card-text
                  >
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-autocomplete
                    label="Centro de Costos"
                    :items="centrosCostos"
                    item-text="nombre"
                    item-value="id"
                    v-model="requisicionMateriales.idCentroCostos"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="6">
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
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    label="Comentarios"
                    v-model="requisicionMateriales.comentarioRequisicion"
                  ></v-text-field>
                </v-col>

                <v-col cols="6"
                  ><h2>Tipo de pago</h2>
                  <v-select
                    dense
                    v-model="requisicionMateriales.tipoPago"
                    :items="tipoPagos"
                  ></v-select
                ></v-col>

                <v-col
                  cols="6"
                  sm="6"
                  md="6"
                  class="d-flex justify-end align-end"
                >
                  <v-btn color="blue darken-1" text @click="cerrar">
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :disabled="isSending"
                    text
                    @click="send(false)"
                  >
                    Enviar
                  </v-btn>
                  <v-btn
                    color="success"
                    outlined
                    :disabled="isSending"
                    v-if="estadoCotizar"
                    @click="send(true)"
                  >
                    Cotizado
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
import { matchStrings } from "../../../tools/proStrings";

export default {
  name: "ModalRequisicionMateriales",
  props: ["isOpen", "isEditing", "idEditing", "sendCallback"],
  // Orden de atributos: bool, number, string, object, array
  data: () => ({
    isSending: false,
    fileLoading: false,
    valid: false,
    isLoading: false,
    search: "",
    file: null,
    requisicionMateriales: {
      idCentroCostos: 0,
      diasCredito: 0,
      tipoPago: "de contado"
    },
    diasCredito: 0,
    tipoPagos: ["de contado", "credito"],
    hojasRequisiciones: [],
    centrosCostos: [],
    materiales: [],
    materialesRequeridos: [],
    proveedores: [],
    archivosGuardados: [],
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ],
    numericRules: [value => !value || value >= 1 || "Min. 1"],
    priceRules: [value => !value || value >= 0 || "Min. 0"]
  }),
  watch: {
    idEditing() {
      if (this.isEditing) {
        this.materialesRequeridos = [];
        this.getDatosHoja();
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
        return this.materiales.filter(material => material.idCentroCostos != 0);
      let myMaterials = this.materiales.filter(material =>
        matchStrings({
          s: this.search,
          str: material.nombreMaterial
        })
      );
      return myMaterials.filter(material => material.idCentroCostos != 0);
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
    },
    calSubtotal() {
      let subtotal = 0;
      const cantidades = this.materialesRequeridos.map(
        item => parseInt(item.precio) * parseInt(item.cantidad)
      );
      cantidades.forEach(value => (subtotal += value));
      return Math.round(subtotal * 100) / 100;
    },
    calIVA() {
      let iva = 0;
      const cantidadesIVA = this.materialesRequeridos.map(item =>
        parseInt(item.iva)
      );
      const cantidades = this.materialesRequeridos.map(
        item => parseInt(item.precio) * parseInt(item.cantidad)
      );
      cantidadesIVA.forEach(
        (value, i) => (iva += (value / 100) * cantidades[i])
      );
      return Math.round(iva * 100) / 100;
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
      this.requisicionMateriales = {
        id: 0,
        idCentroCostos: 0,
        comentarioRequisicion: "",
        diasCredito: 0
      };
      this.materialesRequeridos = [];
      this.$emit("abrir");
    },
    cerrar() {
      this.$emit("cerrar");
      this.archivosGuardados = [];
      this.tipoPago = "de contado";
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
      let myItem = this.materialesFiltrados.filter(
        item => item.idRegistroMaterial == myId
      )[0];
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
        iva: "16",
        moneda: "MXN",
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
    async getDatosHoja() {
      this.isLoading = true;
      let myUrl =
        process.env.VUE_APP_API + "newModules/requisicionesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.requisicionMateriales = respuesta.data.rows[0];
        this.getMaterialesRequeridos();
        this.getArchivosGuardados();
        this.isLoading = false;
      }
    },
    async getMaterialesRequeridos() {
      let myUrl =
        process.env.VUE_APP_API + "newModules/requisicionesMateriales.php";
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
            this.requisicionMateriales = {
              ...this.requisicionMateriales,
              idCentroCostos: respuestaMateriales.data.rows[0].idCentroCostos
            };
          } else {
            this.requisicionMateriales = {
              ...this.requisicionMateriales,
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
      let myUrl =
        process.env.VUE_APP_API + "newModules/requisicionesMateriales.php";
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
        console.log(this.archivosGuardados);
      } else {
        this.archivosGuardados = [];
      }
    },
    async send(isQuote) {
      if (this.materialesRequeridos.length == 0) {
        this.$toasted.error("Sin materiales", {
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
      let myUrl =
        process.env.VUE_APP_API + "newModules/requisicionesMateriales.php";
      let myTipo = "insert";
      if (isQuote) myTipo = "insertQuote";
      if (this.idEditing != 0 && !isQuote) myTipo = "update";
      if (this.idEditing != 0 && isQuote) myTipo = "updateQuote";
      if (myTipo == "insert" || myTipo == "insertQuote") {
        this.requisicionMateriales.idEmpleado = localStorage.id;
        this.requisicionMateriales.idEmpleadoCotizacion = localStorage.id;
      }
      if (myTipo == "updateQuote")
        this.requisicionMateriales.idEmpleadoCotizacion = localStorage.id;

      this.materialesRequeridos = this.materialesRequeridos.map(material => {
        if (!material.idProveedor) material.idProveedor = 0;
        return material;
      });
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: myTipo,
        requisicionMateriales: this.requisicionMateriales,
        materialesRequeridos: this.materialesRequeridos,
        archivosGuardados: this.archivosGuardados,
        tipoPago: this.tipoPago,
        diasCredito: this.diasCredito,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        if (myTipo == "insert")
          this.$toasted.success("Requisición enviada", {
            duration: 2000,
            position: "bottom-center"
          });
        if (myTipo == "update")
          this.$toasted.success("Requisición actualizada", {
            duration: 2000,
            position: "bottom-center"
          });
        if (isQuote)
          this.$toasted.success("Cotización enviada", {
            duration: 2000,
            position: "bottom-center"
          });

        this.isSending = false;
        this.sendCallback();
        this.cerrar();
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
