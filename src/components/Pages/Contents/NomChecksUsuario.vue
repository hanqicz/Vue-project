<style scoped>
.hidden {
  display: none;
}
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div class="contenedor">
    <h1>Mis checks por completar</h1>
    <br />
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Hoja normativa</th>
            <th class="text-left">Sección</th>
            <th class="text-left">Requisitos</th>
            <th class="text-left">Estatus</th>
            <th class="text-left">Archivos adjuntos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in checks" :key="item.id">
            <td>{{ item.hojaNormativa }}</td>
            <td>{{ item.seccion }}</td>
            <td>{{ item.nombre }}</td>
            <td>
              <v-select
                :items="status"
                item-text="nombre"
                item-value="nombre"
                label="Estatus"
                v-model="item.status"
                single-line
                @change="updateCheck(item)"
              >
                <template v-slot:prepend-inner>
                  <v-icon
                    :color="
                      status.filter(s => s.nombre == item.status)[0].color
                    "
                  >
                    mdi-checkbox-blank-circle
                  </v-icon>
                </template>
              </v-select>
            </td>
            <td>
              <form
                v-for="archivo in archivos.filter(
                  itm => itm.idCheck == item.id
                )"
                :key="archivo.id"
                target="_blank"
                :action="
                  `https://www.argosonline.com.mx/api/uploads/${archivo.nombreArchivo}`
                "
                method="post"
              >
                <input class="hidden" name="request" value="1" />
                <input class="hidden" name="token" :value="token" />
                <input
                  class="hidden"
                  name="file"
                  :value="archivo.nombreArchivo"
                />
                <button class="primary--text">
                  {{ archivo.nombreArchivo }}
                </button>
              </form>
              <v-file-input
                label="Sube un archivo"
                show-size
                small-chips
                truncate-length="12"
                prepend-outer-icon="mdi-upload"
                append-outer-icon="mdi-upload"
                @click:append-outer="sendFiles(item)"
                v-model="item.files"
              ></v-file-input>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <br />
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "NomChecksUsuario",
  data: () => ({
    empleado: {},
    newSectionName: "",
    hojaNormativa: {},
    checks: [],
    secciones: [],
    archivos: [],
    status: [
      { nombre: "Pendiente", color: "white" },
      { nombre: "En proceso", color: "amber" },
      { nombre: "Terminado", color: "blue" },
      { nombre: "Revisado", color: "teal" }
    ],
    token: localStorage.getItem("token")
  }),

  mounted: async function() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getChecks();
    },
    async updateCheck(myCheck) {
      console.log("idCheck: " + myCheck.id);
      if (myCheck.status == "Revisado") {
        this.$toasted
          .error("Sin permiso para designar revisiones")
          .goAway(3000);
        this.getChecks();
        return;
      }
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "updateNomCheck.php",
        {
          request: 1,
          idCheck: myCheck.id,
          check: myCheck,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Requisito actualizado").goAway(2000);
      }
      localStorage.checkCounter = this.checks.filter(item => {
        return (
          item.checked == "false" || item.checked == false || item.checked == 0
        );
      }).length;
    },
    async getChecks() {
      this.isJBSyncing = true;
      let myUrl = process.env.VUE_APP_API + "obtenerNomChecksUsuario.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        idUsuario: localStorage.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.checks = respuesta.data.rows.map(item => {
          item.files = [];
          return item;
        });
        this.getArchivos();
      }
    },
    async getArchivos() {
      let myUrl = process.env.VUE_APP_API + "obtenerNomArchivosPublicados.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        idUsuario: localStorage.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.archivos = respuesta.data.rows;
      }
    },
    async sendFiles(item) {
      item.isUploading = true;
      let formData = new FormData();
      formData.append("file", item.files);
      formData.append("request", 1);
      formData.append("token", localStorage.token);
      formData.append("idCheck", item.id);

      let respuesta = await axios.post(
        process.env.VUE_APP_API + "uploadFile.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (respuesta.data.status == "Ok") {
        item.isUploading = false;
        this.$toasted.success("Archivo guardado con éxito").goAway(2000);
        this.getArchivos();
      }
    }
  }
};
</script>
