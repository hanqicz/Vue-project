<template>
  <div class="text-left">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="danger" dark v-bind="attrs" v-on="on" small text>
          <v-icon class="mr-2" small>mdi-plus-circle</v-icon>
          Registrar ensamble
        </v-btn>
      </template>

      <v-card>
        <v-card-title> Registrar ensamble </v-card-title>

        <v-card-text>
          <v-text-field
            label="No. Parte"
            type="text"
            v-model="ensamble.noParte"
          ></v-text-field>
          <v-text-field
            label="Descripción"
            type="text"
            v-model="ensamble.descripcion"
          ></v-text-field>
          <v-text-field
            label="#Tags"
            type="text"
            v-model="ensamble.etiquetas"
          ></v-text-field>
          <v-text-field
            label="Comentarios"
            type="text"
            v-model="ensamble.comentarios"
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
  name: "ModalEnsamble",
  data: () => ({
    dialog: false,
    prevPass: "",
    newPass: "",
    ensamble: {
      noParte: ""
    }
  }),
  methods: {
    send: async function() {
      if (this.ensamble.noParte.trim() == "") {
        this.$toasted
          .error("Proporciona un numero de parte de ensamble")
          .goAway(2000);
        return;
      }
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarEnsamble.php",
        {
          request: 1,
          ensamble: this.ensamble,
          token: localStorage.token
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Ensamble agregado").goAway(2000);
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
