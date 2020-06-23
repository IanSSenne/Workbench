import React from "react";
import "../scss/index.scss";
import Head from "next/head";
import { TopBar } from "../components/topbar";
export default (props) => {
  return (
    <>
      <Head>
        <style>{``}</style>
      </Head>
      <TopBar></TopBar>
    </>
  );
};
