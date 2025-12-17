"use client";
import Head from "next/head";

export default function WrapperHead({ children }) {
  return (
    <Head>
      {children}
    </Head>
  )
}