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
</style>
<template>
  <v-container>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      item-key="noParte"
      sort-by="calories"
      multi-sort
      class="elevation-1"
      show-select
      :dense="dense"
      fixed-header
      height="70vh"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title v-if="selected.length === 0"
            >Mis items</v-toolbar-title
          >
          <v-divider
            class="mx-4"
            inset
            vertical
            v-if="selected.length === 0"
          ></v-divider>
          <v-toolbar-title v-if="selected.length === 0">
            <div class="espaciadorVertical"></div>
            <v-select
              v-if="selected.length === 0"
              :items="tipos"
              label="Tipo de Item"
              v-model="tipoSeleccionado"
              @change="getItems"
              :loading="isLoading"
            ></v-select>
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
              <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
              <v-btn
                class="ma-2"
                text
                icon
                color="red darken-1"
                v-bind="attrs"
                v-on="on"
                v-if="false"
              >
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
              <v-divider class="mx-4" inset vertical v-if="false"></v-divider>
              <v-btn icon color="info" @click="syncJBInfo">
                <v-icon>mdi-database-sync</v-icon>
              </v-btn>
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
                    <v-col cols="12" sm="12" md="6">
                      <v-select
                        :items="tipos"
                        label="Tipo"
                        v-model="editedItem.tipo"
                      ></v-select>
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
      <template v-slot:item[stock]="{ item }">
        <strong color="success" :content="item.stock" v-if="item.stock != null">
          {{ item.stock }}
        </strong>
        <h4 v-if="!isJBSyncing && item.stock == null" color="info">
          JBoss info
        </h4>
        <v-progress-circular
          v-if="isJBSyncing"
          indeterminate
          color="info"
          :size="24"
        ></v-progress-circular>
      </template>
      <template v-slot:item[actions]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
          v-if="false"
          color="info"
          >mdi-pencil-outline</v-icon
        >
        <v-icon small @click="deleteItem(item)" color="error"
          >mdi-delete-outline</v-icon
        >
      </template>
      <template v-slot:item[qr]="{ item }">
        <div class="tableSpacer"></div>
        <img
          class="tableImage"
          :src="
            `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${item.noParte}`
          "
          :lazy-src="
            `https://chart.googleapis.com/chart?chs=10x10&cht=qr&chl=${item.noParte}`
          "
          alt="QR"
        />
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Recargar</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  name: "Items",
  data: () => ({
    dialog: false,
    tipos: ["Materia Prima", "Make Item", "Buy Item", "Ensamble"],
    tipoSeleccionado: "",
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
      this.tipoSeleccionado = "Materia Prima";
      this.getItems();
    },
    async getItems() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerItems.php";
      let respuesta = await axios.post(
        myUrl,
        {
          request: 1,
          tipo: this.tipoSeleccionado,
          token: localStorage.token
        },
        { timeout: 10000 }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.items = respuesta.data.rows;
        this.isLoading = false;
      }
    },

    async syncJBInfo() {
      this.isJBSyncing = true;
      let myUrl = localStorage.JBLink;
      myUrl += "/Jobs";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: this.tipoSeleccionado,
        token: localStorage.token,
        name: localStorage.JBLUser,
        pass: localStorage.JBLPass,
        query:
          "SELECT Location_ID As locationID, Material As noParte, On_Hand_Qty As stock FROM Material_Location"
      });
      if (respuesta) {
        this.inventario = respuesta.data;
        this.isJBSyncing = false;
      }
      this.compararStocks();
    },
    compararStocks() {
      console.log("Empezando a comparar");
      if (this.items) {
        this.items.map(item => {
          this.inventario.map(invItem => {
            if (invItem.noParte == item.noParte) {
              item.stock = invItem.stock;
            }
          });
        });
      }
      console.log("Terminando de comparar");
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
    }
  }
};
</script>
