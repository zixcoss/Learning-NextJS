"use client"
import { getSession, userSelector } from "@/src/store/slices/userSlice";
import { store } from "@/src/store/store";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";

type Props = {};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    useEffect(() => {
      store.dispatch(getSession());
    },[]);

    return <div>{children}</div>;
}
