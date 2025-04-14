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

    const router = useRouter();
    const path = usePathname();
    const userReducer = useSelector(userSelector);

    if(userReducer.isAuthenticating){
      return (
        <Loading />
      );
    }

    if(path !== "/login" && path !== "/register"){
      if(!userReducer.isAuthenticated){
        router.push(`/login`);
        return <Loading />;
      }else if(path == "/"){
        router.push(`/stock`);
        return <Loading />;
      }
    }else{
      if(userReducer.isAuthenticated){
        router.push(`/stock`);
        return <Loading />;
      }
    }

    return <div>{children}</div>;
}
