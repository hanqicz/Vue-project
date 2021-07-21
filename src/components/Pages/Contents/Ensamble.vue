<style scoped>
.centrado {
  text-align: center;
}
.overflowY {
  overflow-y: auto;
}
.izquierdado {
  text-align: left;
}
</style>
<template>
  <v-container>
    <h1>Ensamble: {{ ensamble.noParte }}</h1>
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="ensamble.noParte"
          label="No. de parte"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="ensamble.noDibujo"
          label="No. de dibujo"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="ensamble.revision"
          label="Revisión"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="ensamble.descripcion"
          label="Descripcion"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4">
        <v-text-field
          v-model="ensamble.comentarios"
          label="Comentarios"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-select
          v-model="ensamble.etiquetas"
          :items="conjuntoTags"
          attach
          chips
          label="#Tags"
          multiple
        ></v-select>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-row justify="center">
          <v-col cols="12" sm="12" md="6" lg="3">
            <v-text-field
              v-model="search"
              label="Búsca un item"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="12" md="6" lg="6" class="centrado">
            <h5>Lista de partes:</h5>
            <v-card
              max-width="440"
              max-height="600"
              class="overflowY mx-auto"
              outlined
              :loading="isLoadingLista"
            >
              <v-virtual-scroll
                :items="partesFiltradas"
                height="499"
                item-height="50"
              >
                <template v-slot:default="{ item }">
                  <v-list-item :key="item.id" dense>
                    <v-list-item-content class="densado">
                      <v-list-item-title class="izquierdado">
                        {{ item.noParte }} :
                        {{ item.descripcion }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon small @click="agregar(item)">
                        <v-icon small color="success"> mdi-plus-circle </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6" lg="6" class="centrado">
            <h5>
              En este ensamble :
              <span class="error--text" v-if="isFiltering">
                (Contenido filtrado)
              </span>
            </h5>
            <v-card
              max-width="440"
              class="overflowY mx-auto"
              outlined
              :loading="isLoadingEnEnsamble"
              ><v-virtual-scroll
                :items="partesEnEnsambleFiltradas"
                height="499"
                item-height="80"
              >
                <template v-slot:default="{ item }">
                  <v-list-item :key="item.id" dense>
                    <v-list-item-content>
                      <v-list-item-title class="izquierdado">
                        <v-text-field
                          type="number"
                          dense
                          style="max-width: 34px; display: inline-block"
                          v-model="item.cantidad"
                          :rules="[rules.cantidad]"
                        >
                        </v-text-field>
                        {{ item.noParte }} :
                        {{ item.descripcion }}
                      </v-list-item-title>
                      <v-list-item-subtitle> </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <div class="centrado">
                        <v-btn icon small>
                          <v-icon small color="danger" @click="quitar(item)">
                            mdi-close-circle
                          </v-icon>
                        </v-btn>
                      </div>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="12" align-self="center">
        <v-btn @click="guardar">Guardar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
import { matchStrings } from "../../../tools/proStrings";
export default {
  name: "Ensamble",
  data: () => ({
    ensamble: {
      id: "0",
      tipo: "Ensamble",
      noParte: "",
      revision: "1",
      descripcion: "",
      material: "",
      etiquetas: ""
    },
    rules: {
      required: value => !!value || "Requerido",
      counter: value => value.length > 4 || "Pocos caracteres",
      cantidad: v => {
        if (!isNaN(parseFloat(v)) && v >= 1) return true;
        return "Valores mayores a 1";
      }
    },
    search: "",
    indexIzq: null,
    indexDer: null,
    conjuntoTags: [],
    partes: [],
    partesEnEnsamble: [],
    isSaving: false,
    isLoadingLista: false,
    isLoadingEnEnsamble: false
  }),
  computed: {
    partesFiltradas() {
      if (!this.search) {
        return this.partes;
      }
      return this.partes.filter(parte => {
        return (
          matchStrings({ s: this.search, str: parte.descripcion }) ||
          matchStrings({ s: this.search, str: parte.noParte })
        );
      });
    },
    partesEnEnsambleFiltradas() {
      if (!this.search) {
        return this.partesEnEnsamble;
      }
      return this.partesEnEnsamble.filter(parte => {
        return (
          matchStrings({ s: this.search, str: parte.descripcion }) ||
          matchStrings({ s: this.search, str: parte.noParte })
        );
      });
    },
    isFiltering() {
      if (this.search.trim() == "") return false;
      else return true;
    }
  },

  methods: {
    agregar: function(item) {
      let inArray = false;
      this.partesEnEnsamble.map(tem => {
        if (tem.noParte == item.noParte) {
          tem.cantidad = parseInt(tem.cantidad) + 1;
          inArray = true;
        }
      });
      if (!inArray) {
        this.partesEnEnsamble.push(item);
        this.partesEnEnsamble[this.partesEnEnsamble.length - 1].cantidad = 1;
      }
      this.partesEnEnsamble = [...this.partesEnEnsamble];
    },
    quitar: function(item) {
      const index = this.partesEnEnsamble.indexOf(item);
      this.partesEnEnsamble.splice(index, 1);
    },
    guardar: async function() {
      this.id = this.$route.params.id;
      this.isSaving = true;
      this.$toasted.show("Guardando... No cierres la página").goAway(2000);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "actualizarEnsamble.php",
        {
          request: 1,
          id: this.id,
          ensamble: this.ensamble,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.isSaving = false;
      }

      respuesta = await axios.post(
        process.env.VUE_APP_API + "actualizarRelacionesEnsamble.php",
        {
          request: 1,
          id: this.id,
          relaciones: this.partesEnEnsamble,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Cambios guardados").goAway(2000);
        this.isSaving = false;
      }
    }
  },
  mounted: async function() {
    this.id = this.$route.params.id;
    this.isLoadingLista = true;
    this.isLoadingEnEnsamble = true;
    let respuesta = await axios.post(
      process.env.VUE_APP_API + "obtenerEnsamble.php",
      {
        request: 1,
        id: this.id,
        token: localStorage.token
      }
    );
    localStorage.token = respuesta.data.token;
    if (respuesta.data.status == "Ok") {
      this.ensamble = respuesta.data.rows[0];
      this.isLoadingLista = false;
    }
    respuesta = await axios.post(
      process.env.VUE_APP_API + "obtenerPartesPosiblesEnsamble.php",
      {
        request: 1,
        id: this.id,
        token: localStorage.token
      }
    );
    localStorage.token = respuesta.data.token;
    if (respuesta.data.status == "Ok") {
      this.partes = respuesta.data.rows;
      this.isLoadingLista = false;
    }
    respuesta = await axios.post(
      process.env.VUE_APP_API + "obtenerPartesEnsamble.php",
      {
        request: 1,
        id: this.id,
        token: localStorage.token
      }
    );
    localStorage.token = respuesta.data.token;
    if (respuesta.data.status == "Ok") {
      this.partesEnEnsamble = respuesta.data.rows;
      this.isLoadingEnEnsamble = false;
    }
  }
};
</script>
