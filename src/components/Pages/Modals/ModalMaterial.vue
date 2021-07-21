<template>
  <div class="text-left">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="danger" dark v-bind="attrs" v-on="on" small text>
          <v-icon class="mr-2" small>mdi-plus-circle</v-icon>
          Registrar material
        </v-btn>
      </template>

      <v-card>
        <v-card-title> Registrar material </v-card-title>

        <v-card-text>
          <v-text-field
            label="Material"
            type="text"
            v-model="material.nombre"
          ></v-text-field>
          <v-text-field
            label="Direccion"
            type="text"
            v-model="material.direccion"
          ></v-text-field>
          <v-text-field
            label="Teléfono"
            type="text"
            v-model="material.telefono"
          ></v-text-field>
          <v-text-field
            label="Nombre del representante"
            type="text"
            v-model="material.representante"
          ></v-text-field>
          <v-text-field
            label="Teléfono del representante"
            type="text"
            v-model="material.telefonoRepresentante"
          ></v-text-field>

          <v-select
            :items="['MXN', 'USD']"
            label="Moneda"
            v-model="material.moneda"
          ></v-select>
          <v-select
            :items="['No', 'Si']"
            label="IVA"
            v-model="material.iva"
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
  name: "ModalMaterial",
  data: () => ({
    dialog: false,
    prevPass: "",
    newPass: "",
    material: {
      nombre: ""
    }
  }),
  methods: {
    send: async function() {
      if (this.material.nombre.trim() == "") {
        this.$toasted.error("Proporciona un nombre de material").goAway(2000);
        return;
      }
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarMaterial.php",
        {
          request: 1,
          material: this.material,
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
