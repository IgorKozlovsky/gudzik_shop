import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useUserContext } from "..";
import Shop from "../pages/Shop";
import { authRoutes, publicRoutes } from "../routes";

const AppRouter = () => {
  const { user } = useUserContext();

  return (
    <Routes>
      {user?.isAuth &&
        authRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Shop />} />
    </Routes>
  );
};

export default AppRouter;
