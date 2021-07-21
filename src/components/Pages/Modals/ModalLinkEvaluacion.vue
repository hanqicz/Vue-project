<template>
  <div class="text-left">
    <v-dialog
      v-model="myDialog"
      width="500"
      persistent
      @click:outside="closeModal"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="danger"
          dark
          v-bind="attrs"
          v-on="on"
          small
          text
          v-if="false"
        >
          <v-icon class="mr-2" small>mdi-plus-circle</v-icon>
          Agregar evaluación
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          Agregar link de evaluación a {{ requisito.nombre }}</v-card-title
        >

        <v-card-text>
          <v-text-field
            label="Link"
            type="text"
            prepend-icon="mdi-link"
            v-model="link"
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
import { matchStrings } from "../../../tools/proStrings";
export default {
  name: "ModalLinkEvaluacion",
  props: ["dialog", "requisito"],
  data: () => ({
    file: null,
    link: "",
    prevPass: "",
    newPass: "",
    fileLoading: false,
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ]
  }),
  computed: {
    myDialog() {
      return this.dialog;
    }
  },
  methods: {
    closeModal: function() {
      this.$emit("closeModal");
    },
    send: async function() {
      if (this.link.trim() == "") {
        this.$toasted.error("Proporciona un link").goAway(2000);
        return;
      } else if (!matchStrings({ s: "https://", str: this.link })) {
        this.$toasted.error("El link debe llevar https://").goAway(2000);
        return;
      }
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarLinkEvaluacion.php",
        {
          request: 1,
          link: this.link,
          idRequisito: this.requisito.id,
          token: localStorage.token
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Link agregado").goAway(2000);
        this.$emit("closeModal");
        this.link = "";
        this.$emit("insertCallback");
      } else if (respuesta.data.status == "Error") {
        this.$toasted.error(respuesta.data.msg).goAway(2000);
      }
      localStorage.token = respuesta.data.token;
    },
    readFile: async function() {}
  }
};
</script>
