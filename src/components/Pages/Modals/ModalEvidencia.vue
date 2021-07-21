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
          Agregar evidencia
        </v-btn>
      </template>

      <v-card>
        <v-card-title> Agregar evidencia a {{ requisito.nombre }}</v-card-title>

        <v-card-text>
          <v-file-input
            label="Sube una evidencia para éste requisito"
            small-chips
            dense
            :disabled="fileLoading"
            show-size
            color="info"
            truncate-length="12"
            :full-width="false"
            :rules="rules"
            v-model="file"
          ></v-file-input>
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
  name: "ModalEvidencia",
  props: ["dialog", "requisito"],
  data: () => ({
    file: null,
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
    async send() {
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("request", 1);
      formData.append("token", localStorage.token);
      formData.append("idRelacion", this.requisito.idRelacion);

      let respuesta = await axios.post(
        process.env.VUE_APP_API + "uploadEvidencia.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Evidencia agregada").goAway(2000);
        this.$emit("closeModal");
        this.file = null;
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
