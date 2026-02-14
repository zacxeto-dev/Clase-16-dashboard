import { useEffect,  useState } from 'react';
const API = "http://localhost:3000/users";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const ListUsers = () => {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const getDatos = async () => {
        setLoading(true);
        try {
            const response = await fetch(API);
            const data = await response.json();
            setDatos(data); // Asegúrate de que data sea un array
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDatos(); // Llamar a la función para obtener datos al cargar el componente
    }, []);



    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los datos: {error.message}</p>;

    return (
        <div className="p-4">
            <h4 className="text-center py-4 text-secondary">Listado de users</h4>
            <DataTable 
                value={datos} 
                showGridlines
                paginator
                rows={25}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm">
                <Column field="id" header="ID" className='text-center' />
                <Column field="name" header="Nombre y Apellido" className='text-center' />
                <Column field="email" header="Email" className='text-center' />
                <Column field="age" header="Edad" className='text-center' />
                
            </DataTable>
        </div>
    );
}


export default ListUsers