import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Aside from './components/Aside';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import ListGeneros from './pages/generos/ListGeneros';
import Listfabricantes from './pages/fabricantes/Listfabricantes';
import ListJuegos from './pages/juegos/ListJuegos';
import Listplataformas from './pages/plataforma/Listplataformas';
import ListUsers from './pages/usuarios/ListUser';

// Importación dinámica de los componentes
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));

const App = () => {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <div className="content-wrapper">
          <Aside />
          <div className="content">
            <Header />
            <div className='app'>
              <Routes>
                <Route path="/" element={<Content />}>
                  <Route index element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/listgeneros" element={<ListGeneros />} />
                  <Route path="/listfabricantes" element={<Listfabricantes />} />
                  <Route path="/listjuegos" element={<ListJuegos/>} />
                  <Route path="/listplataformas" element={<Listplataformas/>} />
                  <Route path="/listusuarios" element={<ListUsers/>} />
                </Route>
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;