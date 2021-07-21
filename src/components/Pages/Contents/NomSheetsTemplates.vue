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
.hidden {
  display: none;
}
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div class="contenedor">
    <v-dialog v-model="dialogInsert" scrollable max-width="300px">
      <v-card>
        <v-card-title>
          Agregar nueva <br />
          hoja normativa
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 80vh" v-if="insertSheet">
          <v-text-field v-model="insertSheet.nombre" label="Nombre">
          </v-text-field>
          <v-text-field v-model="insertSheet.descripcion" label="Descripcion">
          </v-text-field>
        </v-card-text>
        <br />
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="insert">Agregar</v-btn>
          <v-btn color="blue darken-1" text @click="dialogInsert = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      loading-text="Tratando de adquirir información"
      :loading="isJBSyncing"
      v-model="selected"
      :headers="headers"
      :items="hojas"
      :search="search"
      item-key="noParte"
      multi-sort
      class="elevation-1"
      show-select
      :dense="dense"
      :footer-props="{
        'hojas-per-page-text': 'Hojas por pagina',
        'hojas-per-page-options': [10, 20, 30, 40, 50, 100, 200, 500]
      }"
      fixed-header
      height="70vh"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title v-if="selected.length === 0">
            Plantillas de hojas normativas
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
            v-if="selected.length === 0"
          ></v-divider>
          <v-toolbar-title v-if="selected.length === 0">
            <div class="espaciadorVertical"></div>
            <v-text-field
              :loading="isLoadingLista"
              :disabled="isLoadingLista"
              v-model="search"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-toolbar-title>

          <v-toolbar-title v-if="selected.length > 0">
            <v-btn
              class="mx-2"
              fab
              icon
              small
              elevation="0"
              color="danger"
              @click="deleteHojas()"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              fab
              icon
              small
              elevation="0"
              color="success"
              @click="exportSelectedToCSV()"
            >
              <v-icon dark>mdi-table-arrow-right</v-icon>
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
              <v-file-input
                label="Sube un formato de hoja"
                small-chips
                dense
                :disabled="fileLoading"
                show-size
                color="info"
                truncate-length="12"
                prepend-outer-icon="mdi-upload"
                append-outer-icon="mdi-upload"
                :full-width="false"
                :rules="rules"
                accept=".csv, .txt"
                @click:append-outer="readFile"
                v-model="file"
              ></v-file-input>
              <v-divider class="mx-1" inset vertical v-if="false"></v-divider>

              <form
                target="_blank"
                action="https://www.argosonline.com.mx/api/templates/Formato_de_plantilla.csv"
                method="post"
              >
                <input class="hidden" name="request" value="1" />
                <input class="hidden" name="token" :value="token" />
                <input
                  class="hidden"
                  name="file"
                  value="Formato_de_plantilla.csv"
                />
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="ma-2"
                      text
                      icon
                      color="info"
                      type="submit"
                      @click="() => {}"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-file-download-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar formato de plantilla</span>
                </v-tooltip>
              </form>
              <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
              <v-btn
                class="ma-2"
                text
                icon
                color="primary"
                @click="dialogInsert = !dialogInsert"
              >
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
              <v-divider class="mx-4" inset vertical v-if="false"></v-divider>
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
                        :hojas="tipos"
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
      <template v-slot:[`item.stock`]="{ item }">
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
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon link :to="`/HojaNormativa/${item.id}`">
          <v-icon small color="info"> mdi-file-tree </v-icon>
        </v-btn>
        <v-icon small @click="deleteItem(item)" color="error"
          >mdi-delete-outline</v-icon
        >
      </template>
      <template v-slot:[`item.qr`]="{ item }">
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
  </div>
</template>
<script>
import axios from "axios";
import exportCSVFile from "../../../tools/jsonToCsv";
import { csvToJSON } from "../../../tools/jsonToCsv";
export default {
  name: "NomSheetsTemplates",
  data: () => ({
    dialog: false,
    fileLoading: false,
    text: "",
    rules: [
      value =>
        !value || value.size < 2000000 || "El archivo debe ser menor a 2 MB!"
    ],
    dialogInsert: false,
    file: [],
    tipos: ["Materia Prima", "Make Item", "Buy Item", "Ensamble"],
    tipoSeleccionado: "",
    isLoading: false,
    isLoadingLista: false,
    isJBSyncing: false,
    selected: [],
    dense: false,
    search: "",
    headers: [
      { text: "Nombre", value: "nombre" },
      { text: "Descripción", value: "descripcion" },
      { text: "Acciones", value: "actions", sortable: false }
    ],
    hojas: [],
    inventario: [],
    editedIndex: -1,
    insertSheet: {
      nombre: "",
      descripcion: ""
    },
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
    },
    token: localStorage.getItem("token")
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
      this.getHojas();
    },
    async getHojas() {
      this.isJBSyncing = true;
      let myUrl = process.env.VUE_APP_API + "obtenerNomSheetsTemplates.php";
      try {
        let respuesta = await axios.post(myUrl, {
          request: 1,
          token: localStorage.token
        });
        if (respuesta) {
          this.inventario = respuesta.data;
          this.hojas = respuesta.data.rows;
          this.isJBSyncing = false;
        }
      } catch (err) {
        this.isJBSyncing = false;
        this.$toasted.error("La conexión ha sido rechazada").goAway(3000);
        this.$toasted.error("Verifica la conexión").goAway(6000);
        this.$toasted
          .error("Si lo anterior no funciona, pidele ayuda al programador")
          .goAway(9000);
      }
    },

    compararStocks() {
      if (this.hojas) {
        this.hojas.map(item => {
          this.inventario.map(invItem => {
            if (invItem.noParte == item.noParte) {
              item.stock = invItem.stock;
            }
          });
        });
      }
    },
    editItem(item) {
      this.editedIndex = this.hojas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.hojas.indexOf(item);
      confirm("¿Seguro que quieres borrar éste Item?") &&
        this.hojas.splice(index, 1);
    },

    deleteHojas() {
      if (confirm("¿Seguro que quieres borrar éstos Hojas?")) {
        this.hojas = this.hojas.filter(el => !this.selected.includes(el));
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
        Object.assign(this.hojas[this.editedIndex], this.editedItem);
      } else {
        this.hojas.push(this.editedItem);
      }
      this.close();
    },
    async exportSelectedToCSV() {
      let hojasFormatted = [];
      let headers = {
        nombre: "Nombre",
        descripcion: "Descripción"
      };
      // format the data
      this.selected.forEach(item => {
        hojasFormatted.push({
          nombre: item.nombre.replace(/,/g, ""), // remove commas to avoid errors,
          descripcion: item.descripcion.replace(/,/g, "")
        });
      });

      await exportCSVFile(headers, [...this.selected], "Hojas de normativa");
      this.selected = [];
      return;
    },

    async insert() {
      this.isInserting = true;

      let respuesta = await axios.post(
        process.env.VUE_APP_API + "insertarNomSheetTemplate.php",
        {
          request: 1,
          nombre: this.insertSheet.nombre,
          descripcion: this.insertSheet.descripcion,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Hoja agregada").goAway(2000);
        this.dialogInsert = false;
        this.initialize();
      }
    },
    async readFile() {
      this.fileLoading = true;
      let reader = new FileReader();
      let csv = "";
      reader.readAsText(this.file, "UTF-8");
      reader.onload = evt => {
        this.text = evt.target.result;
        csv = this.text;
        this.sendFile(csv);
      };
      reader.onerror = evt => {
        console.error(evt);
      };
    },
    async sendFile(csv) {
      let myItems = csvToJSON(csv, ["tipo", "descripcion"]);
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "uploadJSONNomTemplate.php",
        {
          request: 1,
          items: myItems,
          token: localStorage.token
        }
      );
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Plantilla subida con éxito").goAway(2000);
        this.fileLoading = false;
        this.initialize();
      }
    }
  }
};
</script>
