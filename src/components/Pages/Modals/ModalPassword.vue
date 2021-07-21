<template>
  <div class="text-left">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="danger" dark v-bind="attrs" v-on="on" text x-small>
          <v-icon class="mr-2" small>mdi-lock</v-icon>
          Cambiar contraseña
        </v-btn>
      </template>

      <v-card>
        <v-card-title> Cambiar contraseña </v-card-title>

        <v-card-text>
          <v-text-field
            label="Anterior contraseña"
            :append-icon="canSeePrevPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="canSeePrevPassword ? 'text' : 'password'"
            v-model="prevPass"
            @click:append="canSeePrevPassword = !canSeePrevPassword"
          ></v-text-field>
          <v-text-field
            label="Nueva contraseña"
            :append-icon="canSeePassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="canSeePassword ? 'text' : 'password'"
            v-model="newPass"
            @click:append="canSeePassword = !canSeePassword"
          ></v-text-field>
          <v-text-field
            label="Confirmar nueva contraseña"
            :append-icon="canSeeConfirm ? 'mdi-eye' : 'mdi-eye-off'"
            :type="canSeeConfirm ? 'text' : 'password'"
            v-model="confirmNewPass"
            @click:append="canSeeConfirm = !canSeeConfirm"
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
  name: "ModalPassword",
  data: () => ({
    dialog: false,
    prevPass: "",
    newPass: "",
    confirmNewPass: "",
    canSeePassword: false,
    canSeePrevPassword: false,
    canSeeConfirm: false
  }),
  methods: {
    send: async function() {
      if (this.newPass !== this.confirmNewPass) {
        this.$toasted.error("Las contraseñas no coinciden").goAway(2000);
        return;
      }
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "actualizarPassword.php",
        {
          request: 1,
          prevPass: this.prevPass,
          newPass: this.newPass,
          token: localStorage.token
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Contraseña actualizada").goAway(2000);
        this.dialog = false;
      } else if (respuesta.data.status == "Error") {
        this.$toasted.error(respuesta.data.msg).goAway(2000);
      }
      localStorage.token = respuesta.data.token;
    }
  }
};
</script>
