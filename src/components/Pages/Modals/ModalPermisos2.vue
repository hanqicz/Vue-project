<template>
  <div>
    <v-dialog
      v-model="open"
      persistent
      @click:outside="cerrar"
      max-width="900px"
    >
      <v-card :loading="isLoading">
        <v-card-title> <span></span> </v-card-title>
        <v-card-text>
          <v-container>
            <v-row
              ><v-col cols="12" sm="6" md="6">
                <h2 center>
                  {{ usuario.nombre }} {{ usuario.apellido1 }}
                  {{ usuario.apellido2 }}
                </h2>
              </v-col></v-row
            >
            <br />
            <v-simple-table>
              <tbody>
                <tr v-for="(item, ind) in permisos" :key="ind">
                  <td class="text-left">{{ item.id }}</td>
                  <td class="text-left">{{ item.permiso }}</td>
                  <td class="text-center">
                    <v-checkbox
                      v-model="permisosActivos"
                      color="success"
                      :value="item.id"
                    ></v-checkbox>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
                class="d-flex justify-end align-end"
                ><v-btn
                  color="blue darken-1"
                  text
                  :disabled="isSending"
                  @click="send"
                >
                  Enviar
                </v-btn>
                <v-btn color="blue darken-1" text @click="cerrar"
                  >Cancelar</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ModalPermisos2",
  props: ["isOpen", "idEditing", "usuario"],
  // Orden de atributos: bool, number, string, object, array
  data: () => ({
    isSending: false,
    fileLoading: false,
    isLoading: false,
    permisos: [],
    permisosUsuarios: [],
    permisosActivos: []
  }),
  computed: {
    open() {
      return this.isOpen;
    },
    token() {
      return localStorage.token ? localStorage.token : "";
    }
  },
  watch: {
    idEditing() {
      if (this.isOpen) {
        this.permisosActivos = [];
        this.getPermisos();
      }
    }
  },
  methods: {
    cerrar() {
      this.$emit("cerrar");
    },
    async getPermisos() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerPermisos.php";
      let respuesta = await axios.post(
        myUrl,
        {
          request: 1,
          token: localStorage.token
        },
        { timeout: 10000 }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.permisosUsuarios = respuesta.data.permisosUsuarios.filter(
          value => value.idUsuario == this.idEditing
        );
        this.permisos = respuesta.data.permisos;
        this.permisosActivos = this.permisosUsuarios.map(
          item => item.idPermiso
        );
        this.isLoading = false;
        console.log(this.permisosActivos);
      }
    },
    async send() {
      this.isSending = true;
      let myUrl = process.env.VUE_APP_API + "newModules/permisos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        idUsuario: this.idEditing,
        tipo: "update",
        permisos: this.permisosActivos,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Permisos actualizados", {
          duration: 2000,
          position: "bottom-center"
        });

        this.isSending = false;
        this.cerrar();
      }
    }
  }
};
</script>

<style scoped></style>
