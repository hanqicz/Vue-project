<style scoped>
.breakLine {
  height: 6px;
}
</style>
<template>
  <v-app>
    <v-navigation-drawer fixed temporary v-model="drawer">
      <v-list v-if="autenticado">
        <v-list-item class="px-2">
          <v-list-item-avatar
            :color="
              getRandomColor(
                '' + usuario.nombres[0] + usuario.apellidoPaterno[0]
              )
            "
          >
            <img
              v-if="usuario.imagen"
              :src="usuario.imagen"
              :alt="usuario.correo"
            />
            <span v-if="!usuario.imagen && usuario.correo" class="iniciales"
              >{{ usuario.nombres[0] }}{{ usuario.apellidoPaterno[0] }}</span
            >
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              >{{ usuario.nombres.substr(0, usuario.nombres.indexOf(" ")) }}
              {{ usuario.apellidoPaterno }}</v-list-item-title
            >
            <v-list-item-subtitle>{{ usuario.correo }}</v-list-item-subtitle>
            <v-list-item-subtitle>
              <router-link to="/Login"> Cerrar sesión </router-link>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="px-2">
          <v-list-item-subtitle>
            <modal-password />
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-group
          v-for="(seccion, ind) in secciones"
          :key="ind"
          :value="false"
          :prepend-icon="seccion.icon"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ seccion.nombre }}</v-list-item-title>
          </template>

          <v-list-item
            v-for="(subseccion, i) in seccion.subsecciones"
            :key="i"
            class="ml-2"
            link
            :to="subseccion.link"
          >
            <v-list-item-icon>
              <v-icon>{{ subseccion.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ subseccion.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item class="px-2">
          <v-switch
            v-model="isDarkTheme"
            hide-details
            dense
            inset
            label="Tema oscuro"
          ></v-switch>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-card flat v-if="autenticado">
      <v-toolbar flat dense>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-toolbar>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import router from "../../router";
import axios from "axios";
import ModalPassword from "./Modals/ModalPassword";
export default {
  name: "MainPage",
  components: { ModalPassword },
  data: () => ({
    isDarkTheme: false,
    drawer: false,
    autenticado: false,
    checkCounter: localStorage.checkCounter,
    usuario: {
      id: 0,
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      titulo: "",
      puesto: "",
      correo: ""
    },
    checks: [],
    isLoadingJBLink: false,
    conectado: false,
    JBLink: "",
    JBUser: "",
    JBPass: ""
  }),
  watch: {
    isDarkTheme(value) {
      if (value) {
        this.$vuetify.theme.dark = true;
        localStorage.isDarkTheme = true;
      } else {
        this.$vuetify.theme.dark = false;
        localStorage.isDarkTheme = false;
      }
    }
  },

  computed: {
    permisosUsuarios() {
      return this.$store.state.permisosUsuarios;
    },
    secciones() {
      let misSecciones = [
        {
          nombre: "Usuarios y Permisos",
          icon: "mdi-account-lock",
          subsecciones: [
            {
              nombre: "Usuarios",
              link: "/Usuarios",
              icon: "mdi-account-group",
              permiso: 1
            },
            {
              nombre: "Permisos",
              link: "/Permisos",
              icon: "mdi-lock",
              permiso: 2
            }
          ]
        },
        {
          nombre: "BOM & Inventario",
          icon: "mdi-format-list-bulleted-square",
          subsecciones: [
            {
              nombre: "BOM",
              link: "/BOM",
              icon: "mdi-graph-outline",
              permiso: 3
            },
            {
              nombre: "Inventario",
              link: "/Inventario",
              icon: "mdi-clipboard-list",
              permiso: 4
            },
            {
              nombre: "MRP",
              link: "/MRP",
              icon: "mdi-cards-variant",
              permiso: 5
            }
          ]
        },
        {
          nombre: "Finanzas",
          icon: "mdi-currency-usd",
          subsecciones: [
            {
              nombre: "Cuentas por cobrar",
              link: "/CuentasCobrar",
              icon: "mdi-cash-lock-open",
              permiso: 6
            }
          ]
        },
        {
          nombre: "Normativa",
          icon: "mdi-list-status",
          subsecciones: [
            {
              nombre: "Plantillas de hojas normativas",
              link: "/HojasNormativas",
              icon: "mdi-page-previous",
              permiso: 7
            },
            {
              nombre: "Hojas normativas publicadas",
              link: "/HojasNormativasPublicadas",
              icon: "mdi-page-previous-outline",
              permiso: 8
            },
            {
              nombre: "Mi checklist",
              link: "/ChecksUsuario",
              icon: "mdi-format-list-checks",
              permiso: 9
            }
          ]
        },
        {
          nombre: "Formación",
          icon: "mdi-book-open",
          subsecciones: [
            {
              nombre: "Empleados",
              link: "/ListasAsistenciaEmpleados",
              icon: "mdi-list-status",
              permiso: 10
            },
            /* {
              nombre: "Areas",
              link: "/Areas",
              icon: "mdi-google-circles-extended",
              permiso: 11,
            }, */
            {
              nombre: "Requisitos formativos",
              link: "/Requisitos",
              icon: "mdi-view-list-outline",
              permiso: 12
            },
            {
              nombre: "Mis requisitos",
              link: "/misRequisitos",
              icon: "mdi-view-list",
              permiso: 13
            }
          ]
        },
        {
          nombre: "Compras",
          icon: "mdi-shopping",
          subsecciones: [
            /* {
              nombre: "Mis Solicitudes de compras",
              link: "/MisComprasSolicitudes",
              icon: "mdi-view-list-outline",
              permiso: 17
            },
            {
              nombre: "Solicitudes de compras",
              link: "/ComprasSolicitudes",
              icon: "mdi-view-list-outline",
              permiso: 14
            },
            {
              nombre: "Proveedores",
              link: "/Proveedores",
              icon: "mdi-view-list-outline",
              permiso: 16
            } */
            {
              nombre: "Requisicion de materiales",
              link: "/RequisicionMateriales",
              icon: "mdi-view-list-outline",
              permiso: 1
            },
            {
              nombre: "Cotizaciones",
              link: "/Cotizaciones",
              icon: "mdi-cash-multiple",
              permiso: 1
            },
            {
              nombre: "Ordenes de compra",
              link: "/OrdenesCompras",
              icon: "mdi-file-outline",
              permiso: 1
            }
          ]
        },
        {
          nombre: "Almacen",
          icon: "mdi-archive",
          subsecciones: [
            {
              nombre: "Entrada de inventario",
              link: "/EntradaInventario",
              icon: "mdi-archive-arrow-down",
              permiso: 1
            },
            {
              nombre: "Verificacion de almacen",
              link: "/VerificacionAlmacen",
              icon: "mdi-order-bool-ascending-variant",
              permiso: 1
            },
            {
              nombre: "Salida de invetario",
              link: "/SalidaInventario",
              icon: "mdi-archive-arrow-up",
              permiso: 1
            },
            {
              nombre: "Sala de suministro",
              link: "/SalaSuministro",
              icon: "mdi-hammer-wrench",
              permiso: 1
            }
          ]
        },
        {
          nombre: "Procesos",
          icon: "mdi-factory",
          subsecciones: [
            {
              nombre: "Procesos",
              link: "/Procesos",
              icon: "mdi-factory",
              permiso: 1
            }
          ]
        },
        {
          nombre: "Administración de Sistema",
          icon: "mdi-security",
          subsecciones: [
            {
              nombre: "Materiales",
              link: "/RegistrosMateriales",
              icon: "mdi-table-row-plus-after",
              permiso: 1
            },
            {
              nombre: "Clases",
              link: "/Clases",
              icon: "mdi-shape",
              permiso: 1
            },
            {
              nombre: "Locaciones",
              link: "/Locaciones",
              icon: "mdi-office-building-marker",
              permiso: 1
            },
            {
              nombre: "Ubicaciones",
              link: "/RegistrosUbicaciones",
              icon: "mdi-map-marker",
              permiso: 1
            },
            {
              nombre: "Clientes",
              link: "/RegistrosClientes",
              icon: "mdi-account-cash",
              permiso: 1
            },
            {
              nombre: "Servicios Externos",
              link: "/ServiciosExternos",
              icon: "mdi-truck",
              permiso: 1
            },
            {
              nombre: "Centros de Trabajo",
              link: "/CentrosTrabajo",
              icon: "mdi-account-hard-hat",
              permiso: 1
            },
            {
              nombre: "Operaciones",
              link: "/Operaciones",
              icon: "mdi-cog-transfer",
              permiso: 1
            },
            {
              nombre: "Tipo de Materiales",
              link: "/TipoMateriales",
              icon: "mdi-file-tree",
              permiso: 1
            },
            {
              nombre: "Proveedores",
              link: "/Proveedores2",
              icon: "mdi-table-row-plus-after",
              permiso: 1
            },
            {
              nombre: "Personal",
              link: "/Personal",
              icon: "mdi-table-row-plus-after",
              permiso: 1
            },
            {
              nombre: "OrdenVenta",
              link: "/OrdenVenta",
              icon: "mdi-table-row-plus-after",
              permiso: 1
            },
            {
              nombre: "Permisos",
              link: "/Permisos2",
              icon: "mdi-table-row-plus-after",
              permiso: 1
            }
          ]
        }
      ];
      let onlyMisPermisos = [];
      if (this.permisosUsuarios) {
        onlyMisPermisos = this.permisosUsuarios
          .filter(permiso => this.usuario.id == permiso.idUsuario)
          .map(permiso => {
            return permiso.idPermiso;
          });
        misSecciones = misSecciones
          .filter(seccion => {
            let mySeccion = seccion,
              ponerSeccion = false;
            if (mySeccion.subsecciones.length > 0) {
              mySeccion.subsecciones = mySeccion.subsecciones.filter(
                subseccion => {
                  let tengoPermiso = false;
                  onlyMisPermisos.map(miPermiso => {
                    if (miPermiso == subseccion.permiso) {
                      tengoPermiso = true;
                      ponerSeccion = true;
                    }
                  });
                  return tengoPermiso;
                }
              );
            }
            return ponerSeccion;
          })
          .map(seccion => {
            let mySeccion = seccion;
            if (mySeccion.subsecciones.length > 0) {
              mySeccion.subsecciones = mySeccion.subsecciones.filter(
                subseccion => {
                  let tengoPermiso = false;
                  onlyMisPermisos.map(miPermiso => {
                    if (miPermiso == subseccion.permiso) tengoPermiso = true;
                  });
                  return tengoPermiso;
                }
              );
            }
            return mySeccion;
          });
        return misSecciones;
      } else return [];
    }
  },
  created: function() {
    this.testToken();
    this.setTheme();
  },
  mounted: function() {
    if (localStorage.apellidoPaterno) {
      this.usuario.id = localStorage.id;
      this.usuario.apellidoPaterno = localStorage.apellidoPaterno;
      this.usuario.apellidoMaterno = localStorage.apellidoMaterno;
      this.usuario.puesto = localStorage.puesto;
      this.usuario.titulo = localStorage.titulo;
      this.usuario.nombres = localStorage.nombres;
      this.usuario.correo = localStorage.correo;
    }
    this.getPermisos();
    this.getChecks();
  },
  methods: {
    focusNext(e) {
      const inputs = Array.from(e.target.form.querySelectorAll("input"));
      const index = inputs.indexOf(e.target);

      if (index < inputs.length) {
        inputs[index + 1].focus();
      }
    },
    setTheme() {
      if (localStorage.isDarkTheme == "true") {
        this.isDarkTheme = true;
      } else {
        this.isDarkTheme = false;
      }
    },
    async testToken() {
      let myUrl = process.env.VUE_APP_API + "newModules/testToken.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        idUsuario: localStorage.id,
        token: localStorage.token
      });
      if (respuesta.data.status == "Error") {
        if (router.path !== "/Login" && router.path !== "")
          router.replace({ path: "/Login" });
      }
      if (respuesta.data.status == "Ok") {
        this.autenticado = true;
      }
    },
    async getChecks() {
      this.isJBSyncing = true;
      let myUrl = process.env.VUE_APP_API + "obtenerNomChecksUsuario.php";

      let respuesta = await axios.post(myUrl, {
        request: 1,
        idUsuario: localStorage.id,
        token: localStorage.token
      });
      if (respuesta) {
        this.checks = respuesta.data.rows;
      }

      let checksNoCompletados = this.checks.filter(item => {
        return (
          item.checked == "false" || item.checked == false || item.checked == 0
        );
      });
      if (checksNoCompletados)
        localStorage.checkCounter = checksNoCompletados.length;
      else localStorage.checkCounter = 0;

      console.log(this.checkCounter);
    },
    async getJBLink() {
      this.isLoadingJBLink = true;
      let respuesta = await axios.post(
        process.env.VUE_APP_API + "obtenerJBLink.php",
        {
          request: 1,
          token: localStorage.token
        }
      );
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.isLoadingJBLink = false;
        this.conectado = true;
        this.JBLink = respuesta.data.rows[0].link;
        this.JBUser = respuesta.data.JBUser;
        this.JBPass = respuesta.data.JBPass;
        localStorage.JBLink = this.JBLink;
        localStorage.JBUser = this.JBUser;
        localStorage.JBPass = this.JBPass;

        //Obtener el nombre de usuario y contraseña para acceder a la API que hiciste

        this.$toasted.success("Enlace de seguridad obtenido").goAway(2000);
      }
    },
    async getPermisos() {
      this.isLoading = true;
      let myUrl = process.env.VUE_APP_API + "obtenerPermisos.php";
      let respuesta = await axios.post(myUrl, {
        request: 1,
        tipo: this.tipoSeleccionado,
        token: localStorage.token
      });
      localStorage.token = respuesta.data.token;
      if (respuesta.data.status == "Ok") {
        this.$store.commit("setPermisosUsuarios", {
          permisos: respuesta.data.permisosUsuarios
        });
        this.isLoading = false;
      }
    },
    getRandomColor(nombre) {
      let myColors = [
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
        "yellow",
        "amber",
        "orange",
        "deep-orange",
        "brown",
        "blue-grey",
        "grey"
      ];

      let myTones = ["lighten-1", "darken-1", "darken-2"];
      let myIndex1,
        myIndex2 = 0;
      if (nombre.length > 1) {
        myIndex1 = nombre.charCodeAt(1) % (myColors.length - 1);
        if (nombre.length > 1) {
          myIndex2 = nombre.charCodeAt(1) % (myTones.length - 1);
        } else {
          myIndex2 = nombre.charCodeAt(0) % (myTones.length - 1);
        }
      } else {
        myIndex1 = myColors.length - 1;
        myIndex2 = myTones.length - 1;
      }
      /* console.log(myTones);
      console.log(myColors);
      console.log(myIndex1);
      console.log(myIndex2); */
      return `${myColors[myIndex1]} ${myTones[myIndex2]}`;
    }
  }
};
</script>
