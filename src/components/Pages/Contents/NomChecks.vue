<style scoped></style>
<template>
  <v-container>
    <h1 v-if="hojaNormativa.nombre">Plantilla de {{ hojaNormativa.nombre }}</h1>
    <br />
    <v-expansion-panels accordion v-for="(seccion, i) in secciones" :key="i">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3>
            {{ seccion.nombre }}
          </h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            v-for="(check, ind) in checks.filter(
              item => item.idSeccion == seccion.id
            )"
            :key="ind"
          >
            <v-col cols="12" sm="6">
              {{ check.nombre }}
            </v-col>
            <v-col cols="12" sm="3">
              <v-menu
                v-model="check.menu"
                :close-on-content-click="true"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="check.fechaFinal"
                    label="Fecha de termino de operación"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="es"
                  v-model="check.fechaFinal"
                  @input="updateFechaFinal(check)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="3">
              <select-empleado-multiple
                :seleccionados="check.responsables"
                :idCheck="check.id"
              ></select-empleado-multiple>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <v-text-field
                label="Nuevo check"
                append-outer-icon="mdi-plus"
                v-model="secciones[i].newCheckName"
                @click:append-outer="
                  insertCheck(secciones[i].id, secciones[i].newCheckName)
                "
              ></v-text-field>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <br />
    <v-text-field
      label="Nueva sección"
      v-model="newSectionName"
      append-outer-icon="mdi-plus"
      @click:append-outer="insert"
    ></v-text-field>
    <v-row>
      <v-col cols="12">
        <v-btn @click="publicar">
          Publicar una copia de ésta hoja normativa
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
import SelectEmpleadoMultiple from "../Selectores/SelectEmpleadoMultipleCheck";
export default {
  name: "NomChecks",
  components: { SelectEmpleadoMultiple },
  data: () => ({
    empleado: {},
    newSectionName: "",
    hojaNormativa: {},
    checks: [],
    secciones: [],
    responsables: []
  }),
  mounted: async function() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getHojaNormativa();
    },
    async getHojaNormativa() {
      this.isJBSyncing = true;
      let myUrl = "obtenerNomSheetsTemplates.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        idSheet: this.$route.params.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.hojaNormativa = respuesta.data.rows[0];
        this.getSecciones();
      }
    },
    async getSecciones() {
      this.isJBSyncing = true;
      let myUrl = process.env.VUE_APP_API + "obtenerNomSectionsTemplates.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        idSheet: this.$route.params.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.secciones = respuesta.data.rows;
        this.getResponsables();
      }
    },
    async getResponsables() {
      let myUrl =
        process.env.VUE_APP_API + "obtenerNomResponsablesTemplates.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        idSheet: this.$route.params.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.responsables = respuesta.data.rows;
        this.getChecks();
      }
    },
    async getChecks() {
      let myUrl = process.env.VUE_APP_API + "obtenerNomChecksTemplates.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        idSheet: this.$route.params.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.checks = respuesta.data.rows;
        this.checks.map(item => {
          item.responsables = this.responsables.filter(
            itm => item.id == itm.idCheck
          );
          return item;
        });
      }
    },

    async insert() {
      this.isInserting = true;

      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarNomSectionTemplate.php",
        {
          request: 1,
          nombre: this.newSectionName,
          idSheet: this.$route.params.id,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Sección agregada").goAway(2000);
        this.initialize();
      }
    },
    async updateFechaFinal(myCheck) {
      let idCheck = myCheck.id;
      let fechaFinal = myCheck.fechaFinal;
      this.isInserting = true;
      console.log("idCheck: " + idCheck + " fechaFinal: " + fechaFinal);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "updateNomCheckTemplate.php",
        {
          request: 1,
          idCheck: idCheck,
          fechaFinal: fechaFinal,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Fecha actualizada").goAway(2000);
      }
    },
    async insertCheck(idSec, checkName) {
      this.isInserting = true;
      console.log("idSeccion: " + idSec + " value: " + checkName);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarNomCheckTemplate.php",
        {
          request: 1,
          nombre: checkName,
          idSeccion: idSec,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Check agregado").goAway(2000);
        this.initialize();
      }
    },
    async publicar() {
      this.isJBSyncing = true;
      let myUrl = process.env.VUE_APP_API + "publicarNomSheet.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.$route.params.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.$toasted.success("Copia publicada").goAway(2000);
      }
    }
  }
};
</script>
