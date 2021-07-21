<template>
  <div>
    <v-dialog
      v-model="open"
      persistent
      @click:outside="cerrar"
      max-width="1200px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Cotizacion</span>
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
                  v-model="cotizacionMateriales.idCentroCostos"
                  readonly
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
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field
                  label="Comentarios"
                  v-model="cotizacionMateriales.comentarioCotizacion"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="9">
                <v-simple-table fixed-header dense>
                  <thead>
                    <tr>
                      <th class="text-left">Material</th>
                      <th class="text-left">Proveedor</th>
                      <th class="text-left">Precio</th>
                      <th class="text-left">IVA</th>
                      <th class="text-left">Tipo de moneda</th>
                      <th class="text-left">Cantidad</th>
                      <th class="text-left">Descripcion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, ind) in materialesRequeridos" :key="ind">
                      <td>{{ item.nombreMaterial }}</td>
                      <td>
                        <v-autocomplete
                          :items="proveedores"
                          item-text="nombre"
                          item-value="id"
                          v-model="item.idProveedor"
                          readonly
                        ></v-autocomplete>
                      </td>
                      <td>
                        <v-text-field
                          type="number"
                          v-model="item.precio"
                          readonly
                        >
                        </v-text-field>
                      </td>
                      <td>
                        <v-autocomplete
                          :items="['0', '6', '10', '16']"
                          v-model="item.iva"
                        ></v-autocomplete>
                      </td>
                      <td>
                        <v-autocomplete
                          :items="['USD', 'MXN']"
                          v-model="item.moneda"
                          readonly
                        ></v-autocomplete>
                      </td>
                      <td>
                        <v-text-field
                          type="number"
                          v-model="item.cantidad"
                          readonly
                        >
                        </v-text-field>
                      </td>
                      <td>
                        <v-text-field v-model="item.descripcion">
                        </v-text-field>
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-col>

              <v-col
                cols="12"
                sm="12"
                md="12"
                class="d-flex justify-end align-end"
                ><v-btn
                  color="error"
                  outlined
                  v-if="isApprovable"
                  class="mr-1"
                  @click="reject()"
                  :disabled="isSending"
                >
                  Rechazar
                </v-btn>
                <v-btn
                  color="success"
                  outlined
                  @click="send(true)"
                  v-if="isApprovable"
                  :disabled="isSending"
                >
                  Aprobar
                </v-btn>
              </v-col>
            </v-row>
            <v-row
              ><v-col
                cols="12"
                sm="12"
                md="12"
                class="d-flex justify-end align-end"
              >
                <v-btn color="blue darken-1" text @click="cerrar">
                  Cancelar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="send(false)"
                  :disabled="isSending"
                >
                  Guardar
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
export default {
  name: "ModalCotizaciones",
  props: ["isOpen", "idCotizacion", "sendCallback"],
  // Orden de atributos: bool, number, string, object, array
  data: () => ({
    isSending: false,
    fileLoading: false,
    isApprovable: true,
    file: null,
    archivosGuardados: [],
    idRechazar: 0,
    cotizacionMateriales: { idCentroCostos: 0 },
    requisicionMateriales: {
      idCentroCostos: 0
    },
    materialesRequeridos: [],
    centrosCostos: [],
    proveedores: [],
    materiales: [],
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ],
    rejectCallback: () => {}
  }),
  watch: {
    idCotizacion() {
      if (this.isOpen) {
        this.cotizacionMateriales = {
          id: 0,
          idCentroCostos: 0,
          comentarioCotizacion: ""
        };
        this.materialesRequeridos = [];
        this.archivosGuardados = [];
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
    Approve() {
      return this.isApprovable;
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getDatosHoja();
      this.getCentrosCostos();
      this.getProveedores();
      this.getMateriales();
    },
    eliminarArchivoGuardado(nameArchivo) {
      this.archivosGuardados = this.archivosGuardados.filter(archivo => {
        if (archivo != nameArchivo) {
          return true;
        }
      });
    },
    async getDatosHoja() {
      let myUrl =
        process.env.VUE_APP_API + "newModules/cotizacionesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idCotizacion,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.cotizacionMateriales = respuesta.data.rows[0];
        console.log(this.idCentroCostos);
        this.getMaterialesRequeridos();
        this.getArchivosGuardados();
      }
    },
    /* el error de idCentroCostos undefined esta en esta funcion async */
    async getMaterialesRequeridos() {
      let myUrl =
        process.env.VUE_APP_API + "newModules/cotizacionesMateriales.php";
      let respuestaMateriales = await axios.post(myUrl, {
        request: 1,
        id: this.idCotizacion,
        tipo: "getMaterials",
        token: localStorage.token
      });
      if (respuestaMateriales.data.status == "Ok") {
        if (respuestaMateriales.data.rows.length > 0) {
          if (respuestaMateriales.data.rows[0].idCentroCostos) {
            this.cotizacionMateriales = {
              ...this.cotizacionMateriales,
              idCentroCostos: respuestaMateriales.data.rows[0].idCentroCostos
            };
          } else {
            this.cotizacionMateriales = {
              ...this.cotizacionMateriales,
              idCentroCostos: 0
            };
          }
          console.log(this.idCentroCostos);
          this.materialesRequeridos = respuestaMateriales.data.rows;
        } else {
          this.materialesRequeridos = [];
        }
      }
    },
    async getArchivosGuardados() {
      let myUrl =
        process.env.VUE_APP_API + "newModules/cotizacionesMateriales.php";
      let respuestaMateriales = await axios.post(myUrl, {
        request: 1,
        id: this.idCotizacion,
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

    async send(isOrder) {
      this.isSending = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl =
        process.env.VUE_APP_API + "newModules/cotizacionesMateriales.php";
      let myTipo = "insert";
      if (isOrder) myTipo = "insertOrder";
      if (this.idCotizacion != 0 && !isOrder) myTipo = "update";
      if (this.idCotizacion != 0 && isOrder) myTipo = "updateOrder";

      if (myTipo == "insert" || myTipo == "insertOrder") {
        this.cotizacionMateriales.idEmpleado = localStorage.id;
        this.cotizacionMateriales.idEmpleadoOrden = localStorage.id;
      }
      if (myTipo == "updateOrder")
        this.cotizacionMateriales.idEmpleadoOrden = localStorage.id;

      this.cotizacionMateriales.idEmpleado = localStorage.id;
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idCotizacion,
        tipo: myTipo,
        cotizacionMateriales: this.cotizacionMateriales,
        materialesRequeridos: this.materialesRequeridos,
        archivosGuardados: this.archivosGuardados,
        token: localStorage.token
      });

      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        if (myTipo == "insert")
          this.$toasted.success("Cotización enviada", {
            duration: 2000,
            position: "bottom-center"
          });
        if (myTipo == "update")
          this.$toasted.success("Cotización actualizada", {
            duration: 2000,
            position: "bottom-center"
          });
        if (isOrder)
          this.$toasted.success("Orden de compra enviada", {
            duration: 2000,
            position: "bottom-center"
          });
        this.isSending = false;
        this.sendCallback();
        this.cerrar();
      }
    },

    async reject() {
      this.isSending = true;
      let myUrl =
        process.env.VUE_APP_API + "newModules/cotizacionesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idCotizacion,
        value: "No aprobada",
        column: "status",
        tipo: "updateColumn",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.isSending = false;
        this.$toasted.success("Cotizacion rechazada").goAway(2000);
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
    },
    cerrar() {
      this.$emit("cerrar");
    }
  }
};
</script>

<style scoped></style>
