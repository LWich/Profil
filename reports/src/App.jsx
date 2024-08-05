import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import { ApiProvider } from './components/ApiContext';

const TableRoutes = lazy(() => import('./components/TableRoutes'));


function App() {
  return (
    <ApiProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </PrivateRoute>
              }
            />
            {/* Подключаем TableRoutes */}
            <Route path="/table/*" element={<TableRoutes />} />
          </Routes>
        </Suspense>
      </Router>
    </ApiProvider>
  );
}

export default App;