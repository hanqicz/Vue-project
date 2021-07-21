<style scoped>
.centrado {
  text-align: center;
}
.overflowY {
  overflow-y: auto;
}
.izquierdado {
  text-align: left;
}
</style>
<template>
  <v-card>
    <v-card-title>
      <h1>Compra: {{ compra.nombre }}</h1></v-card-title
    >
    <v-card-text>
      <v-text-field
        readonly
        label="Nombre de solicitud"
        type="text"
        v-model="compra.nombre"
      ></v-text-field>
      <v-text-field
        readonly
        label="Proveedor"
        type="text"
        v-model="compra.proveedor"
      ></v-text-field>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">No. parte</th>
              <th class="text-left">Descripción</th>
              <th class="text-left">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(concepto, ind) in conceptos" :key="ind">
              <td><input type="text" v-model="concepto.noParte" /></td>
              <td><input type="text" v-model="concepto.descripcion" /></td>
              <td><input type="number" v-model="concepto.cantidad" /></td>
            </tr>
            <tr>
              <td colspan="3">
                <center>
                  <v-btn
                    color="primary"
                    text
                    @click="agregarConcepto"
                    v-if="false"
                  >
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
      <v-btn color="primary" @click="send" v-if="false"> Listo </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
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
      this.getCompra();
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
    },
    async getCompra() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerCompraConceptos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        token: localStorage.token,
        idCompra: this.$route.params.id
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.compra = respuesta.data.rows[0];
        this.conceptos = respuesta.data.conceptos;
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    }
  }
};
</script>
