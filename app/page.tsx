"use client";
import { redirect } from "next/navigation";
import { FunctionComponent, useEffect } from "react";

const IndexPage: FunctionComponent = () => {
  useEffect(() => {
    redirect("/user-management");
  }, []);

  return null;
};

export default IndexPage;
