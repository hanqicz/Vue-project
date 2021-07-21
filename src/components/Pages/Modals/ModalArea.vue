<template>
  <div class="text-left">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="danger" dark v-bind="attrs" v-on="on" small text>
          <v-icon class="mr-2" small>mdi-plus-circle</v-icon>
          Registrar área
        </v-btn>
      </template>

      <v-card>
        <v-card-title> Registrar área </v-card-title>

        <v-card-text>
          <v-text-field
            label="Área"
            type="text"
            v-model="area.nombre"
          ></v-text-field>
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
  name: "ModalArea",
  data: () => ({
    dialog: false,
    prevPass: "",
    newPass: "",
    area: {
      nombre: ""
    }
  }),
  methods: {
    send: async function() {
      if (this.area.nombre.trim() == "") {
        this.$toasted.error("Proporciona un nombre de área").goAway(2000);
        return;
      }
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarArea.php",
        {
          request: 1,
          area: this.area,
          token: localStorage.token
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Área agregada").goAway(2000);
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
