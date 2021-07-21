<style>
.espaciadorVertical {
  height: 24px;
}
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div class="contenedor">
    <graficas-cuentas :items="selected.length > 0 ? selected : items">
    </graficas-cuentas>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :search="search"
      item-key="id"
      sort-by="id"
      multi-sort
      class="elevation-1"
      show-select
      :dense="dense"
      fixed-header
      height="70vh"
      :loading="isLoading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title v-if="selected.length === 0"
            >Cuentas por cobrar</v-toolbar-title
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
          <v-divider class="mx-4" inset vertical v-if="false"></v-divider>
          <v-toolbar-title v-if="selected.length === 0">
            <div class="espaciadorVertical" v-if="false"></div>
            <v-select
              v-if="false"
              :items="tipos"
              label="Tipo de Item"
              v-model="tipoSeleccionado"
              @change="getItems()"
              :loading="isLoading"
            ></v-select>
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
            v-if="selected.length === 0"
          ></v-divider>
          <v-toolbar-title v-if="selected.length === 0 && false">
            <div class="espaciadorVertical"></div>
            <v-text-field label="Cantidad" type="number"></v-text-field>
          </v-toolbar-title>
          <v-toolbar-title v-if="selected.length > 0">
            <v-btn
              class="mx-2"
              fab
              icon
              small
              elevation="0"
              color="danger"
              @click="deleteItems()"
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
                color="success"
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
                color="info"
                v-bind="attrs"
                v-on="on"
                v-if="false"
              >
                <v-icon>mdi-tag-outline</v-icon>
              </v-btn>
              <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
              <v-btn icon link to="/CuentaCobrar/" color="primary">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-divider class="mx-1" inset vertical v-if="false"></v-divider>
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
                <v-btn color="secondary" text @click="close">Cancelar</v-btn>
                <v-btn color="secondary" text @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.monto`]="{ item }">
        <span>
          {{
            (
              parseFloat(item.proyectado) +
              parseFloat(item.cobrado) +
              parseFloat(item.pendFactura) +
              parseFloat(item.enEjecucion) +
              parseFloat(item.facturado)
            ).toFixed(2)
          }}
        </span>
      </template>
      <template v-slot:[`item.diasVencidos`]="{ item }">
        <span>
          {{ diasFaltantes(new Date(item.vence), new Date()) }}
        </span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon link :to="`/CuentaCobrar/${item.id}`">
          <v-icon small color="info"> mdi-pencil-outline </v-icon>
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
import GraficasCuentas from "./GraficasCuentas.vue";
import exportCSVFile from "../../../tools/jsonToCsv";
export default {
  components: { GraficasCuentas },
  name: "CuentasCobrar",
  data: () => ({
    dialog: false,
    search: "",
    tipos: ["Make Item", "Ensamble"],
    tipoSeleccionado: "",
    isLoading: false,
    selected: [],
    dense: false,
    headers: [
      { text: "Cliente", value: "cliente" },
      { text: "Base", value: "base" },
      { text: "Linea", value: "linea" },
      { text: "PO", value: "po" },
      { text: "Documento", value: "documento" },
      { text: "Estatus", value: "estatus" },
      { text: "OV", value: "ov" },
      { text: "Cotización", value: "cotizacion" },
      { text: "Descripción", value: "descripcion" },
      { text: "Monto", value: "monto" },
      { text: "Cobrado", value: "cobrado" },
      { text: "Facturado", value: "facturado" },
      { text: "Pend. factura", value: "pendFactura" },
      { text: "En ejecución", value: "enEjecucion" },
      { text: "Proyectado", value: "proyectado" },
      { text: "Fecha de factura", value: "fechaFactura" },
      { text: "Ingreso de factura", value: "fechaIngresoFactura" },
      { text: "P de ingreso de factura", value: "pIngresoFactura" },
      { text: "Fecha pagado", value: "fechaPagado" },
      { text: "P de pago", value: "pPago" },
      { text: "Vence", value: "vence" },
      { text: "Días vencidos", value: "diasVencidos" },
      { text: "Fecha termino operación", value: "fechaTerminoOperacion" },
      { text: "Refacturado", value: "refacturado" },
      { text: "P ejecutado", value: "pEjecutado" },
      { text: "Acciones", value: "actions", sortable: false }
    ],
    items: [],
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
      this.tipoSeleccionado = "Ensamble";
      this.getItems();
    },
    diasFaltantes(date1, date2) {
      return Math.abs(
        Math.ceil(
          (date1 - date2) / (1000 * 60 * 60 * 24) < 0
            ? (date1 - date2) / (1000 * 60 * 60 * 24)
            : 0
        )
      );
    },
    async getItems() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerCuentasCobrar.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: this.tipoSeleccionado,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.items = respuesta.data.rows;
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
    async exportSelectedToCSV() {
      let itemsFormatted = [];
      let headers = {
        ...this.selected[0]
      };
      Object.entries(headers).forEach(item => {
        headers[item[0]] = item[0];
      });
      // format the data
      this.selected.forEach(item => {
        let myItem = { ...item };
        Object.entries(myItem).forEach(itm => {
          if (typeof myItem[itm[0]] === "string")
            myItem[itm[0]] = myItem[itm[0]].replace(/,/g, "");
        });
        itemsFormatted.push({
          ...myItem
        });
      });

      await exportCSVFile(headers, [...itemsFormatted], "Inventario");
      this.selected = [];
      return;
    }
  }
};
</script>
