<template>
  <div>
    <v-form v-model="valid">
      <div>
        <v-btn @click="abrir">Registro JOB</v-btn>

        <v-dialog v-model="open" persistent fullscreen hide-overlay>
          <v-card>
            <v-card-title>
              <span class="headline" v-if="isEditing">Editar JOB</span>
              <span class="headline" v-else>Agregar job</span>
              <v-col class="d-flex justify-end align-end"
                ><v-btn @click="cerrar" color="red" left x-small
                  >X</v-btn
                ></v-col
              >
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="3">
                    <v-select
                      label="Plantilla"
                      item-value="id"
                      item-text="id"
                      v-model="plantillaActiva"
                      :items="plantillas"
                      ><template v-slot:item="data">
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="data.item.dibujo"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="data.item.descripcion"
                          ></v-list-item-subtitle>
                        </v-list-item-content> </template
                    ></v-select>
                  </v-col>
                  <v-col cols="9"
                    ><v-btn @click="limpiar">Limpiar</v-btn></v-col
                  >
                  <v-col cols="3">
                    <v-autocomplete
                      label="Numero de Parte"
                      :items="materialesMP"
                      v-model="proceso.noParte"
                      item-value="noParte"
                      item-text="noParte"
                      ><template v-slot:item="data">
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="data.item.noParte"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="data.item.descripcion"
                          ></v-list-item-subtitle>
                        </v-list-item-content> </template
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="Descripcion"
                      v-model="proceso.descripcion"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="Cantidad Orden"
                      v-model="proceso.cantidadOrden"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="Cantidad fabricada"
                      v-model="proceso.cantidadFabricada"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="OC de cliente linea"
                      v-model="proceso.ocCliente"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="Dibujo"
                      v-model="proceso.dibujo"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-select
                      label="Tipo"
                      v-model="proceso.tipo"
                      :items="tipoJob"
                    ></v-select>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      label="Revision"
                      v-model="proceso.revision"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Notas OT"
                      v-model="proceso.notas"
                    ></v-textarea>
                    <v-divider></v-divider>
                    <br />
                    <h1>Lista de procesos</h1>
                    <br />
                    <v-btn @click="agregarProceso">Agregar proceso</v-btn>
                    <br />
                    <br />
                    <v-simple-table fixed-header height="500px" dense>
                      <thead>
                        <tr>
                          <th class="text-left">Operador</th>
                          <th class="text-left">
                            Clave de <br />
                            operacion
                          </th>
                          <th class="text-left">Descripcion</th>
                          <th class="text-left">Configurar</th>
                          <th class="text-left">Tasa Proceso</th>
                          <th class="text-left">Proceso</th>
                          <th class="text-left">Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, ind) in listaProcesos" :key="ind">
                          <td>
                            <v-text-field
                              style="width: 100px"
                              v-model="item.operador"
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              style="width: 80px"
                              v-model="item.claveOp"
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-textarea v-model="item.descripcion">
                            </v-textarea>
                          </td>
                          <td>
                            <v-text-field
                              style="width: 80px"
                              v-model="item.configurar"
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              style="width: 100px"
                              v-model="item.tasaProceso"
                              suffix="Hrs/Part"
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              style="width: 80px"
                              v-model="item.proceso"
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-btn
                              icon
                              @click="eliminarProceso(item)"
                              color="error"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                    <br />
                    <v-divider></v-divider>
                    <br />
                    <h1>Lista de materiales</h1>
                  </v-col>
                  <v-col cols="12" sm="12" md="3">
                    <v-text-field
                      label="Buscador de materiales"
                      prepend-inner-icon="mdi-magnify"
                      v-model="search"
                      dense
                    ></v-text-field>

                    <v-card max-width="400" class="mx-auto">
                      <v-virtual-scroll
                        :items="materialesFiltrados"
                        height="180"
                        item-height="50"
                      >
                        <template v-slot:default="{ item }">
                          <v-list-item
                            :key="item.id"
                            :draggable="true"
                            @dragstart="
                              ev => {
                                drag(ev, item.idRegistroMaterial);
                              }
                            "
                            @dblclick="agregarMaterial(item)"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ item.nombreMaterial }}
                                <v-icon small>
                                  mdi-arrow-right-thick
                                </v-icon>
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>

                          <v-divider></v-divider>
                        </template>
                      </v-virtual-scroll> </v-card
                    ><br />
                    <v-divider></v-divider>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="9"
                    @drop="drop"
                    @dragover="allowDrop"
                  >
                    <v-simple-table fixed-header height="250px" dense>
                      <thead>
                        <tr>
                          <th class="text-left">Material</th>
                          <th class="text-left">No. Parte</th>
                          <th class="text-left">Forma</th>
                          <th class="text-left">Descripcion</th>
                          <th class="text-left">Cantidad</th>
                          <th class="text-left">Medidas Requeridas</th>
                          <th class="text-left">Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, ind) in materialesRequeridos"
                          :key="ind"
                        >
                          <td>
                            <v-text-field
                              v-model="item.nombreMaterial"
                              readonly
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="item.noParte" readonly>
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="item.forma" readonly>
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field v-model="item.descripcion">
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              type="number"
                              v-model="item.cantidad"
                              :rules="numericRules"
                              :min="1"
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              type="number"
                              v-model="item.height"
                              :rules="numericRules"
                              :min="0"
                              label="altura"
                              v-if="item.forma == 'placa'"
                            >
                            </v-text-field>
                            <v-text-field
                              type="number"
                              v-model="item.longitud"
                              :rules="numericRules"
                              :min="0"
                              label="longitud"
                              v-if="item.forma"
                            >
                            </v-text-field>
                          </td>
                          <td>
                            <v-btn
                              icon
                              @click="eliminarMaterial(item)"
                              color="error"
                            >
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-end align-end">
                    <v-btn color="blue darken-1" text @click="cerrar">
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      :disabled="isSending"
                      text
                      @click="send()"
                    >
                      Enviar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-form>
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
    valid: false,
    file: null,
    search: "",
    plantillaActiva: "",
    tipoJob: ["Plantilla", "Registro"],
    plantillas: [],
    materiales: [],
    materialesRequeridos: [],
    archivosGuardados: [],
    proceso: { revision: 0 },
    listaProcesos: [],
    numericRules: [value => !value || value >= 0 || "Min. 0"]
  }),
  computed: {
    open() {
      return this.isOpen;
    },
    edit() {
      return this.isEditing;
    },
    idEdit() {
      return this.idEditing;
    },
    token() {
      return localStorage.token ? localStorage.token : "";
    },
    materialesMP() {
      let filtradas = this.materiales.filter(material => material.tipo == "MP");
      return filtradas;
    },
    materialesFiltrados() {
      if (this.search == "")
        return this.materiales.filter(material => material.idCentroCostos != 0);
      let myMaterials = this.materiales.filter(material =>
        matchStrings({
          s: this.search,
          str: material.nombreMaterial
        })
      );
      return myMaterials.filter(material => material.idCentroCostos != 0);
    }
  },

  watch: {
    idEditing() {
      if (this.isEditing) {
        this.materialesRequeridos = [];
        this.proceso = { revision: 0 };
        this.listaProcesos = [];
        this.getHojaProcesos(this.idEditing, false);
        this.getProcesos();
        this.getMaterialesRequeridos();
      }
    },
    plantillaActiva(value) {
      if (value) {
        this.listaProcesos = [];
        this.materialesRequeridos = [];
        this.getHojaProcesos(value, true);
      }
    }
  },

  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.isSending = false;
      this.getMateriales();
      this.getPlantillas();
    },
    abrir() {
      this.isSending = false;
      this.$emit("abrir");
      this.getMateriales();
      this.getPlantillas();
    },
    cerrar() {
      this.$emit("cerrar");
      this.materialesRequeridos = [];
      this.proceso = { revision: 0 };
      this.listaProcesos = [];
    },
    validate() {
      this.$refs.cantidad.validate();
    },

    agregarMaterial(item) {
      let repetidos = this.materialesRequeridos.filter(material => {
        if (material.idRegistroMaterial == item.idRegistroMaterial) {
          material.cantidad = parseInt(material.cantidad) + 1;
          return true;
        }
      });
      if (repetidos.length > 0) return true;
      this.materialesRequeridos.push({
        ...item,
        idRegistroMaterial: item.idRegistroMaterial,
        nombreMaterial: item.nombreMaterial,
        precio: 0,
        height: 0,
        longitud: 0,
        cantidad: 1
      });
    },

    eliminarMaterial(item) {
      this.materialesRequeridos = this.materialesRequeridos.filter(material => {
        if (material.idRegistroMaterial != item.idRegistroMaterial) {
          return true;
        }
      });
    },

    limpiar() {
      this.proceso = [];
      this.listaProcesos = [];
      this.materialesRequeridos = [];
      this.plantillaActiva = [];
    },

    agregarProceso() {
      let placeholder = {
        operador: "",
        claveOp: "",
        descripcion: "",
        configurar: "",
        tasaProceso: "",
        proceso: ""
      };
      this.listaProcesos.unshift(placeholder);
    },

    eliminarProceso(item) {
      this.listaProcesos = this.listaProcesos.filter(proceso => {
        if (proceso.claveOp != item.claveOp) {
          return true;
        }
      });
    },

    allowDrop(ev) {
      ev.preventDefault();
    },
    drag(ev, id) {
      ev.dataTransfer.setData("itemid", id);
    },
    drop(ev) {
      ev.preventDefault();
      let myId = ev.dataTransfer.getData("itemid");
      let myItem = this.materialesFiltrados.filter(
        item => item.idRegistroMaterial == myId
      )[0];
      this.agregarMaterial(myItem);
    },

    async getHojaProcesos(myId, plantilla) {
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: myId,
        tipo: "getOne",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.proceso = respuesta.data.rows[0];
        if (plantilla) {
          this.listaProcesos = respuesta.data.procesos;
          this.materialesRequeridos = respuesta.data.materiales;
          this.proceso = { ...this.proceso, tipo: "Registro" };
        }
      }
    },

    async getPlantillas() {
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAllPlantillas",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.plantillas = respuesta.data.rows;
      }
    },

    async getMateriales() {
      let myUrl = process.env.VUE_APP_API + "newModules/materiales.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: "getAll",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.materiales = respuesta.data.rows;
      }
    },

    async getMaterialesRequeridos() {
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: "getMaterials",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.materialesRequeridos = respuesta.data.rows;
      }
    },

    async getProcesos() {
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        tipo: "getProcesos",
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.listaProcesos = respuesta.data.rows;
      }
    },

    async send() {
      this.isSending = true;
      this.$toasted.show("Guardando...", {
        duration: 2000,
        position: "bottom-center"
      });
      let myUrl = process.env.VUE_APP_API + "newModules/listasProcesos.php";
      let myTipo = "insert";
      if (this.idEditing != 0) {
        myTipo = "update";
      }
      let respuesta = await axios.post(myUrl, {
        request: 1,
        id: this.idEditing,
        idEmpleado: localStorage.id,
        hojaProcesos: this.proceso,
        procesosRequeridos: this.listaProcesos,
        materialesRequeridos: this.materialesRequeridos,
        archivosGuardados: this.archivosGuardados,
        tipo: myTipo,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        if (myTipo == "insert")
          this.$toasted.success("Elemento enviado", {
            duration: 2000,
            position: "bottom-center"
          });
        if (myTipo == "update")
          this.$toasted.success("Elemento actualizado", {
            duration: 2000,
            position: "bottom-center"
          });
        this.isSending = false;
        this.sendCallback();
        this.cerrar();
      }
    }
  }
};
</script>

<style scoped></style>
