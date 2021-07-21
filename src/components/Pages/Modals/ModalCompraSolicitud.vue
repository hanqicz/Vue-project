<template>
  <div class="text-left">
    <v-dialog
      v-model="dialog"
      width="500"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="danger" dark v-bind="attrs" v-on="on" small text>
          <v-icon class="mr-2" small>mdi-plus-circle</v-icon>
          Registrar solicitud de compra
        </v-btn>
      </template>

      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-title> Registrar solicitud de compra </v-card-title>
        <v-card-text>
          <v-text-field
            label="Nombre de solicitud"
            type="text"
            v-model="compra.nombre"
          ></v-text-field>
          <v-select
            v-model="compra.idProveedor"
            :items="proveedores"
            label="Proveedor"
            item-value="id"
            item-text="nombre"
          >
          </v-select>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">No. parte</th>
                  <th class="text-left">Descripción</th>
                  <th class="text-left">Cantidad</th>
                  <th class="text-left">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(concepto, ind) in conceptos" :key="ind">
                  <td><input type="text" v-model="concepto.noParte" /></td>
                  <td><input type="text" v-model="concepto.descripcion" /></td>
                  <td><input type="number" v-model="concepto.cantidad" /></td>
                  <td>
                    <v-icon small @click="deleteItem(item)" color="error"
                      >mdi-delete-outline</v-icon
                    >
                  </td>
                </tr>
                <tr>
                  <td colspan="4">
                    <center>
                      <v-btn color="primary" text @click="agregarConcepto">
                        Agregar otro concepto
                      </v-btn>
                    </center>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="send"> Listo </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "ModalCompra",
  data: () => ({
    dialog: false,
    prevPass: "",
    newPass: "",
    compra: {
      nombre: "",
      idProveedor: ""
    },
    proveedores: [],
    conceptos: [
      {
        noParte: "",
        descripcion: "",
        cantidad: 1
      }
    ]
  }),
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getProveedores();
    },
    async agregarConcepto() {
      this.conceptos.push({
        noParte: "",
        descripcion: "",
        cantidad: 1
      });
    },
    deleteItem(item) {
      const index = this.conceptos.indexOf(item);
      confirm("¿Seguro que quieres borrar éste Item?") &&
        this.conceptos.splice(index, 1);
    },
    async send() {
      if (this.compra.nombre.trim() == "") {
        this.$toasted.error("Proporciona un nombre de solicitud").goAway(2000);
        return;
      }
      if (this.compra.idProveedor.trim() == "") {
        this.$toasted.error("Proporciona un proveedor").goAway(2000);
        return;
      }
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarSolicitudCompra.php",
        {
          request: 1,
          compra: this.compra,
          conceptos: this.conceptos,
          token: localStorage.token
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Compra agregada agregada").goAway(2000);
        this.dialog = false;
        this.$emit("insertCallback");
      } else if (respuesta.data.status == "Error") {
        this.$toasted.error(respuesta.data.msg).goAway(2000);
      }
      localStorage.token = respuesta.data.token;
    },
    async getProveedores() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerProveedores.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.proveedores = respuesta.data.rows;
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    }
  }
};
</script>
