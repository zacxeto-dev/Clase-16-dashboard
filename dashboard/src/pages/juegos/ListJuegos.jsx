import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Tag } from 'primereact/tag';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider"; // Importamos Divider para separar secciones  //Hecho con IA

const API = "http://localhost:3000/juegos";

const ListJuegos = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visible, setVisible] = useState(false);
  const [selectedJuego, setSelectedJuego] = useState(null);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const getDatos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API);
      const data = await response.json();
      setDatos(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatos();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
  };

  // Función para formatear dinero
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { // Ajusta 'es-CO' a tu moneda local (ej: 'es-VE', 'en-US')
      style: 'currency',
      currency: 'COP' // Ajusta a USD, VES, etc.
    }).format(value);
  };

  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";
    return (
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0 text-secondary">Gestión de Juegos</h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={value || ""}
            onChange={onGlobalFilterChange}
            placeholder="Buscar juego..."
            className="p-inputtext-sm"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  const handleViewDetails = (juego) => {
    setSelectedJuego(juego);
    setVisible(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex justify-content-center gap-2">
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          severity="info"
          onClick={() => handleViewDetails(rowData)}
          tooltip="Ver detalles"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          severity="success"
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          tooltip="Eliminar"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  // Plantillas para columnas personalizadas
  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.precio);
  };

  const statusBodyTemplate = (rowData) => {
    // Asumiendo que el API devuelve un ID o un string. Ajusta la lógica según tu API.
    const isActive = rowData.idestatus === 1 || rowData.estatus === 'Activo'; 
    return (
      <Tag 
        value={isActive ? "Activo" : "Inactivo"} 
        severity={isActive ? "success" : "danger"} 
      />
    );
  };

  // Footer para el modal
  const dialogFooter = (
    <div>
      <Button label="Cerrar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
    </div>
  );

  if (loading) return <div className="text-center p-5"><i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i></div>;
  if (error) return <p className="text-danger text-center">Error: {error.message}</p>;

  return (
    <div className="card p-4 shadow-sm m-4">
      <DataTable
        value={datos}
        showGridlines
        stripedRows
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        filters={filters}
        header={header}
        globalFilterFields={["nombre", "descripcion", "estatus", "precio", "genero"]}
        className="p-datatable-sm"
        emptyMessage="No se encontraron juegos."
      >
        <Column field="idjuego" header="ID" sortable className="text-center" style={{ width: '80px' }} />
        <Column field="nombre" header="Nombre" sortable style={{ fontWeight: 'bold' }} />
        <Column field="genero" header="Género" sortable className="text-center" />
        <Column field="precio" header="Precio" body={priceBodyTemplate} sortable className="text-center" />
        <Column field="estatus" header="Estatus" body={statusBodyTemplate} sortable className="text-center" />
        <Column header="Acciones" body={actionBodyTemplate} className="text-center" style={{ width: '180px' }} />
      </DataTable>

      {/* DIÁLOGO MEJORADO */}
      <Dialog
        visible={visible}
        style={{ width: "600px" }}
        header={
          <div className="d-flex align-items-center gap-2">
            <i className="pi pi-box text-primary" style={{ fontSize: '1.5rem' }}></i>
            <span className="text-xl font-bold">Detalles del Juego</span>
          </div>
        }
        modal
        footer={dialogFooter}
        onHide={() => setVisible(false)}
        className="p-fluid"
      >
        {selectedJuego && (
          <div className="p-2">
            
            {/* Cabecera con Nombre y ID */}
            <div className="d-flex justify-content-between align-items-center mb-3">
               <div>
                  <h2 className="m-0 text-primary">{selectedJuego.nombre}</h2>
                  <small className="text-muted">ID: {selectedJuego.idjuego || selectedJuego.id}</small>
               </div>
               <Tag 
                  value={selectedJuego.idestatus === 1 ? "DISPONIBLE" : "NO DISPONIBLE"} 
                  severity={selectedJuego.idestatus === 1 ? "success" : "danger"} 
                  icon={selectedJuego.idestatus === 1 ? "pi pi-check" : "pi pi-times"}
                />
            </div>

            <Divider />

            {/* Grid de detalles */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="d-block text-secondary mb-1">
                  <i className="pi pi-tag me-2"></i>Género
                </label>
                <div className="font-bold">{selectedJuego.genero || 'No especificado'}</div>
              </div>

              <div className="col-md-6 mb-3">
                <label className="d-block text-secondary mb-1">
                  <i className="pi pi-dollar me-2"></i>Precio
                </label>
                <div className="font-bold text-success" style={{ fontSize: '1.2rem' }}>
                  {formatCurrency(selectedJuego.precio)}
                </div>
              </div>
              
              {/* Puedes agregar más campos aquí si tu API los trae, ej: Plataforma, Fecha */}
              {/* 
              <div className="col-md-6 mb-3">
                <label className="d-block text-secondary mb-1">Plataforma</label>
                <div className="font-bold">{selectedJuego.plataforma}</div>
              </div> 
              */}
            </div>

            <Divider align="left">
                <div className="d-inline-flex align-items-center">
                    <i className="pi pi-align-left me-2"></i>
                    <b>Descripción</b>
                </div>
            </Divider>

            <div className="p-3 bg-light border rounded">
              <p className="m-0" style={{ lineHeight: '1.6', color: '#495057' }}>
                {selectedJuego.descripcion || "Sin descripción disponible."}
              </p>
            </div>

          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ListJuegos;