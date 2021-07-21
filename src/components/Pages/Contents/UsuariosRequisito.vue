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
      :items="items"
      item-key="noParte"
      sort-by="calories"
      multi-sort
      class="elevation-1"
      show-select
      :dense="dense"
      :footer-props="{
        'requisitos-per-page-text': 'Requisitos por pagina',
        'requisitos-per-page-options': [10, 20, 30, 40, 50, 100, 200, 500]
      }"
      :items-per-page="200"
      fixed-header
      height="70vh"
      :loading="isLoading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title v-if="selected.length === 0">
            {{ requisito.nombre }}
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
            v-if="selected.length === 0"
          ></v-divider>
          <v-toolbar-title v-if="selected.length === 0">
            {{ pCumplimiento }} % de cumplimiento</v-toolbar-title
          >
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
      <template v-slot:[`item.evidencias`]="{ item }">
        <form
          v-for="evidencia in item.evidencias"
          :key="evidencia"
          target="_blank"
          :action="`https://www.argosonline.com.mx/api/uploads/${evidencia}`"
          method="post"
        >
          <input class="hidden" name="request" value="1" />
          <input class="hidden" name="token" :value="token" />
          <input class="hidden" name="file" :value="evidencia" />
          <button class="info--text">
            {{ evidencia }}
          </button>
        </form>
      </template>
      <template v-slot:[`item.nombreUsuario`]="{ item }">
        {{ item.nombres }}
        {{ item.apellidoPaterno }}
        {{ item.apellidoMaterno }}
      </template>
      <template v-slot:[`item.cumple`]="{ item }">
        <v-icon v-if="item.cumple == 1" small class="mr-2" color="success"
          >mdi-check</v-icon
        >
        <v-icon v-else small color="error">mdi-close</v-icon>
      </template>
      <template v-slot:[`item.calificacion`]="{ item }">
        <input
          type="number"
          :value="item.calificacion || 0"
          @change="
            event => {
              actualizarCalificacion(event, item.id);
            }
          "
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
import XLSX from "xlsx";
export default {
  name: "UsuariosRequisito",
  data: () => ({
    dialog: false,
    tipos: ["Materia Prima", "Make Item", "Buy Item", "Ensamble"],
    isLoading: false,
    isJBSyncing: false,
    requisito: {},
    pCumplimiento: 0,
    selected: [],
    dense: false,
    headers: [
      { text: "Usuario", value: "nombreUsuario" },
      { text: "Evidencias", value: "evidencias" },
      { text: "Calificación", value: "calificacion" },
      { text: "Cumple", value: "cumple" }
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
      this.getRequisito();
    },
    async actualizarCalificacion(event, idRequisitoRequisito) {
      console.log("Calificacion: " + event.target.value);
      console.log("id Requisito: " + idRequisitoRequisito);
      let myUrl =
        process.env.VUE_APP_API + "actualizarCalificacionRequisito.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        calificacion: event.target.value,
        idRequisitoRequisito: idRequisitoRequisito,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("Calificación actualizada").goAway(2000);
        this.isLoading = false;
      }
    },
    async getRequisito() {
      let myUrl = process.env.VUE_APP_API + "obtenerRequisitoFormativo.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        idRequisito: this.$route.params.id,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.requisito = respuesta.data.rows[0];
        this.isLoading = false;
      }
    },
    async getRequisitos() {
      this.isLoading = true;
      let myUrl =
        process.env.VUE_APP_API + "obtenerUsuariosFormativosRequisito.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        idRequisito: this.$route.params.id,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.items = respuesta.data.rows;
        let maxItems = 0,
          cumplidos = 0;
        this.items.map(item => {
          maxItems++;
          if (item.cumple == "1") {
            cumplidos++;
          }
        });
        if (maxItems > 0) {
          this.pCumplimiento = (cumplidos / maxItems) * 100;
          this.pCumplimiento = this.pCumplimiento.toFixed(2);
        }
        this.isLoading = false;
      }
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
        nombres: item.nombres,
        apellidoPaterno: item.apellidoPaterno,
        apellidoMaterno: item.apellidoMaterno,
        calificacion: item.calificacion,
        cumple: item.cumple
      }));

      var requisitos = XLSX.utils.json_to_sheet(myItems);
      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, requisitos, "requisitos");
      // export Excel file
      XLSX.writeFile(wb, `${this.requisito.nombre}.xlsx`); // name of the file is 'book.xlsx'
    }
  }
};
</script>
