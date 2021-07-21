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
    <h1 v-if="hojaNormativa.nombre">{{ hojaNormativa.nombre }}</h1>
    <br />
    <v-btn text @click="calcPStatus" :disabled="isDisabled"
      >Reporte de status</v-btn
    >
    <v-btn text @click="calcPEmpleados" :disabled="isDisabled"
      >Reporte de empleados</v-btn
    >
    <br />
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
            <v-col cols="12" sm="2">
              <v-select
                :items="status"
                item-text="nombre"
                item-value="nombre"
                label="Estatus"
                v-model="check.status"
                single-line
                @change="updateCheck(check)"
              >
                <template v-slot:prepend-inner>
                  <v-icon :color="getStatusColor(check.status)">
                    mdi-checkbox-blank-circle
                  </v-icon>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="3">
              <select-empleado-multiple
                :isPublicada="true"
                :seleccionados="check.responsables"
                :idCheck="check.id"
              ></select-empleado-multiple>
            </v-col>
            <v-col cols="12" sm="2">
              <form
                v-for="archivo in archivos.filter(
                  itm => itm.idCheck == check.id
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
            </v-col>
            <v-col cols="12" sm="12">
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <br />
  </div>
</template>
<script>
import axios from "axios";
import SelectEmpleadoMultiple from "../Selectores/SelectEmpleadoMultipleCheck";
import XLSX from "xlsx";
export default {
  name: "NomChecksPublicados",
  components: { SelectEmpleadoMultiple },
  data: () => ({
    newSectionName: "",
    isDisabled: true,
    hojaNormativa: {},
    checks: [],
    secciones: [],
    responsables: [],
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
      this.getHojaNormativa();
    },
    getStatusColor(status) {
      let myStatus = this.status.filter(s => s.nombre == status);
      if (myStatus.length > 0) {
        return myStatus[0].color;
      }
      return "white";
    },

    async calcPStatus() {
      console.log("Calculando...");
      let pendiente = 0,
        proceso = 0,
        revisado = 0,
        terminado = 0,
        total = 0;
      this.checks.map(item => {
        if (item.status == "Pendiente") pendiente++;
        else if (item.status == "En proceso") proceso++;
        else if (item.status == "Revisado") revisado++;
        else if (item.status == "Terminado") terminado++;
        total++;
      });
      let pPend = (pendiente / total) * 100,
        pPro = (proceso / total) * 100,
        pRev = (revisado / total) * 100,
        pTer = (terminado / total) * 100;
      let dataToExport = [
        {
          hoja: this.hojaNormativa.nombre,
          pendiente: `${pPend.toFixed(2)} %`,
          enProceso: `${pPro.toFixed(2)} %`,
          terminado: `${pRev.toFixed(2)} %`,
          revisado: `${pTer.toFixed(2)} %`
        }
      ];
      let data = XLSX.utils.json_to_sheet(dataToExport);
      data["A1"].v = "Hoja";
      data["B1"].v = "Pendiente";
      data["C1"].v = "En proceso";
      data["D1"].v = "Terminado";
      data["E1"].v = "Revisado";
      const workbook = XLSX.utils.book_new();
      const filename = `Status_${this.hojaNormativa.nombre.substring(0, 20)}`;
      XLSX.utils.book_append_sheet(workbook, data, filename);
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    },
    async calcPEmpleados() {
      let sResp = [];
      this.responsables.map(responsable => {
        // Ésto lo que hace es armar un nuevo array resumido
        let esta = false;
        sResp.map(r => {
          if (r.id == responsable.id) {
            esta = true;
          }
        });
        if (!esta) {
          responsable.pendiente = 0;
          responsable.proceso = 0;
          responsable.revisado = 0;
          responsable.terminado = 0;
          responsable.total = 0;
          sResp.push(responsable);
        }
        // Contar los checks de responsable, si coincide con alguno, checar el status del check y sumar en el array de sResp
        this.checks.map(check => {
          if (responsable.idCheck == check.id) {
            sResp.map(r => {
              if (r.id == responsable.id) {
                if (check.status == "Pendiente") r.pendiente++;
                if (check.status == "En proceso") r.proceso++;
                if (check.status == "Revisado") r.revisado++;
                if (check.status == "Terminado") r.terminado++;
                r.total++;
              }
            });
          }
        });

        sResp.map(item => {
          item.pProceso = (item.proceso / item.total) * 100;
          item.pPendiente = (item.pendiente / item.total) * 100;
          item.pRevisado = (item.revisado / item.total) * 100;
          item.pTerminado = (item.terminado / item.total) * 100;
        });
      });

      let dataToExport = sResp.map(empleado => {
        return {
          nombre: `${empleado.nombres}  ${empleado.apellidoPaterno} ${empleado.apellidoMaterno}`,
          puesto: empleado.puesto,
          correo: empleado.correo,
          pPend: `${empleado.pPendiente.toFixed(2)} %`,
          pPro: `${empleado.pProceso.toFixed(2)} %`,
          pTer: `${empleado.pTerminado.toFixed(2)} %`,
          pRev: `${empleado.pRevisado.toFixed(2)} %`,
          pendientes: empleado.pendiente,
          enProceso: empleado.proceso,
          terminados: empleado.terminado,
          revisados: empleado.revisado,
          asignados: empleado.total
        };
      });
      let data = XLSX.utils.json_to_sheet(dataToExport);
      data["A1"].v = "Empleado";
      data["B1"].v = "Puesto";
      data["C1"].v = "Correo";
      data["D1"].v = "% Pendientes";
      data["E1"].v = "% En proceso";
      data["F1"].v = "% Terminados";
      data["G1"].v = "% Revisado";
      data["H1"].v = "Pendientes";
      data["I1"].v = "En proceso";
      data["J1"].v = "Terminados";
      data["K1"].v = "Revisado";
      data["L1"].v = "Asignaciones";
      const workbook = XLSX.utils.book_new();
      const filename = `Empleados_${this.hojaNormativa.nombre.substring(
        0,
        20
      )}`;
      XLSX.utils.book_append_sheet(workbook, data, filename);
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      console.log(sResp);
    },

    async updateCheck(myCheck) {
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

    async getHojaNormativa() {
      this.isJBSyncing = true;
      let myUrl = process.env.VUE_APP_API + "obtenerNomSheetsPublicadas.php";

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
    async getArchivos() {
      let myUrl = process.env.VUE_APP_API + "obtenerNomArchivosPublicados.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        idSheet: this.$route.params.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.archivos = respuesta.data.rows;
        this.isDisabled = false;
      }
    },
    async getSecciones() {
      this.isJBSyncing = true;
      let myUrl = process.env.VUE_APP_API + "obtenerNomSectionsPublicadas.php";

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
        process.env.VUE_APP_API + "obtenerNomResponsablesPublicadas.php";

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
      let myUrl = process.env.VUE_APP_API + "obtenerNomChecksPublicados.php";

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
        this.getArchivos();
      }
    }
  }
};
</script>
