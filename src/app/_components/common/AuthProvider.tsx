"use client"
import { getSession } from "@/src/store/slices/userSlice";
import { store } from "@/src/store/store";
import React, { useEffect } from "react";

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
