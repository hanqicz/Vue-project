<template>
  <div class="text-left">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="danger" dark v-bind="attrs" v-on="on" small text>
          <v-icon class="mr-2" small>mdi-plus-circle</v-icon>
          Registrar proveedor
        </v-btn>
      </template>

      <v-card>
        <v-card-title> Registrar proveedor </v-card-title>

        <v-card-text>
          <v-text-field
            label="Proveedor"
            type="text"
            v-model="proveedor.nombre"
          ></v-text-field>
          <v-text-field
            label="Direccion"
            type="text"
            v-model="proveedor.direccion"
          ></v-text-field>
          <v-text-field
            label="Teléfono"
            type="text"
            v-model="proveedor.telefono"
          ></v-text-field>
          <v-text-field
            label="Nombre del representante"
            type="text"
            v-model="proveedor.representante"
          ></v-text-field>
          <v-text-field
            label="Teléfono del representante"
            type="text"
            v-model="proveedor.telefonoRepresentante"
          ></v-text-field>

          <v-select
            :items="['MXN', 'USD']"
            label="Moneda"
            v-model="proveedor.moneda"
          ></v-select>
          <v-select
            :items="['No', 'Si']"
            label="IVA"
            v-model="proveedor.iva"
          ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="send"> Listo </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "ModalProveedor",
  data: () => ({
    dialog: false,
    prevPass: "",
    newPass: "",
    proveedor: {
      nombre: ""
    }
  }),
  methods: {
    send: async function() {
      if (this.proveedor.nombre.trim() == "") {
        this.$toasted.error("Proporciona un nombre de proveedor").goAway(2000);
        return;
      }
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarProveedor.php",
        {
          request: 1,
          proveedor: this.proveedor,
          token: localStorage.token
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success(respuesta.data.msg).goAway(2000);
        this.dialog = false;
        this.$emit("insertCallback");
      } else if (respuesta.data.status == "Error") {
        this.$toasted.error(respuesta.data.msg).goAway(2000);
      }
      localStorage.token = respuesta.data.token;
    }
  }
};
</script>
