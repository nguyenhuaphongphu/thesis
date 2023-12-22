import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/user/Login.jsx";
import Register from "./component/user/Register.jsx";
import AdminBranch from "./component/admin/AdminBranch.jsx";
import AdminSupplier from "./component/admin/AdminSupplier.jsx";
import AdminDetailBill from "./component/admin/AdminDetailBill.jsx";
import AdminTag from "./component/admin/AdminTag.jsx";
import AdminType from "./component/admin/AdminType.jsx";
import AdminBrand from "./component/admin/AdminBrand.jsx";
import AdminUser from "./component/admin/AdminUser.jsx";
import AdminNewProduct from "./component/admin/AdminNewProduct.jsx";
import GrantAccess from "./component/admin/GrantAccess.jsx";
import AdminStatistical from "./component/admin/AdminStatistical.jsx";
import ManagerBill from "./component/manager/ManagerBill.jsx";
import ManagerProduct from "./component/manager/ManagerProduct.jsx";
import ManagerImportProduct from "./component/manager/ManagerImportProduct.jsx";
import ManagerImportOrder from "./component/manager/ManagerImportOrder.jsx";
import AdminDetailImportOrder from "./component/admin/AdminDetailImportOrder.jsx";
import ManagerUser from "./component/manager/ManagerUser.jsx";
import ManagerStatistical from "./component/manager/ManagerStatistical.jsx";
import SideBar from "./sidebar/SideBar.jsx";
import LandingPage from "./LandingPage.jsx";
import DetailProduct from "./component/user/DetailProduct.jsx";
import "./index.css";
import ProductList from "./component/user/ProductList.jsx";
import HistoryBought from "./component/user/HistoryBought.jsx";
import DetailBill from "./component/user/DetailBill.jsx";
import DetailInfoUser from "./component/user/DetailInfoUser.jsx";
import ArticlesFashion from "./sidebar/ArticlesFashion.jsx";
import ResetPassword from "./component/user/ResetPassword.jsx";
import ManagerEmail from "./component/manager/ManagerEmail.jsx";
import ManagerInfoCustomer from "./component/manager/ManagerInfoCustomer.jsx";
import AdminRoute from "./component/private-route/AdminRoute.jsx";
import UpdateRoute from "./component/private-route/UpdateRoute.jsx";
import SellRoute from "./component/private-route/SellRoute.jsx";
import ManagerRoute from "./component/private-route/ManagerRoute.jsx";
import ManagerGrantAccess from "./component/manager/ManagerGrantAccess.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<SideBar />}>
          <Route exact element={<AdminRoute />}>
            <Route path="/user" element={<AdminUser />} />
            <Route path="/branch" element={<AdminBranch />} />
            <Route path="/statisticals" element={<AdminStatistical />} />
            <Route path="/grantaccess/:id" element={<GrantAccess />} />
          </Route>

          <Route exact element={<ManagerRoute />}>
            <Route
              path="/statisticalManager"
              element={<ManagerStatistical />}
            />
            <Route path="/emailCustomer" element={<ManagerEmail />} />
            <Route path="/userManager" element={<ManagerUser />} />
            <Route path="/grantaccessManager/:id" element={<ManagerGrantAccess />} />
          </Route>

          <Route exact element={<UpdateRoute />}>
            <Route path="/brand" element={<AdminBrand />} />
            <Route path="/supplier" element={<AdminSupplier />} />
            <Route path="/tag" element={<AdminTag />} />
            <Route path="/productCaterogy" element={<AdminType />} />
            <Route path="/product/new" element={<AdminNewProduct />} />
            <Route path="/product" element={<ManagerProduct />} />
            <Route path="/importProduct" element={<ManagerImportProduct />} />
            <Route path="/importOrder" element={<ManagerImportOrder />} />
            <Route
              path="/detailImportOrder/:id"
              element={<AdminDetailImportOrder />}
            />
          </Route>

          <Route exact element={<SellRoute />}>
            <Route path="/detailbill/:id" element={<AdminDetailBill />} />
            <Route path="/bill" element={<ManagerBill />} />
            <Route path="/inforCustomer" element={<ManagerInfoCustomer />} />
          </Route>
        </Route>

        <Route path="/historyBought" element={<HistoryBought />} />
        <Route path="/productList/:id" element={<ProductList />} />
        <Route path="*" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/bill/:id" element={<DetailBill />} />
        <Route path="/detailUser" element={<DetailInfoUser />} />
        <Route path="/articles" element={<ArticlesFashion />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
