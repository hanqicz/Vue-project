<style scoped>
.busqueda {
  padding-left: 25vw;
  padding-right: 25vw;
}
.centered-input input,
.centered-input input::placeholder {
  text-align: center;
}
.search-icon {
  padding-top: 6px;
}
.titulo {
  font-size: 24px;
}
.expandido {
  min-height: 40vh;
}
.horizontalPadding {
  padding-left: 12px;
  padding-right: 12px;
}
.densado {
  padding-top: 4px;
  padding-bottom: 4px;
}
.centrado {
  text-align: center;
}
.smallTxt {
  font-size: smaller;
}
.dangerTxt {
  color: #d32f2f;
}
.warningTxt {
  color: #d32f2f;
}
.infoTxt {
  color: #d32f2f;
}
.centrado {
  text-align: center;
}
.izquierdado {
  text-align: left;
}
.derechado {
  text-align: right;
}
.tableLite {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
.tableLite td,
.tableLite th {
  border-bottom: 1px solid rgba(130, 130, 130, 0.2);
  padding: 8px;
}

.tableLite tr:hover {
  background-color: rgba(150, 150, 150, 0.2);
}
.tableLite th {
  padding-top: 12px;
  padding-bottom: 12px;
}
.izquierdado {
  text-align: left;
}
.contenedor {
  margin: 10px;
}
</style>
<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="420px">
      <v-card>
        <v-card-title>Agregar un MRP</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="min-height: 40vh; max-height: 80vh">
          <center>
            <v-text-field
              :loading="isLoadingLista"
              :disabled="isLoadingLista"
              v-model="filtroModal"
              append-icon="mdi-magnify"
            ></v-text-field>
            <v-card
              max-height="200"
              class="overflowY mx-auto"
              outlined
              :loading="isLoadingLista"
            >
              <v-virtual-scroll
                :items="allItemsFiltrados"
                height="199"
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
                      <v-btn icon small @click="agregarAMRP(item)">
                        <v-icon small color="success"> mdi-plus-circle </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-card>
            <br />
            <v-card
              max-height="300"
              class="overflowY mx-auto"
              outlined
              :loading="isLoadingToAdd"
            >
              <v-virtual-scroll
                :items="itemsToAdd"
                height="299"
                item-height="80"
              >
                <template v-slot:default="{ item }">
                  <v-list-item :key="item.id" dense>
                    <v-list-item-content>
                      <v-list-item-title class="izquierdado">
                        {{ item.noParte }} :
                        {{ item.descripcion }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          type="number"
                          dense
                          v-model="item.cantidad"
                          :rules="[rules.cantidad]"
                        >
                        </v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <div class="centrado">
                        <v-btn icon small>
                          <v-icon
                            small
                            color="danger"
                            @click="quitarAMRP(item)"
                          >
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

            <v-text-field
              :loading="isLoadingLista"
              :disabled="isLoadingLista"
              v-model="nombreMRP"
              :rules="[rules.required, rules.counter]"
              label="Nombre del MRP"
            ></v-text-field>
            <v-text-field
              :loading="isLoadingLista"
              :disabled="isLoadingLista"
              v-model="descripcionMRP"
              :rules="[rules.required, rules.counter]"
              label="Descripción corta"
            ></v-text-field>
          </center>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" text @click="dialog = false">Cerrar</v-btn>
          <v-btn color="info" text @click="insertarMRP">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <center>
      <span class="titulo">
        MRP
        <v-btn icon x-small @click="abrirModal">
          <v-icon color="secondary">mdi-plus-circle-outline</v-icon>
        </v-btn>
      </span>
    </center>
    <br />
    <center class="busqueda">
      <v-text-field
        class="centered-input"
        single-line
        full-width
        hide-details
        dense
        :loading="isLoading"
        v-model="filtro"
        @focusin="isFocus = true"
        @focusout="isFocus = false"
      ></v-text-field>
      <v-icon class="search-icon" :color="isFocus ? 'primary' : 'secondary'"
        >mdi-file-search-outline</v-icon
      >
    </center>
    <br />
    <div class="contenedor">
      <v-row align="center" justify="center">
        <v-col
          cols="12"
          :sm="mrp.expanded ? 12 : 8"
          :md="mrp.expanded ? 12 : 3"
          :key="i"
          v-for="(mrp, i) in mrpsFiltrados"
        >
          <v-card elevation="2" :loading="mrp.isLoading">
            <v-list-item three-line>
              <v-list-item-content>
                <v-card-title class="headline mb-2">{{
                  mrp.nombre
                }}</v-card-title>
                <v-card-subtitle v-if="mrp.expanded">
                  <span v-for="(falt, ind) in mrp.subInfo.ensambles" :key="ind">
                    {{ falt.noParte }} x {{ falt.cantidad }}&nbsp;&nbsp;
                  </span>
                </v-card-subtitle>
                <v-card-text>
                  <div>
                    <v-col cols="12" sm="12">
                      <div class="my-1 subtitle-3">
                        {{ mrp.descripcion }}
                      </div>
                    </v-col>
                  </div>
                  <v-card
                    color="rest"
                    flat
                    class="horizontalPadding"
                    :loading="mrp.isLoading"
                    v-if="mrp.expanded"
                  >
                    <v-row>
                      <v-col cols="12" sm="12" :md="mrp.expanded ? 6 : 12">
                        <v-card>
                          <v-container>
                            <table
                              v-if="mrp.expanded"
                              class="smallTxt tableLite"
                            >
                              <caption>
                                <div colspan="6" class="caption">
                                  <br />
                                  {{ mrp.nombre }} :
                                  <span
                                    v-for="(falt, ind) in mrp.subInfo.ensambles"
                                    :key="ind"
                                  >
                                    {{ falt.noParte }} x
                                    {{ falt.cantidad }}&nbsp;&nbsp;
                                  </span>
                                </div>
                                <div></div>
                              </caption>
                              <tr>
                                <th colspan="4" class="izquierdado subtitle-1">
                                  Make Items
                                </th>
                                <th class="centrado" colspan="1">
                                  <v-btn
                                    fab
                                    icon
                                    small
                                    ripple
                                    color="success"
                                    @click="
                                      exportBuyMake(
                                        mrp.subInfo.groupedNecesarios.filter(
                                          item =>
                                            item.tipo == 'Make Item' &&
                                            (item.stock - item.cantidad < 0 ||
                                              !mrp.makesFiltrados)
                                        ),
                                        `Make Items - ${mrp.nombre}`
                                      )
                                    "
                                  >
                                    <v-icon dark>mdi-table-arrow-right</v-icon>
                                  </v-btn>
                                  <v-btn
                                    fab
                                    icon
                                    small
                                    ripple
                                    color="info"
                                    @click="
                                      mrp.makesFiltrados = !mrp.makesFiltrados;
                                      mrps = [...mrps];
                                    "
                                  >
                                    <v-icon dark v-if="!mrp.makesFiltrados"
                                      >mdi-table-eye-off</v-icon
                                    >
                                    <v-icon dark v-if="mrp.makesFiltrados"
                                      >mdi-table-eye</v-icon
                                    >
                                  </v-btn>
                                </th>
                              </tr>
                              <tr>
                                <th class="izquierdado">Parte</th>
                                <th class="izquierdado">Descripción</th>
                                <th>Necesario</th>
                                <th>Stock</th>
                                <th>Faltantes</th>
                              </tr>
                              <tr
                                v-for="(falt,
                                ind) in mrp.subInfo.groupedNecesarios.filter(
                                  item =>
                                    item.tipo == 'Make Item' &&
                                    (item.stock - item.cantidad < 0 ||
                                      !mrp.makesFiltrados)
                                )"
                                :key="ind"
                              >
                                <td>{{ falt.noParte }}</td>
                                <td>{{ falt.descripcion }}</td>
                                <td class="centrado">{{ falt.cantidad }}</td>
                                <td
                                  class="centrado"
                                  :class="
                                    falt.stock == 0 ? 'danger--text' : null
                                  "
                                >
                                  {{ falt.stock }}
                                </td>
                                <td class="centrado">
                                  <span
                                    class="danger--text"
                                    v-if="falt.stock - falt.cantidad < 0"
                                  >
                                    {{ (falt.stock - falt.cantidad) * -1 }}
                                  </span>
                                  <span
                                    :class="
                                      falt.stock - falt.cantidad == 0
                                        ? 'warning--text'
                                        : null
                                    "
                                    v-if="falt.stock - falt.cantidad >= 0"
                                  >
                                    0
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </v-container>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="12" :md="mrp.expanded ? 6 : 12">
                        <v-card>
                          <v-container>
                            <table
                              v-if="mrp.expanded"
                              class="smallTxt tableLite"
                            >
                              <caption>
                                <div colspan="6" class="caption">
                                  <br />
                                  {{ mrp.nombre }} :
                                  <span
                                    v-for="(falt, ind) in mrp.subInfo.ensambles"
                                    :key="ind"
                                  >
                                    {{ falt.noParte }} x
                                    {{ falt.cantidad }}&nbsp;&nbsp;
                                  </span>
                                </div>
                              </caption>
                              <tr>
                                <th colspan="4" class="izquierdado subtitle-1">
                                  Buy Items
                                </th>
                                <th class="centrado">
                                  <v-btn
                                    fab
                                    icon
                                    small
                                    ripple
                                    color="success"
                                    @click="
                                      exportBuyMake(
                                        mrp.subInfo.groupedNecesarios.filter(
                                          item =>
                                            item.tipo == 'Buy Item' &&
                                            (item.stock - item.cantidad < 0 ||
                                              !mrp.buysFiltrados)
                                        ),
                                        `Buy Items - ${mrp.nombre}`
                                      )
                                    "
                                  >
                                    <v-icon dark>mdi-table-arrow-right</v-icon>
                                  </v-btn>
                                  <v-btn
                                    fab
                                    icon
                                    small
                                    ripple
                                    color="info"
                                    @click="
                                      mrp.buysFiltrados = !mrp.buysFiltrados;
                                      mrps = [...mrps];
                                    "
                                  >
                                    <v-icon dark v-if="!mrp.buysFiltrados"
                                      >mdi-table-eye-off</v-icon
                                    >
                                    <v-icon dark v-if="mrp.buysFiltrados"
                                      >mdi-table-eye</v-icon
                                    >
                                  </v-btn>
                                </th>
                              </tr>
                              <tr>
                                <th class="izquierdado">Parte</th>
                                <th class="izquierdado">Descripción</th>
                                <th>Necesario</th>
                                <th>Stock</th>
                                <th>Faltantes</th>
                              </tr>
                              <tr
                                v-for="(falt,
                                ind) in mrp.subInfo.groupedNecesarios.filter(
                                  item =>
                                    item.tipo == 'Buy Item' &&
                                    (item.stock - item.cantidad < 0 ||
                                      !mrp.buysFiltrados)
                                )"
                                :key="ind"
                              >
                                <td>{{ falt.noParte }}</td>
                                <td>{{ falt.descripcion }}</td>
                                <td class="centrado">{{ falt.cantidad }}</td>
                                <td
                                  class="centrado"
                                  :class="
                                    falt.stock == 0 ? 'danger--text' : null
                                  "
                                >
                                  {{ falt.stock }}
                                </td>
                                <td class="centrado">
                                  <span
                                    class="danger--text"
                                    v-if="falt.stock - falt.cantidad < 0"
                                  >
                                    {{ (falt.stock - falt.cantidad) * -1 }}
                                  </span>
                                  <span
                                    :class="
                                      falt.stock - falt.cantidad == 0
                                        ? 'warning--text'
                                        : null
                                    "
                                    v-if="falt.stock - falt.cantidad >= 0"
                                  >
                                    0
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </v-container>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="12" :md="mrp.expanded ? 6 : 12">
                        <v-card>
                          <v-container>
                            <table
                              v-if="mrp.expanded"
                              class="smallTxt tableLite"
                            >
                              <caption>
                                <div colspan="6" class="caption">
                                  <br />
                                  {{ mrp.nombre }} :
                                  <span
                                    v-for="(falt, ind) in mrp.subInfo.ensambles"
                                    :key="ind"
                                  >
                                    {{ falt.noParte }} x
                                    {{ falt.cantidad }}&nbsp;&nbsp;
                                  </span>
                                </div>
                              </caption>
                              <tr>
                                <th colspan="4" class="izquierdado subtitle-1">
                                  Materia Prima por maquinar
                                </th>
                                <th class="centrado">
                                  <v-btn
                                    fab
                                    icon
                                    small
                                    ripple
                                    color="success"
                                    @click="
                                      exportBuyMake(
                                        mrp.subInfo.materiasPrimas.filter(
                                          item =>
                                            item.stock - item.cantidad >= 0
                                        ),
                                        `MP por maquinar - ${mrp.nombre}`
                                      )
                                    "
                                  >
                                    <v-icon dark>mdi-table-arrow-right</v-icon>
                                  </v-btn>
                                </th>
                              </tr>
                              <tr>
                                <th class="izquierdado">Parte</th>
                                <th class="izquierdado">Descripción</th>
                                <th>Necesario</th>
                                <th>Stock</th>
                                <th>Faltantes</th>
                              </tr>
                              <tr
                                v-for="(falt,
                                ind) in mrp.subInfo.materiasPrimas.filter(
                                  item => item.stock - item.cantidad >= 0
                                )"
                                :key="ind"
                              >
                                <td>{{ falt.noParte }}</td>
                                <td>{{ falt.descripcion }}</td>
                                <td class="centrado">{{ falt.cantidad }}</td>
                                <td
                                  class="centrado"
                                  :class="
                                    falt.stock == 0 ? 'danger--text' : null
                                  "
                                >
                                  {{ falt.stock }}
                                </td>
                                <td class="centrado">
                                  <span
                                    class="danger--text"
                                    v-if="falt.stock - falt.cantidad < 0"
                                  >
                                    {{ (falt.stock - falt.cantidad) * -1 }}
                                  </span>
                                  <span
                                    :class="
                                      falt.stock - falt.cantidad == 0
                                        ? 'warning--text'
                                        : null
                                    "
                                    v-if="falt.stock - falt.cantidad >= 0"
                                  >
                                    0
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </v-container>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="12" :md="mrp.expanded ? 6 : 12">
                        <v-card>
                          <v-container>
                            <table
                              v-if="mrp.expanded"
                              class="smallTxt tableLite"
                            >
                              <caption>
                                <div colspan="6" class="caption">
                                  <br />
                                  {{ mrp.nombre }} :
                                  <span
                                    v-for="(falt, ind) in mrp.subInfo.ensambles"
                                    :key="ind"
                                  >
                                    {{ falt.noParte }} x
                                    {{ falt.cantidad }}&nbsp;&nbsp;
                                  </span>
                                </div>
                              </caption>
                              <tr>
                                <th colspan="4" class="izquierdado subtitle-1">
                                  Materia Prima por comprar
                                </th>
                                <th class="centrado">
                                  <v-btn
                                    fab
                                    icon
                                    small
                                    ripple
                                    color="success"
                                    @click="
                                      exportBuyMake(
                                        mrp.subInfo.materiasPrimas.filter(
                                          item => item.stock - item.cantidad < 0
                                        ),
                                        `MP por comprar - ${mrp.nombre}`
                                      )
                                    "
                                  >
                                    <v-icon dark>mdi-table-arrow-right</v-icon>
                                  </v-btn>
                                </th>
                              </tr>
                              <tr>
                                <th class="izquierdado">Parte</th>
                                <th class="izquierdado">Descripción</th>
                                <th>Necesario</th>
                                <th>Stock</th>
                                <th>Faltantes</th>
                              </tr>
                              <tr
                                v-for="(falt,
                                ind) in mrp.subInfo.materiasPrimas.filter(
                                  item => item.stock - item.cantidad < 0
                                )"
                                :key="ind"
                              >
                                <td>{{ falt.noParte }}</td>
                                <td>{{ falt.descripcion }}</td>
                                <td class="centrado">{{ falt.cantidad }}</td>
                                <td
                                  class="centrado"
                                  :class="
                                    falt.stock == 0 ? 'danger--text' : null
                                  "
                                >
                                  {{ falt.stock }}
                                </td>
                                <td class="centrado">
                                  <span
                                    class="danger--text"
                                    v-if="falt.stock - falt.cantidad < 0"
                                  >
                                    {{ (falt.stock - falt.cantidad) * -1 }}
                                  </span>
                                  <span
                                    :class="
                                      falt.stock - falt.cantidad == 0
                                        ? 'warning--text'
                                        : null
                                    "
                                    v-if="falt.stock - falt.cantidad >= 0"
                                  >
                                    0
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </v-container>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-card-text>
              </v-list-item-content>
              <v-list-item-avatar>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      large
                      color="success"
                      v-if="mrp.status === 'success'"
                      v-bind="attrs"
                      v-on="on"
                      >mdi-checkbox-marked-circle-outline</v-icon
                    >
                  </template>
                  <span>Completo</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      large
                      color="warning"
                      v-if="mrp.status === 'warning'"
                      v-bind="attrs"
                      v-on="on"
                      >mdi-alert-rhombus-outline</v-icon
                    >
                  </template>
                  <span>Faltan partes, pero tenemos MP</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      large
                      color="danger"
                      v-if="mrp.status === 'danger'"
                      v-bind="attrs"
                      v-on="on"
                      >mdi-alert-octagon-outline</v-icon
                    >
                  </template>
                  <span>Faltan partes y MP</span>
                </v-tooltip>
              </v-list-item-avatar>
            </v-list-item>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="secondary"
                small
                @click="verDetalles(mrp)"
                v-text="mrp.expanded ? 'Minimizar' : 'Ver'"
              >
                Ver
              </v-btn>
              <v-btn text color="danger" small @click="eliminarMRP(mrp)">
                Eliminar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import exportCSVFile from "../../../tools/jsonToCsv";
export default {
  name: "MRP",

  data: () => ({
    isFocus: false,
    dialog: false,
    isSaving: false,
    nombreMRP: "",
    descripcionMRP: "",
    isLoading: false,
    isLoadingMP: false,
    isLoadingLista: false,
    isLoadingToAdd: false,
    allItems: [],
    itemsToAdd: [],
    filtroModal: "",
    filtro: "",

    rules: {
      required: value => !!value || "Requerido",
      counter: value => value.length > 4 || "Pocos caracteres",
      cantidad: v => {
        if (!isNaN(parseFloat(v)) && v >= 1) return true;
        return "Valores mayores a 1";
      }
    },
    mrps: [],
    items: []
  }),
  computed: {
    mrpsFiltrados() {
      return this.mrps.filter(mrp => {
        return mrp.nombre.toLowerCase().indexOf(this.filtro.toLowerCase()) > -1;
      });
    },
    allItemsFiltrados() {
      return this.allItems.filter(myItem => {
        return (
          myItem.noParte.toLowerCase().indexOf(this.filtroModal.toLowerCase()) >
          -1
        );
      });
    }
  },

  mounted: function() {
    this.initialize();
  },
  methods: {
    initialize: async function() {
      if (localStorage.token != "") {
        this.isLoading = true;
        let respuesta = await axios.post(
          process.env.VUE_APP_API + "obtenerMRPs.php",
          {
            request: 1,
            token: localStorage.token
          }
        );
        localStorage.token = respuesta.data.token;
        if (respuesta.data.status == "Ok") {
          this.mrps = respuesta.data.rows;
          this.isLoading = false;
        }
      }
    },
    abrirModal: async function() {
      this.dialog = !this.dialog;
      this.allItems = [];
      this.isLoadingLista = true;
      let myUrl = process.env.VUE_APP_API + "obtenerItems.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "Ensamble",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.allItems = respuesta.data.rows;
        this.isLoadingLista = false;
      }
    },
    agregarAMRP: function(item) {
      let inArray = false;
      this.itemsToAdd.map(tem => {
        if (tem.noParte == item.noParte) {
          tem.cantidad = tem.cantidad + 1;
          inArray = true;
        }
      });
      if (!inArray) {
        this.itemsToAdd.push(item);
        this.itemsToAdd[this.itemsToAdd.length - 1].cantidad = 1;
      }
      this.itemsToAdd = [...this.itemsToAdd];
    },
    quitarAMRP: function(item) {
      const index = this.itemsToAdd.indexOf(item);
      this.itemsToAdd.splice(index, 1);
    },
    insertarMRP: async function() {
      this.isSaving = true;
      if (this.nombreMRP.length < 3 || this.descripcionMRP.length < 3) {
        this.$toasted.error("Verifica el nombre y la descripción", {
          duration: 2000,
          position: "bottom-center"
        });
        return;
      }
      let myUrl = process.env.VUE_APP_API + "insertarMRP.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "All",
        token: localStorage.token,
        nombre: this.nombreMRP,
        descripcion: this.descripcionMRP,
        items: this.itemsToAdd
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$toasted.success("MRP agregado").goAway(2000);
        this.isSaving = false;
        this.dialog = false;
        this.initialize();
      }
    },
    calcularFaltantesBI: function(mrp) {
      // YA FUNCIONAAAAAAAA
      let helper = {};
      let groupedNecesarios = mrp.subInfo.necesarios.reduce(function(r, o) {
        let key = o.noParte;
        if (!helper[key]) {
          helper[key] = Object.assign({}, o);
          r.push(helper[key]);
        } else {
          helper[key].cantidad =
            parseFloat(helper[key].cantidad) + parseFloat(o.cantidad);
        }
        return r;
      }, []);
      groupedNecesarios.forEach(element => {
        element.faltan = element.cantidad - element.stock;
        if (element.cantidad > element.stock) {
          if (element.tipo == "Buy Item") {
            mrp.subInfo.faltantesBI.push(element);
          }
          if (element.tipo == "Make Item") {
            mrp.subInfo.faltantesMI.push(element);
          }
        }
      });
      mrp.subInfo.groupedNecesarios = groupedNecesarios;
    },
    obtenerMateriasPrimas: async function(mrp) {
      let myUrl = process.env.VUE_APP_API + "obtenerMateriasPrimas.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        token: localStorage.token,
        items: mrp.subInfo.faltantesMI
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        mrp.isLoading = false;
        mrp.subInfo.materiasPrimas = respuesta.data.materiasPrimas;
        this.mrps = [...this.mrps];
      }
    },
    verDetalles: async function(mrp) {
      mrp.buysFiltrados = mrp.makesFiltrados = mrp.mpFiltrados = false;
      mrp.subInfo = {
        ensambles: [],
        faltantesBI: [],
        faltantesMI: [],
        porMaquinar: [],
        porComprar: [],
        necesarios: [],
        materiasPrimas: [],
        groupedNecesarios: []
      };
      mrp.expanded = !mrp.expanded;
      mrp.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerMRPItems.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        token: localStorage.token,
        mrpCode: mrp.mrpCode
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        mrp.isLoading = false;
        mrp.subInfo.necesarios = respuesta.data.necesarios;
        mrp.subInfo.ensambles = respuesta.data.ensambles;
        this.calcularFaltantesBI(mrp);
        this.obtenerMateriasPrimas(mrp);
        this.mrps = [...this.mrps];
      }
    },
    eliminarMRP: async function(mrp) {
      if (!confirm(`¿Estás seguro de que deseas eliminar: ${mrp.nombre}?`)) {
        return;
      }
      let myUrl = process.env.VUE_APP_API + "eliminarMRP.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        token: localStorage.token,
        mrpCode: mrp.mrpCode
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        mrp.isLoading = false;
        this.initialize();
      }
    },

    async exportBuyMake(items, nombre) {
      let itemsFormatted = [];
      let headers = {
        noParte: "No. Parte",
        descripcion: "Descripción",
        cantidad: "Necesario",
        stock: "Stock",
        faltantes: "Faltantes"
      };
      // format the data
      items.forEach(item => {
        itemsFormatted.push({
          noParte: item.noParte.replace(/,/g, ""), // remove commas to avoid errors,
          descripcion: item.descripcion.replace(/,/g, ""),
          cantidad: item.cantidad.replace(/,/g, ""),
          stock: item.stock,
          faltantes:
            item.stock - item.cantidad < 0
              ? (item.stock - item.cantidad) * -1
              : 0
        });
      });
      await exportCSVFile(headers, [...itemsFormatted], nombre);
      this.selected = [];
      return;
    }
  }
};
</script>
