import React from 'react';
import { Outlet } from "react-router-dom";
import '../css/main.css';
import Footer from "../layout/Footer.jsx";
import Header from "../layout/Header.jsx";
export default function Body() {
  return (
    <>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
  );
}
