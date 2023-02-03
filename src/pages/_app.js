import "@/styles/globals.css";

import React from "react";
import Head from "next/head";
import Favicon from "@/components/Favicon";
import OpenGraph from "@/components/OpenGraph";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <Favicon />
        <OpenGraph />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
