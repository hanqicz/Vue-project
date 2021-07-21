<style>
.espaciadorVertical {
  height: 24px;
}
.tableImage {
  max-width: 50px;
  max-height: 50px;
}
.tableSpacer {
  min-height: 6px;
}
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div class="contenedor">
    <v-card :loading="isLoading">
      <v-simple-table fixed-header height="80vh">
        <template v-slot:default>
          <thead>
            <tr>
              <th>Usuario</th>
              <th
                class="text-left"
                v-for="(permiso, ind) in permisos"
                :key="ind"
              >
                {{ permiso.permiso }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(usuario, ind) in usuarios" :key="ind">
              <td>
                {{
                  usuario.nombres.substr(0, usuario.nombres.indexOf(" "))
                    ? usuario.nombres.substr(0, usuario.nombres.indexOf(" "))
                    : usuario.nombres
                }}
                {{ usuario.apellidoPaterno }}
              </td>
              <td
                class="text-left"
                v-for="(permiso, ind) in permisos"
                :key="ind"
              >
                <v-checkbox
                  v-model="permisosUsuarios"
                  :value="{
                    idUsuario: usuario.id,
                    idPermiso: permiso.id
                  }"
                ></v-checkbox>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <br />
    <v-btn @click="updatePermisos">Guardar</v-btn>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Permisos",
  data: () => ({
    dialog: false,
    isLoading: false,
    isJBSyncing: false,
    selected: [],
    dense: false,
    headers: [
      { text: "No. Parte", value: "noParte" },
      { text: "QR", value: "qr" },
      { text: "Tipo", value: "tipo" },
      { text: "Revisión", value: "revision" },
      { text: "Descripción", value: "descripcion" },
      { text: "Material", value: "material" },
      { text: "Hashtags", value: "etiquetas" },
      { text: "Stock", value: "stock" },
      { text: "Acciones", value: "actions", sortable: false }
    ],
    permisos: [],
    permisosUsuarios: [],
    usuarios: [],
    editedIndex: -1,
    editedItem: {
      item: "",
      tipo: "",
      descripcion: "",
      datos: "otros datos"
    },
    defaultItem: {
      item: "",
      tipo: "",
      descripcion: "",
      datos: "otros datos"
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Item" : "Editar Item";
    }
  },

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getPermisos();
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
        this.permisosUsuarios = respuesta.data.permisosUsuarios;
        this.permisos = respuesta.data.permisos;
        this.isLoading = false;
      }
      this.getUsuarios();
    },
    async getUsuarios() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerUsuarios.php";
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
        this.usuarios = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async updatePermisos() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "actualizarPermisos.php";
      let respuesta = await axios.post(
        myUrl,
        {
          request: 1,
          permisosUsuarios: this.permisosUsuarios,
          token: localStorage.token
        },
        { timeout: 10000 }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Cambios guardados").goAway(2000);
        this.isLoading = false;
        this.$store.commit("setPermisosUsuarios", {
          permisos: this.permisosUsuarios
        });
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    }
  }
};
</script>
