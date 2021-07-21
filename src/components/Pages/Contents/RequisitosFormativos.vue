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
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="itemsFiltrados"
      item-key="noParte"
      sort-by="calories"
      multi-sort
      class="elevation-1"
      show-select
      :dense="dense"
      :footer-props="{
        'usuarios-per-page-text': 'Requisitos por pagina',
        'usuarios-per-page-options': [10, 20, 30, 40, 50, 100, 200, 500]
      }"
      :items-per-page="200"
      fixed-header
      height="70vh"
      :loading="isLoading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title v-if="selected.length === 0"
            >Requisitos formativos</v-toolbar-title
          >
          <v-divider
            class="mx-4"
            inset
            vertical
            v-if="selected.length === 0"
          ></v-divider>
          <v-toolbar-title v-if="selected.length === 0">
            <div class="espaciadorVertical"></div>
            <v-text-field
              :loading="isLoading"
              :disabled="isLoading"
              v-model="search"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-toolbar-title>
          <v-toolbar-title v-if="selected.length === 0">
            <div class="espaciadorVertical"></div>
          </v-toolbar-title>

          <v-toolbar-title v-if="selected.length > 0">
            <v-btn
              class="mx-2"
              fab
              dark
              small
              elevation="0"
              color="red darken-2"
              @click="deleteItems()"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2"
                text
                icon
                color="green darken-1"
                v-bind="attrs"
                v-on="on"
                v-if="false"
              >
                <v-icon>mdi-export</v-icon>
              </v-btn>
              <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
              <v-btn
                class="ma-2"
                text
                icon
                color="blue darken-1"
                v-bind="attrs"
                v-on="on"
                v-if="false"
              >
                <v-icon>mdi-tag-outline</v-icon>
              </v-btn>
              <v-divider class="mx-1" inset vertical></v-divider>
              <v-btn
                class="ma-2"
                text
                icon
                color="success"
                @click="descargarReporte"
              >
                <v-icon>mdi-google-spreadsheet</v-icon>
              </v-btn>

              <v-divider class="mx-1" inset vertical></v-divider>
              <modal-evaluacion
                v-bind:dialog="isFileModalOpen"
                v-bind:requisito="requisito"
                v-on:closeModal="closeModal"
                v-on:insertCallback="getRequisitos"
              ></modal-evaluacion>
              <modal-link-evaluacion
                v-bind:dialog="isLinkModalOpen"
                v-bind:requisito="requisito"
                v-on:closeModal="closeModal"
                v-on:insertCallback="getRequisitos"
              ></modal-link-evaluacion>
              <v-divider class="mx-1" inset vertical></v-divider>
              <v-switch
                v-model="dense"
                hide-details
                dense
                inset
                color="secondary"
              ></v-switch>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="6">
                      <v-text-field
                        v-model="editedItem.item"
                        label="Item"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-grey darken-1" text @click="close"
                  >Cancelar</v-btn
                >
                <v-btn color="blue-grey darken-1" text @click="save"
                  >Guardar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.evaluaciones`]="{ item }">
        <form
          v-for="evaluacion in item.evaluaciones.filter(
            evaluacion => !compareStrings({ s: 'https://', str: evaluacion })
          )"
          :key="evaluacion"
          target="_blank"
          :action="`https://www.argosonline.com.mx/api/uploads/${evaluacion}`"
          method="post"
        >
          <input class="hidden" name="request" value="1" />
          <input class="hidden" name="token" :value="token" />
          <input class="hidden" name="file" :value="evaluacion" />
          <button class="info--text">
            {{ evaluacion }}</button
          ><br />
        </form>
        <a
          target="_blank"
          v-for="evaluacion in item.evaluaciones.filter(evaluacion =>
            compareStrings({ s: 'https://', str: evaluacion })
          )"
          :key="evaluacion"
          :href="evaluacion"
          >{{ evaluacion }} <br
        /></a>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon link :to="`/CumplimientoRequisito/${item.id}`">
          <v-icon small color="info"> mdi-view-list </v-icon>
        </v-btn>
        <v-btn icon color="info" @click="prepararSubida(item)">
          <v-icon small>mdi-file-plus</v-icon>
        </v-btn>
        <v-btn icon color="info" @click="prepararLink(item)">
          <v-icon small>mdi-link-plus</v-icon>
        </v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Recargar</v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";
import ModalEvaluacion from "../Modals/ModalEvaluacion";
import ModalLinkEvaluacion from "../Modals/ModalLinkEvaluacion";
import XLSX from "xlsx";
import { matchStrings } from "../../../tools/proStrings";
export default {
  name: "Requisitos",
  components: { ModalEvaluacion, ModalLinkEvaluacion },
  data: () => ({
    dialog: false,
    isLoading: false,
    isJBSyncing: false,
    selected: [],
    dense: false,
    search: "",
    requisito: 0,
    isFileModalOpen: false,
    isLinkModalOpen: false,
    headers: [
      { text: "Requisito", value: "nombre" },
      { text: "Evaluaciones", value: "evaluaciones", sortable: false },
      { text: "% Cumplimiento", value: "pCumplimiento", sortable: false },
      { text: "Acciones", value: "actions", sortable: false }
    ],
    items: [],
    inventario: [],
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
    itemsFiltrados() {
      if (this.search) {
        return this.items.filter(item =>
          matchStrings({ s: this.search, str: item.nombre })
        );
      } else {
        return this.items;
      }
    },
    token() {
      return localStorage.token;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Item" : "Editar Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getRequisitos();
    },
    compareStrings(obj) {
      return matchStrings(obj);
    },
    async getRequisitos() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerRequisitosFormativos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.items = respuesta.data.rows;
        this.isLoading = false;
      }
    },
    async prepararSubida(item) {
      this.requisito = item;
      this.isFileModalOpen = true;
    },
    async prepararLink(item) {
      this.requisito = item;
      this.isLinkModalOpen = true;
    },
    closeModal() {
      console.log("Clickeaste afuera parent");
      this.isFileModalOpen = false;
      this.isLinkModalOpen = false;
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm("¿Seguro que quieres borrar éste Item?") &&
        this.items.splice(index, 1);
    },

    deleteItems() {
      if (confirm("¿Seguro que quieres borrar éstos Items?")) {
        this.items = this.items.filter(el => !this.selected.includes(el));
        this.selected = [];
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push(this.editedItem);
      }
      this.close();
    },

    async descargarReporte() {
      var myItems = this.items.map(item => ({
        id: item.id,
        requisito: item.nombre,
        cumplimiento: item.pCumplimiento * 0.01
      }));

      var requisitos = XLSX.utils.json_to_sheet(myItems);
      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, requisitos, "requisitos");
      // export Excel file
      XLSX.writeFile(wb, "requisitosFormativos.xlsx"); // name of the file is 'book.xlsx'
    }
  }
};
</script>
