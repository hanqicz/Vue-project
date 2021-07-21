<style>
.busqueda {
  padding-left: 25vw;
  padding-right: 25vw;
}
.centered-input input,
.centered-input input::placeholder {
  text-align: center;
}
.search-icon {
  padding-top: 6px;
}
.titulo {
  font-size: 24px;
}
.iniciales {
  color: #fff;
  font-size: 1.2em;
}
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-card>
        <v-card-title>Agregar un usuario</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="min-height: 70vh; max-height: 80vh">
          <br />
          <v-form>
            <v-text-field
              @keydown.enter="focusNext"
              :rules="[
                () => !!insertUserData.nombres || 'Este campo es requerido',
                () => insertUserData.nombres.length > 3 || 'Faltan caracteres'
              ]"
              label="Nombre(s)"
              type="text"
              v-model="insertUserData.nombres"
              required
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              :rules="[
                () =>
                  !!insertUserData.apellidoPaterno || 'Este campo es requerido',
                () =>
                  insertUserData.apellidoPaterno.length > 3 ||
                  'Faltan caracteres'
              ]"
              label="Apellido Paterno"
              type="text"
              v-model="insertUserData.apellidoPaterno"
              required
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              :rules="[
                () =>
                  !!insertUserData.apellidoMaterno || 'Este campo es requerido',
                () =>
                  insertUserData.apellidoMaterno.length > 3 ||
                  'Faltan caracteres'
              ]"
              label="Apellido Materno"
              type="text"
              v-model="insertUserData.apellidoMaterno"
              required
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              :rules="[
                () => !!insertUserData.puesto || 'Este campo es requerido'
              ]"
              label="Puesto"
              type="text"
              v-model="insertUserData.puesto"
              required
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              :rules="[
                () => !!insertUserData.puesto || 'Este campo es requerido'
              ]"
              label="Título"
              type="text"
              v-model="insertUserData.titulo"
              required
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              :rules="[
                () => !!insertUserData.correo || 'Este campo es requerido',
                v =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  'El correo debe ser correcto'
              ]"
              label="correo"
              type="text"
              v-model="insertUserData.correo"
              required
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              :rules="[
                () =>
                  insertUserData.pass.length >= 6 ||
                  'La contraseña debe de ser de al menos 6 caracteres'
              ]"
              label="Contraseña"
              type="password"
              v-model="insertUserData.pass"
              minlength="6"
              required
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              :rules="[
                () =>
                  insertUserData.pass == insertUserData.passConfirm ||
                  'Las contraseñas deben coincidir'
              ]"
              label="Confirmar contraseña"
              type="password"
              v-model="insertUserData.passConfirm"
              minlength="6"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="insert">Guardar</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" scrollable max-width="300px">
      <v-card>
        <v-card-title
          >Editando a <br />{{
            updateUserData.nombres.substr(
              0,
              updateUserData.nombres.indexOf(" ")
            )
              ? updateUserData.nombres.substr(
                  0,
                  updateUserData.nombres.indexOf(" ")
                )
              : updateUserData.nombres
          }}
          {{ updateUserData.apellidoPaterno }}</v-card-title
        >
        <v-divider></v-divider>
        <v-card-text style="min-height: 70vh; max-height: 80vh">
          <br />
          <v-form>
            <v-text-field
              @keydown.enter="focusNext"
              label="Nombre(s)"
              type="text"
              v-model="updateUserData.nombres"
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              label="Apellido Paterno"
              type="text"
              v-model="updateUserData.apellidoPaterno"
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              label="Apellido Materno"
              type="text"
              v-model="updateUserData.apellidoMaterno"
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              label="Puesto"
              type="text"
              v-model="updateUserData.puesto"
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              label="Título"
              type="text"
              v-model="updateUserData.titulo"
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              label="Nombre de usuario"
              type="text"
              v-model="updateUserData.correo"
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              label="Contraseña"
              type="password"
              v-model="updateUserData.pass"
              minlength="6"
            ></v-text-field>
            <v-text-field
              @keydown.enter="focusNext"
              label="Confirmar contraseña"
              type="password"
              v-model="updateUserData.passConfirm"
              minlength="6"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="update">Guardar</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <center>
      <span class="titulo">
        Usuarios
        <v-btn text icon x-small @click="dialog = !dialog">
          <v-icon color="secondary">mdi-plus-circle-outline</v-icon>
        </v-btn>
      </span>
    </center>
    <br />
    <center class="busqueda">
      <v-text-field
        @keydown.enter="focusNext"
        class="centered-input"
        single-line
        full-width
        hide-details
        dense
        v-model="filtro"
        @focusin="isFocus = true"
        @focusout="isFocus = false"
      ></v-text-field>
      <v-icon class="search-icon" :color="isFocus ? 'primary' : 'secondary'"
        >mdi-account-search</v-icon
      >
    </center>
    <br />
    <div class="contenedor">
      <v-row align="center" justify="center">
        <v-col
          cols="12"
          sm="8"
          md="3"
          :key="i"
          v-for="(n, i) in usuariosFiltrados"
        >
          <v-card elevation="2">
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">{{ n.titulo }}</div>
                <v-list-item-title class="headline mb-2"
                  >{{
                    n.nombres.substr(0, n.nombres.indexOf(" "))
                      ? n.nombres.substr(0, n.nombres.indexOf(" "))
                      : n.nombres
                  }}
                  {{ n.apellidoPaterno }}</v-list-item-title
                >
                <v-list-item-subtitle>
                  {{ n.puesto }}
                  <br />
                  {{ n.descripcion }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-avatar
                :color="
                  getRandomColor('' + n.nombres[0] + n.apellidoPaterno[0])
                "
              >
                <img v-if="n.imagen" :src="n.imagen" :alt="n.correo" />
                <span v-if="!n.imagen && n.correo" class="iniciales"
                  >{{ n.nombres[0] }}{{ n.apellidoPaterno[0] }}</span
                >
              </v-avatar>
            </v-list-item>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="secondary"
                @click="
                  dialogEdit = true;
                  updateUserData = n;
                "
              >
                Editar
              </v-btn>
              <v-btn text color="secondary" v-if="false">Eliminar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="8"
          md="3"
          :key="'placeholder' + i"
          v-for="(n, i) in [0, 1, 2, 3, 4, 5, 6, 7]"
        >
          <v-skeleton-loader
            type="article, actions"
            v-if="isLoading"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Usuarios",
  data: () => ({
    isFocus: false,
    isInserting: false,
    isUpdating: false,
    isLoading: true,
    dialog: false,
    dialogEdit: false,
    insertUserData: {
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      puesto: "",
      titulo: "",
      correo: "",
      pass: "",
      passConfirm: ""
    },
    updateUserData: {
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      puesto: "",
      titulo: "",
      correo: "",
      pass: "",
      passConfirm: ""
    },
    filtro: "",
    usuarios: []
  }),
  watch: {
    dialog: function(val) {
      if (!val) this.insertUserData.pass = this.insertUserData.passConfirm = "";
    }
  },
  computed: {
    usuariosFiltrados() {
      return this.usuarios.filter(usuario => {
        return (
          usuario.correo.toLowerCase().indexOf(this.filtro.toLowerCase()) > -1
        );
      });
    }
  },
  mounted: function() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getUsuarios();
    },
    async getUsuarios() {
      if (localStorage.token != "") {
        this.isLoading = true;
        let respuesta = await axios.post(
          process.env.VUE_APP_API + "obtenerUsuarios.php",
          {
            request: 1,
            token: localStorage.token
          }
        );
        localStorage.token = respuesta.data.token;
        if (respuesta.data.status == "Ok") {
          this.usuarios = respuesta.data.rows;
          this.isLoading = false;
        }
      }
    },
    focusNext(e) {
      const inputs = Array.from(e.target.form.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);

      if (index < inputs.length) {
        inputs[index + 1].focus();
      }
    },
    getRandomColor(nombre) {
      let myColors = [
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "deep-orange",
        "brown",
        "blue-grey",
        "grey"
      ];

      let myTones = ["lighten-1", "darken-1", "darken-2"];
      let myIndex1,
        myIndex2 = 0;
      if (nombre.length > 1) {
        myIndex1 = nombre.charCodeAt(1) % (myColors.length - 1);
        if (nombre.length > 1) {
          myIndex2 = nombre.charCodeAt(1) % (myTones.length - 1);
        } else {
          myIndex2 = nombre.charCodeAt(0) % (myTones.length - 1);
        }
      } else {
        myIndex1 = myColors.length - 1;
        myIndex2 = myTones.length - 1;
      }
      /* console.log(myTones);
      console.log(myColors);
      console.log(myIndex1);
      console.log(myIndex2); */
      return `${myColors[myIndex1]} ${myTones[myIndex2]}`;
    },
    async insert() {
      this.isInserting = true;

      if (this.insertUserData.passConfirm !== this.insertUserData.pass) {
        this.$toasted.error("Las contraseñas no coinciden", {
          duration: 2000,
          position: "bottom-center"
        });
        return;
      }
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarUsuario.php",
        {
          request: 1,
          correo: this.insertUserData.correo,
          pass: this.insertUserData.pass,
          nombres: this.insertUserData.nombres,
          apellidoPaterno: this.insertUserData.apellidoPaterno,
          apellidoMaterno: this.insertUserData.apellidoMaterno,
          puesto: this.insertUserData.puesto,
          titulo: this.insertUserData.titulo,
          token: localStorage.token
        },
        { timeout: 10000 }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Usuario agregado").goAway(2000);
        this.initialize();
      }
    },
    async update() {
      this.isUpdating = true;
      if (this.updateUserData.correo != "") {
        if (this.updateUserData.passConfirm !== this.updateUserData.pass) {
          this.$toasted.error("Las contraseñas no coinciden", {
            duration: 2000,
            position: "bottom-center"
          });
          return;
        }
        let respuesta = await axios.post(
          process.env.VUE_APP_API + "actualizarUsuario.php",
          {
            request: 1,
            id: this.updateUserData.id,
            correo: this.updateUserData.correo,
            nombres: this.updateUserData.nombres,
            apellidoPaterno: this.updateUserData.apellidoPaterno,
            apellidoMaterno: this.updateUserData.apellidoMaterno,
            puesto: this.updateUserData.puesto,
            titulo: this.updateUserData.titulo,
            token: localStorage.token
          },
          { timeout: 10000 }
        );
        localStorage.token = respuesta.data.token;
        if (respuesta.data.status == "Ok") {
          this.$toasted.success("Usuario actualizado").goAway(2000);
          this.initialize();
        }
      } else {
        localStorage.token = "";
        this.isUpdating = false;
      }
    }
  }
};
</script>
