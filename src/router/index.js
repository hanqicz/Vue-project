import Vue from "vue";
import VueRouter from "vue-router";
import LoginPage from "../components/Pages/LoginPage.vue";
import MainPage from "../components/Pages/MainPage.vue";
import Usuarios from "../components/Pages/Contents/Usuarios.vue";
import Permisos from "../components/Pages/Contents/Permisos.vue";
import BOM from "../components/Pages/Contents/BOM.vue";
import ItemsJB from "../components/Pages/Contents/ItemsJB.vue";
import NomSheetsTemplates from "../components/Pages/Contents/NomSheetsTemplates.vue";
import NomSheetsPublicadas from "../components/Pages/Contents/NomSheetsPublicadas.vue";
import BuyItem from "../components/Pages/Contents/BuyItem.vue";
import MakeItem from "../components/Pages/Contents/MakeItem.vue";
import MateriaPrima from "../components/Pages/Contents/MateriaPrima.vue";
import Ensamble from "../components/Pages/Contents/Ensamble.vue";
import DetallesCompra from "../components/Pages/Contents/DetallesCompra.vue";
import CuentaCobrar from "../components/Pages/Contents/CuentaCobrar.vue";
import ComprasSolicitudes from "../components/Pages/Contents/ComprasSolicitudes.vue";
import MisComprasSolicitudes from "../components/Pages/Contents/MisComprasSolicitudes.vue";
import ComprasOrdenes from "../components/Pages/Contents/ComprasOrdenes.vue";
import Proveedores from "../components/Pages/Contents/Proveedores.vue";
import MRP from "../components/Pages/Contents/MRP.vue";
import CuentasCobrar from "../components/Pages/Contents/CuentasCobrar.vue";
import NomChecks from "../components/Pages/Contents/NomChecks.vue";
import NomChecksUsuario from "../components/Pages/Contents/NomChecksUsuario.vue";
import NomChecksPublicados from "../components/Pages/Contents/NomChecksPublicados.vue";
import ListasAsistenciaEmpleados from "../components/Pages/Contents/ListasAsistenciaEmpleados.vue";
import Areas from "../components/Pages/Contents/Areas.vue";
import Requisitos from "../components/Pages/Contents/RequisitosFormativos.vue";
import MisRequisitos from "../components/Pages/Contents/MisRequisitos.vue";
import RequisitosUsuario from "../components/Pages/Contents/RequisitosUsuario.vue";
import UsuariosRequisito from "../components/Pages/Contents/UsuariosRequisito.vue";
import RequisicionMat from "../components/Pages/Contents/RequisicionMateriales.vue";
import ReqMatDetalles from "../components/Pages/Contents/ReqMatDetalles.vue";
import Cotizaciones from "../components/Pages/Contents/Cotizaciones.vue";
import CotizacionesDetalles from "../components/Pages/Contents/CotizacionesDetalles.vue";
import NewOrdenesCompras from "../components/Pages/Contents/NewOrdenesCompras.vue";
import OrdenesComprasDetalles from "../components/Pages/Contents/OrdenesComprasDetalles.vue";
import EntradaInventario from "../components/Pages/Contents/EntradaInventario.vue";
import SalidaInventario from "../components/Pages/Contents/SalidaInventario.vue";
import SalaSuministro from "../components/Pages/Contents/SalaSuministro.vue";
import VerificacionAlmacen from "../components/Pages/Contents/VerificacionAlmacen.vue";
import RegistrosMateriales from "../components/Pages/Contents/RegistrosMateriales.vue";
import Procesos from "../components/Pages/Contents/Procesos.vue";
import ProcesosDetalles from "../components/Pages/Contents/ProcesosDetalles.vue";
import Clases from "../components/Pages/TablasObjetos/Clases.vue";
import Ubicaciones from "../components/Pages/TablasObjetos/Ubicaciones.vue";
import Locaciones from "../components/Pages/TablasObjetos/Locaciones.vue";
import RegistrosClientes from "../components/Pages/TablasObjetos/Clientes.vue";
import ServiciosExternos from "../components/Pages/TablasObjetos/ServiciosExternos.vue";
import CentrosTrabajo from "../components/Pages/TablasObjetos/CentrosTrabajo.vue";
import Operaciones from "../components/Pages/TablasObjetos/Operaciones.vue";
import TipoMateriales from "../components/Pages/TablasObjetos/TipoMateriales.vue";
import Proveedores2 from "../components/Pages/TablasObjetos/Proveedores2.vue";
import Personal from "../components/Pages/TablasObjetos/Personal.vue";
import OrdenVenta from "../components/Pages/TablasObjetos/OrdenVenta.vue";
import Permisos2 from "../components/Pages/TablasObjetos/Permisos.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/Login",
    name: "Login",
    component: LoginPage
  },
  {
    path: "/",
    name: "Home",
    component: MainPage,
    children: [
      { path: "Usuarios", component: Usuarios },
      { path: "Permisos", component: Permisos },
      { path: "BOM", component: BOM },
      { path: "Inventario", component: ItemsJB },
      { path: "Areas", component: Areas },
      { path: "Requisitos", component: Requisitos },
      { path: "MisRequisitos", component: MisRequisitos },
      { path: "CumplimientoUsuario/:id", component: RequisitosUsuario },
      { path: "CumplimientoRequisito/:id", component: UsuariosRequisito },
      { path: "HojasNormativas", component: NomSheetsTemplates },
      { path: "HojasNormativasPublicadas", component: NomSheetsPublicadas },
      {
        path: "ListasAsistenciaEmpleados",
        component: ListasAsistenciaEmpleados
      },
      { path: "MRP", component: MRP },
      { path: "CuentasCobrar", component: CuentasCobrar },
      { path: "BuyItem", component: BuyItem },
      { path: "MakeItem/:id", component: MakeItem },
      { path: "MateriaPrima", component: MateriaPrima },
      { path: "HojaNormativa/:id", component: NomChecks },
      { path: "ChecksUsuario", component: NomChecksUsuario },
      { path: "HojaNormativaPublicada/:id", component: NomChecksPublicados },
      { path: "Ensamble/:id", component: Ensamble },
      { path: "DetallesCompra/:id", component: DetallesCompra },
      { path: "CuentaCobrar/:id?", component: CuentaCobrar },
      { path: "ComprasSolicitudes/", component: ComprasSolicitudes },
      { path: "MisComprasSolicitudes/", component: MisComprasSolicitudes },
      { path: "ComprasOrdenes/", component: ComprasOrdenes },
      { path: "Proveedores/", component: Proveedores },
      { path: "RequisicionMateriales", component: RequisicionMat },
      { path: "RequisicionMateriales/:id", component: ReqMatDetalles },
      { path: "Cotizaciones", component: Cotizaciones },
      { path: "CotizacionesDetalles/:id", component: CotizacionesDetalles },
      { path: "OrdenesCompras", component: NewOrdenesCompras },
      { path: "OrdenesComprasDetalles/:id", component: OrdenesComprasDetalles },
      { path: "EntradaInventario", component: EntradaInventario },
      { path: "VerificacionAlmacen", component: VerificacionAlmacen },
      { path: "SalidaInventario", component: SalidaInventario },
      { path: "SalaSuministro", component: SalaSuministro },
      { path: "RegistrosMateriales", component: RegistrosMateriales },
      { path: "Procesos", component: Procesos },
      { path: "ProcesosDetalles/:id", component: ProcesosDetalles },
      { path: "RegistrosUbicaciones", component: Ubicaciones },
      { path: "Clases", component: Clases },
      { path: "RegistrosUbicaciones", component: Ubicaciones },
      { path: "Locaciones", component: Locaciones },
      { path: "RegistrosClientes", component: RegistrosClientes },
      { path: "ServiciosExternos", component: ServiciosExternos },
      { path: "CentrosTrabajo", component: CentrosTrabajo },
      { path: "Operaciones", component: Operaciones },
      { path: "TipoMateriales", component: TipoMateriales },
      { path: "Proveedores2", component: Proveedores2 },
      { path: "Personal", component: Personal },
      { path: "OrdenVenta", component: OrdenVenta },
      { path: "Permisos2", component: Permisos2 }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/app/",
  routes
});

export default router;
