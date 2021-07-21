<template>
  <div>
    <v-btn @click="abrir">Nueva Salida Inventario</v-btn>

    <v-dialog
      v-model="open"
      persistent
      @click:outside="cerrar"
      max-width="750px"
    >
      <v-card :loading="isLoading">
        <v-card-title>
          <span class="headline">Agregar Salida Inventario</span>
        </v-card-title>
        <v-row class="d-flex justify-center"
          ><v-col cols="3">
            <v-select
              :items="tipo"
              label="Tipo de material"
              v-model="visible"
              width="200"
            ></v-select>
          </v-col>
          <v-col cols="3"></v-col>
          <v-col cols="3">
            <v-text-field
              label="Longitud"
              type="number"
              v-model="salidaInventario.longitud"
              v-if="salidaInventario.tipo == 'MP'"
              :suffix="`/${salidaInventario.maxLongitud}m`"
              :value="0"
              :rules="[
                value => !!value || 'Requerido',
                value => parseFloat(value) > 0 || 'Debe ser mayora a 0',
                value =>
                  parseFloat(value) <=
                    parseFloat(salidaInventario.maxLongitud) ||
                  'No existe longitud suficiente'
              ]"
            >
            </v-text-field>
            <v-text-field
              label="Altura"
              type="number"
              v-model="salidaInventario.height"
              v-if="
                salidaInventario.forma == 'placa' &&
                  salidaInventario.tipo == 'MP'
              "
              :suffix="`/${salidaInventario.maxAltura}m`"
              :value="0"
              :rules="[
                value => !!value || 'Requerido',
                value => parseFloat(value) > 0 || 'Debe ser mayora a 0',
                value =>
                  parseFloat(value) <= parseFloat(salidaInventario.maxAltura) ||
                  'No existe altura suficiente'
              ]"
            >
            </v-text-field> </v-col
        ></v-row>
        <v-row>
          <v-col></v-col>
          <v-col cols="6" align-self="center"
            ><v-text-field
              label="Buscar ID"
              prepend-inner-icon="mdi-magnify"
              v-model="search"
              dense
            ></v-text-field
          ></v-col>
          <v-col></v-col>
        </v-row>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-virtual-scroll
                  :items="inventarioFiltrado"
                  height="150"
                  item-height="56"
                >
                  <template v-slot:default="{ item }">
                    <v-list-item :key="item.idRandom" @click="selectItem(item)">
                      <v-list-item-action>
                        {{ item.idRandom }}
                      </v-list-item-action>

                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.nombreMaterial }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon color="error" v-if="item.selected"
                          >mdi-check</v-icon
                        >
                        <v-icon v-else> mdi-circle-outline </v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                    <v-divider></v-divider>
                  </template>
                </v-virtual-scroll>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end"
              ><v-btn color="blue darken-1" text @click="cerrar">
                Cancelar
              </v-btn>
              <v-btn
                color="blue darken-1"
                :disabled="isSending"
                text
                @click="send()"
              >
                Enviar
              </v-btn></v-row
            >
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { matchStrings } from "../../../tools/proStrings";

export default {
  props: ["isOpen", "isEditing", "idEditing", "sendCallback"],
  data: () => ({
    isSending: false,
    fileLoading: false,
    isLoading: false,
    search: "",
    visible: "MP",
    tipo: ["BUY", "MP", "MAKE"],
    inventario: [],
    salidaInventario: {
      outerD: "0.00",
      innerD: "0.00",
      longitud: "0.00",
      height: "0.00",
      width: "0.00",
      selected: false,
      maxLongitud: 0,
      maxAltura: 0
    }
  }),
  computed: {
    open() {
      return this.isOpen;
    },
    inventarioFiltrado() {
      let filtradas = this.inventario.filter(item => item.tipo == this.visible);
      if (this.search == "") return filtradas;
      let myFiltradas = filtradas.filter(
        item =>
          matchStrings({
            s: this.search,
            str: item.idRandom
          }) ||
          matchStrings({
            s: this.search,
            str: item.nombreMaterial
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
      this.getInventario();
    },
    abrir() {
      this.isSending = false;
      this.getInventario();
      this.$emit("abrir");
    },
    cerrar() {
      this.$emit("cerrar");
      this.salidaInventario = {
        outerD: "0.00",
        innerD: "0.00",
        longitud: "0.00",
        height: "0.00",
        width: "0.00",
        selected: false,
        maxLongitud: 0,
        maxAltura: 0
      };
    },

    selectItem(item) {
      this.inventario = this.inventario.map(myItem => {
        myItem.selected = false;
        return myItem;
      });
      item.selected = true;
      this.salidaInventario = { ...item };
      this.salidaInventario.maxLongitud = parseFloat(
        this.salidaInventario.longitud
      );
      this.salidaInventario.maxAltura = parseFloat(
        this.salidaInventario.height
      );
      this.salidaInventario.height = 0;
      this.salidaInventario.longitud = 0;
      this.salidaInventario.innerD = 0;
      this.salidaInventario.outerD = 0;
      this.salidaInventario.width = 0;
    },

    async getInventario() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.isLoading = false;
        this.inventario = respuesta.data.rows.filter(item => {
          if (item.tipo == "BUY" || item.tipo == "MAKE") {
            return true;
          }
          if (
            (item.forma == "barra" || item.forma == "tubo") &&
            parseFloat(item.longitud) > 0
          ) {
            return true;
          }
          if (
            item.forma == "placa" &&
            parseFloat(item.longitud) > 0 &&
            parseFloat(item.height) > 0
          ) {
            return true;
          }
          return false;
        });
        console.table(this.inventario);
      }
    },

    async send() {
      this.isSending = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl = process.env.VUE_APP_API + "newModules/almacen.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        salida: this.salidaInventario,
        idCulpable: this.idCulpable,
        tipo: "insertSalida",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Elemento actualizado", {
          duration: 2000,
          position: "bottom-center"
        });
        this.isSending = false;
        this.sendCallback({ tipoMateriales: this.salidaInventario.tipo });
        this.cerrar();
      }
    }
  }
};
</script>
