"use client";

import { ContextAuth } from "@/context/ContextAuth";
import { useState, useEffect } from "react";
import { clientApi, setDataError, setDataSuccess } from "@/libs/api";
import toast from "react-hot-toast";

export default function WrapperAuthClient({ authSession, children }) {
  const [session, setSession] = useState(authSession);

  useEffect(() => {
    setSession(authSession);
  }, [authSession]);

  const updateProfile = async (data) => {
    // Optimistic update
    setSession(prev => ({ ...prev, ...data }));

    try {
      const res = await clientApi.post("/api/user/update", data);

      setDataSuccess(res, (msg) => {
        toast.success(msg);
      });

      return true;
    } catch (error) {
      console.error("Profile update failed", error);

      // Use helper to extract and show specific error message
      const isHandled = setDataError(error.response || error, (msg) => {
        toast.error(msg);
      });

      if (!isHandled) {
        toast.error("Failed to update profile");
      }

      // Revert on failure
      setSession(authSession);
      return false;
    }
  };

  const value = {
    ...session,
    updateProfile
  };

  return (
    <ContextAuth.Provider value={value}>
      {children}
    </ContextAuth.Provider>
  );
}
