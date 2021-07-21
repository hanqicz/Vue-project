<template>
  <div>
    <v-btn @click="abrir" class="ml-2">Entrada por PO</v-btn>

    <v-dialog
      v-model="open"
      persistent
      @click:outside="cerrar"
      max-width="900px"
    >
      <v-card class="vcard" :loading="isLoadingModal">
        <v-card-title>
          <span class="headline">Entrada de Inventario</span>
        </v-card-title>
        <v-row class="d-flex justify-center">
          <v-col cols="8"
            ><v-text-field
              label="Buscar ID"
              prepend-inner-icon="mdi-magnify"
              v-model="search"
            ></v-text-field
          ></v-col>
        </v-row>
        <v-row>
          <v-col cols="12"
            ><v-simple-table fixed-header height="200px" dense>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Comentario</th>
                  <th>Empleado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, ind) in ordenesFiltradas"
                  :key="ind"
                  class="clickeable"
                  @click="getMateriales(item.id)"
                >
                  <th>{{ item.id }}</th>
                  <th>{{ item.comentarioOrden }}</th>
                  <th>{{ item.nombreEmpleado }}</th>
                  <th>{{ item.fechaVencimiento }}</th>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
          <v-col cols="12" sm="12" md="9">
            <v-card :loading="isLoading">
              <h3 class="pt-2 pl-2">Materiales</h3>
              <v-simple-table fixed-header height="240px" dense>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>No. Parte</th>
                    <th>Material</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, it) in materialesOrden" :key="it">
                    <th>{{ item.id }}</th>
                    <th>{{ item.noParte }}</th>
                    <th>{{ item.nombre }}</th>
                    <th width="32px">
                      <v-text-field
                        type="number"
                        :suffix="'/' + item.cantidad"
                        :max="parseInt(item.cantidad)"
                        :min="parseInt(item.cantidadActual)"
                        v-model="item.nuevaCantidad"
                        dense
                      ></v-text-field>
                    </th>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="3">
            <v-btn color="blue darken-1" text @click="rellenar()">
              Llenar Todo
            </v-btn>
            <v-col> </v-col>
            <v-btn color="blue darken-1" text @click="send()">
              Guardar
            </v-btn>
            <v-col></v-col>
            <v-btn color="blue darken-1" text @click="cerrar">
              Cancelar
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { matchStrings } from "../../../tools/proStrings";
import { generateRandomId } from "../../../tools/randomStrGus";

export default {
  props: ["isOpen2", "sendCallback", "sendCallbackArchivos"],
  data: () => ({
    isSending: false,
    fileLoading: false,
    isLoading: false,
    isLoadingModal: false,
    search: "",
    po: 0,
    inventario: [],
    ordenesCompras: [],
    materiales: []
  }),
  computed: {
    open() {
      return this.isOpen2;
    },
    materialesOrden() {
      return this.materiales;
    },
    ordenesFiltradas() {
      let filtradas = this.ordenesCompras;
      if (this.search == "") return filtradas;
      let myFiltradas = filtradas.filter(
        item =>
          matchStrings({
            s: this.search,
            str: item.id
          }) ||
          matchStrings({
            s: this.search,
            str: item.nombreEmpleado
          }) ||
          matchStrings({
            s: this.search,
            str: item.comentarioOrden
          }) ||
          matchStrings({
            s: this.search,
            str: item.fechaVencimiento
          })
      );
      return myFiltradas;
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getOrdenesCompras();
    },
    abrir() {
      this.isSending = false;
      this.$emit("abrir2");
    },
    cerrar() {
      this.$emit("cerrar2");
    },
    rellenar() {
      this.materiales = this.materiales.map(material => {
        material.nuevaCantidad = material.cantidad;
        return material;
      });
    },
    async getOrdenesCompras() {
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAllApproved",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.ordenesCompras = respuesta.data.rows;
        console.table(this.ordenesCompras);
      }
    },
    async getMateriales(id) {
      this.isLoading = true;
      this.po = id;
      let myUrl = process.env.VUE_APP_API + "newModules/ordenesMateriales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getMaterials",
        id: id,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;

      if (respuesta.data.status == "Ok") {
        this.materiales = respuesta.data.rows?.map(item => {
          item.idRandom = generateRandomId();
          return item;
        });
        console.log(this.materiales);
        this.isLoading = false;
      }
    },
    async send() {
      this.isLoadingModal = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        idCulpable: localStorage.id,
        entradaMultiple: this.materiales,
        idRandom: generateRandomId(),
        tipo: "insertMultiple",
        po: this.po,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Registrado", {
          duration: 2000,
          position: "bottom-center"
        });
        this.isLoadingModal = false;
        this.sendCallback();
        //this.sendCallbackArchivos();
        this.materiales = [];
        this.cerrar();
      }
    }
  }
};
</script>

<style scoped>
.vcard {
  overflow-x: hidden;
}
.clickeable {
  cursor: pointer;
}
</style>
