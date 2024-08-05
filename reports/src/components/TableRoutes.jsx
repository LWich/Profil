import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Layout from './Layout';

const UsersTable = lazy(() => import('./UsersTable'));
const GlobalTable = lazy(() => import('./GlobalTable'));
const ParseTaskTable = lazy(() => import('./ParseTaskTable'));
const ParseSettingsTable = lazy(() => import('./ParseSettingsTable'));
const ProductTable = lazy(() => import('./ProductTable'));
const CategoryTable = lazy(() => import('./CategoryTable'));
const ProductPriceTable = lazy(() => import('./ProductPriceTable'));
const StatusProductTable = lazy(() => import('./StatusProductTable'));
// Импортируйте остальные компоненты таблиц здесь с помощью React.lazy

const TableRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route
        path="users"
        element={
          <PrivateRoute>
            <Layout>
              <UsersTable />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="global"
        element={
          <PrivateRoute>
            <Layout>
              <GlobalTable />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="parse_task"
        element={
          <PrivateRoute>
            <Layout>
              <ParseTaskTable />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="parse_settings"
        element={
          <PrivateRoute>
            <Layout>
              <ParseSettingsTable />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="product"
        element={
          <PrivateRoute>
            <Layout>
              <ProductTable />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="category"
        element={
          <PrivateRoute>
            <Layout>
              <CategoryTable />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="product_price"
        element={
          <PrivateRoute>
            <Layout>
              <ProductPriceTable />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="statusproduct"
        element={
          <PrivateRoute>
            <Layout>
              <StatusProductTable />
            </Layout>
          </PrivateRoute>
        }
      />
      {/* Добавьте маршруты для остальных таблиц здесь */}
    </Routes>
  </Suspense>
);

export default TableRoutes;