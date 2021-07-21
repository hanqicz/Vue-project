<style scoped>
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div class="contenedor">
    <v-card :loading="isLoading">
      <h1>
        {{ datosHoja.nombreEmpleado }}
      </h1>
      <div class="d-flex justify-end">
        <v-btn @click="$router.go(-1)">Regresar</v-btn>
      </div>
      <br />
      <h3>Fecha de creacion</h3>
      <h3>{{ datosHoja.fecha }}</h3>

      <v-simple-table fixed-header height="70vh">
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
            <tr v-for="(item, i) in materialesFiltrados" :key="i">
              <td class="text-center">{{ item.id }}</td>
              <td class="text-center">{{ item.nombre }}</td>
              <td class="text-center">{{ item.nombreCentroCostos }}</td>
              <td class="text-center">{{ item.proveedor }}</td>
              <td class="text-center">{{ item.descripcion }}</td>
              <td class="text-center">${{ item.precio }}</td>
              <td class="text-center">${{ item.iva }}</td>
              <td class="text-center">{{ item.tipoMoneda }}</td>
              <td class="text-center">{{ item.cantidad }}</td>
              <td class="text-center">${{ item.precio * item.cantidad }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-card elevation="24">
        <v-row
          ><v-col lg="1" md="2" sm="3"
            ><v-card-text> Sub-total </v-card-text>
            <v-card-text> IVA </v-card-text>
            <v-card-text> Total </v-card-text></v-col
          >
          <v-col lg="1" md="2" sm="3">
            <v-card-text>$ {{ subtotal }}</v-card-text>
            <v-card-text>$ {{ totalIVA.toFixed(2) }}</v-card-text>
            <v-card-text>$ {{ total.toFixed(2) }}</v-card-text>
          </v-col></v-row
        >
      </v-card>
    </v-card>
  </div>
</template>
<script>
import axios from "axios";
import { matchStrings } from "../../../tools/proStrings";
export default {
  name: "ReqMatDetalles",
  data: () => ({
    isLoading: false,
    totalIVA: 0,
    total: 0,
    subtotal: 0,
    datosHoja: [],
    materiales: [],
    headers: [
      { name: "Id", attr: "id", search: "" },
      { name: "Material", attr: "nombre", search: "" },
      { name: "Centro de costos", attr: "nombreCentroCostos", search: "" },
      { name: "Proveedor", attr: "proveedor", search: "" },
      { name: "Descripcion", attr: "descripcion", search: "" },
      { name: "Precio", attr: "precio", search: "" },
      { name: "IVA", attr: "iva", search: "" },
      { name: "Tipo de moneda", attr: "tipoMoneda", search: "" },
      { name: "Cantidad", attr: "cantidad", search: "" },
      { name: "Total", attr: "total", search: "" }
    ]
  }),
  created() {
    this.initialize();
  },
  computed: {
    materialesFiltrados() {
      let filtradas = this.materiales;
      filtradas = filtradas.filter(hoja => {
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
    }
  },
  methods: {
    initialize() {
      this.getDatosHoja();
      this.getMateriales();
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
    async getDatosHoja() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getOne",
        id: this.$route.params.id,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;

      if (respuesta.data.status == "Ok") {
        this.datosHoja = respuesta.data.rows[0];
        this.isLoading = false;
      }
    },
    async getMateriales() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getMaterials",
        id: this.$route.params.id,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;

      if (respuesta.data.status == "Ok") {
        this.materiales = respuesta.data.rows;
        this.calTotales();
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped></style>
