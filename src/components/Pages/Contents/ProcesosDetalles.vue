<style>
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div class="contenedor">
    <v-card :loading="isLoading">
      <h1>
        {{ singleJob.nombreEmpleado }}
      </h1>
      <div class="d-flex justify-end">
        <v-btn @click="$router.go(-1)">Regresar</v-btn>
      </div>
      <br />
      <h3>Fecha de creacion</h3>
      <h3>{{ singleJob.fechaHora }}</h3>

      <h2>Procesos</h2>

      <v-simple-table fixed-header height="75vh">
        <template v-slot: default>
          <thead>
            <tr>
              <th
                class="text-center"
                v-for="(header, ind) in headers"
                :key="ind"
              >
                <v-text-field
                  :placeholder="header['name']"
                  append-icon="mdi-table-search"
                  dense
                  v-model="header.search"
                  class="shrink"
                ></v-text-field>
              </th>
            </tr>
            <tr>
              <th class="text-left" v-for="(header, ind) in headers" :key="ind">
                {{ header["name"] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in procesosFiltrados" :key="i">
              <td class="text-center">{{ item.id }}</td>
              <td class="text-center">{{ item.proveedor }}</td>
              <td class="text-center">{{ item.claveOperacion }}</td>
              <td class="text-center">{{ item.prgFecha }}</td>
              <td class="text-center">{{ item.descripcion }}</td>
              <td class="text-center">{{ item.configurar }}</td>
              <td class="text-center">{{ item.tasaProceso }}</td>
              <td class="text-center">{{ item.proceso }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <br />
      <h2>Materiales</h2>

      <v-simple-table fixed-header height="75vh">
        <template v-slot: default>
          <thead>
            <tr>
              <th
                class="text-center"
                v-for="(header, indx) in headersMateriales"
                :key="indx"
              >
                <v-text-field
                  :placeholder="header['name']"
                  append-icon="mdi-table-search"
                  dense
                  v-model="header.search"
                  class="shrink"
                ></v-text-field>
              </th>
            </tr>
            <tr>
              <th
                class="text-left"
                v-for="(header, indx) in headersMateriales"
                :key="indx"
              >
                {{ header["name"] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in materialesFiltrados" :key="index">
              <td class="text-center">{{ item.vencimiento }}</td>
              <td class="text-center">{{ item.claveRequerimiento }}</td>
              <td class="text-center">{{ item.descripcion }}</td>
              <td class="text-center">{{ item.primarioUbicacion }}</td>
              <td class="text-center">{{ item.cantidad }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>
<script>
import axios from "axios";
import { matchStrings } from "../../../tools/proStrings";
export default {
  name: "ProcesosDetalles",
  data: () => ({
    isLoading: false,
    totalIVA: 0,
    total: 0,
    subtotal: 0,
    singleJob: {},
    materiales: ["hola"],
    headers: [
      { name: "Id", attr: "id", search: "" },
      { name: "Provedor CT/Oper/Serv", attr: "proveedor", search: "" },
      { name: "Clave Operación", attr: "claveOperacion", search: "" },
      { name: "Inicio Prg Fin Prg", attr: "prgFecha", search: "" },
      { name: "Descripción", attr: "descripcion", search: "" },
      { name: "Configurar", attr: "configurar", search: "" },
      { name: "Tasa Proceso", attr: "tasaProceso", search: "" },
      { name: "Proceso", attr: "proceso", search: "" }
    ],
    headersMateriales: [
      { name: "Vencimiento", attr: "vencimiento", search: "" },
      { name: "Clave Requerimiento", attr: "claveRequerimiento", search: "" },
      { name: "Material Descripción", attr: "materialDescripcion", search: "" },
      { name: "Primario Ubicación", attr: "primarioUbicacion", search: "" },
      { name: "Cantidad", attr: "cantidad", search: "" }
    ]
  }),
  created() {
    this.initialize();
  },
  computed: {
    procesosFiltrados() {
      let filtradas = this.singleJob.procesos;
      filtradas = filtradas?.filter(hoja => {
        let isIn = false;
        let countMatches = 0;
        this.headers.map(header => {
          if (matchStrings({ s: header.search, str: hoja[header.attr] }))
            countMatches++;
          else if (header.search == "") {
            countMatches++;
          }
        });
        if (countMatches == this.headers.length) isIn = true;
        return isIn;
      });
      return filtradas;
    },
    materialesFiltrados() {
      let filtradas = this.singleJob.materiales;
      filtradas = filtradas?.filter(hoja => {
        let isIn = false;
        let countMatches = 0;
        this.headersMateriales.map(header => {
          if (
            matchStrings({
              s: header.search,
              str: hoja[header.attr]
            })
          ) {
            countMatches++;
          } else if (header.search == "") {
            countMatches++;
          }
        });
        if (countMatches == this.headersMateriales.length) isIn = true;
        return isIn;
      });
      return filtradas;
    }
  },
  methods: {
    initialize() {
      this.getOneJob();
    },
    calTotales() {
      const cantidades = this.materiales.map(
        item => parseInt(item.precio) * parseInt(item.cantidad)
      );
      const cantidadesIVA = this.materiales.map(item => parseInt(item.iva));
      cantidades.forEach(value => (this.subtotal += value));
      cantidadesIVA.forEach(
        (value, i) => (this.totalIVA += (value / 100) * cantidades[i])
      );
      this.total = this.subtotal + this.totalIVA;
    },
    async getOneJob() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.$route.params.id,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.singleJob = respuesta.data.rows[0];
        this.singleJob.procesos = respuesta.data.procesos.map(proceso => {
          return {
            proveedor: "T003 10.70",
            claveOperacion: "344444",
            prgFecha: "9/06/2021 10/06/2021",
            descripcion: "TORNEADO SUJETAR CON CHUCK Y HACER TESTIGOS A Ø6.280",
            configurar: "1.00",
            tasaProceso: "1 Hrs/Parte",
            proceso: "1.00",
            ...proceso
          };
        });
        this.singleJob.materiales = respuesta.data.materiales[0];
        this.singleJob.materiales = respuesta.data.materiales.map(material => {
          return {
            vencimiento: "T003 10.70",
            claveRequerimiento: "344444",
            materialDescripcion: "DNMG-432 MARCA:TUNGALOY",
            primarioUbicacion: "E-0003",
            cantidad: "0.00",
            ...material
          };
        });
        this.singleJob.archivos = respuesta.data.archivos[0];
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped></style>
