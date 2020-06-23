import React from "react";
import "../scss/index.scss";
import Head from "next/head";
import { TopBar } from "../components/topbar";
import { Wrap } from "../components/wrap";
export default (props) => {
  return (
    <Wrap>
      <Head>
        <style>{``}</style>
      </Head>
      <TopBar></TopBar>
    </Wrap>
  );
};
