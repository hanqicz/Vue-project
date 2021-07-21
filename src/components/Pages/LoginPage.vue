<style scoped>
.user-title {
  color: #fff;
  font-size: 48px;
  text-shadow: 0px 1px 2px #9e9e9e;
}
@media only screen and (max-width: 600px) {
  .user-title {
    display: none;
  }
}
.password-dots {
  color: #fff;
  font-size: 28px;
  text-shadow: 0px 1px 2px #9e9e9e;
}
.titulo {
  font-size: 28px;
  color: #9e9e9e;
}
.bg-argos {
  background-image: url("../../assets/photos/argos1.jpg");
  background-size: cover;
}
.rectangulo {
  background-color: #fafafa;
  position: fixed;
  right: 0%;
  top: 0%;
  width: 30vw;
  height: 100vh;
}
</style>
<template>
  <v-app>
    <v-main>
      <v-container class="fill-height bg-argos" fluid>
        <v-row align="center" justify="center">
          <v-col cols="14" sm="0" md="6">
            <center class="user-title">{{ correo }}</center>
            <center class="password-dots">
              <span v-bind:key="ind" v-for="(k, ind) in password">*</span>
            </center>
          </v-col>
          <v-col cols="14" sm="8" md="3">
            <div class="rectangulo"></div>
            <v-card class="elevation-12">
              <v-container>
                <v-container>
                  <v-spacer></v-spacer>
                  <center>
                    <span class="titulo">Iniciar sesión</span>
                  </center>
                  <v-spacer></v-spacer>
                </v-container>
                <br />
                <v-container>
                  <v-container>
                    <v-form>
                      <v-text-field
                        label="Correo"
                        name="login"
                        :rules="[rules.required]"
                        prepend-icon="mdi-at"
                        type="text"
                        v-model="correo"
                        @keydown.enter="focusNext"
                      ></v-text-field>

                      <v-text-field
                        id="password"
                        label="Contraseña"
                        name="password"
                        :rules="[rules.required, rules.counter]"
                        prepend-icon="mdi-lock"
                        :append-icon="
                          canSeePassword ? 'mdi-eye' : 'mdi-eye-off'
                        "
                        :type="canSeePassword ? 'text' : 'password'"
                        v-model="password"
                        @click:append="canSeePassword = !canSeePassword"
                      ></v-text-field>
                    </v-form>
                  </v-container>
                </v-container>
                <v-container class="text-right">
                  <v-text-field
                    color="primary"
                    :loading="isLoading"
                    disabled
                  ></v-text-field>
                  <v-btn
                    color="primary"
                    large
                    @click="login"
                    :disabled="isLoading"
                  >
                    Iniciar sesión
                  </v-btn>
                </v-container>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import router from "../../router";
export default {
  name: "LoginPage",

  data: () => ({
    correo: "",
    password: "",
    canSeePassword: false,
    isLoading: false,
    rules: {
      required: value => !!value || "Requerido",
      counter: value =>
        value.length >= 4 || "La contraseña debe contener al menos 6 carateres"
    }
  }),

  methods: {
    focusNext(e) {
      const inputs = Array.from(e.target.form.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);

      if (index < inputs.length) {
        inputs[index + 1].focus();
      }
    },

    async login() {
      this.isLoading = true;
      if (this.correo != "" && this.password != "") {
        let respuesta = await axios.post(
          process.env.VUE_APP_API + "iniciarSesion.php",
          {
            request: 1,
            correo: this.correo,
            password: this.password
          }
        );
        this.isLoading = false;
        localStorage.token = respuesta.data.token;
        if (respuesta.data.status == "Ok") {
          localStorage.apellidoPaterno = respuesta.data.usuario.apellidoPaterno;
          localStorage.apellidoMaterno = respuesta.data.usuario.apellidoMaterno;
          localStorage.puesto = respuesta.data.usuario.puesto;
          localStorage.titulo = respuesta.data.usuario.titulo;
          localStorage.nombres = respuesta.data.usuario.nombres;
          localStorage.correo = respuesta.data.usuario.correo;
          localStorage.id = respuesta.data.usuario.id;
          router.replace({ path: "/" });
        }
      } else {
        this.isLoading = false;
        localStorage.token = "";
      }
    }
  }
};
</script>
