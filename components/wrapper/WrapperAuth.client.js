"use client";

import { ContextAuth } from "@/context/ContextAuth";
import { useState, useEffect } from "react";
import { clientApi, setDataError, setDataSuccess } from "@/libs/api";
import toast from "react-hot-toast";

import { useStyling } from "@/context/ContextStyling";

export default function WrapperAuthClient({ authSession, children }) {
  const [session, setSession] = useState(authSession);
  const { setStyling } = useStyling();

  useEffect(() => {
    setSession(authSession);
    if (authSession?.styling) {
      setStyling(authSession.styling);
    }
  }, [authSession, setStyling]);

  const updateProfile = async (data) => {
    // Optimistic update
    setSession(prev => ({ ...prev, ...data }));

    // Update styling context if present in data, 
    // because components like IconFavicon rely on useStyling()
    if (data.styling) {
      setStyling(data.styling);
    }

    try {
      // The data object already contains everything we need including logo 
      // because we're passing { ...inputs, styling, logo } from DashboardProfile
      const res = await clientApi.post("/api/user/update", data);

      // If server returns updated data (e.g. with server-generated logo), update local state again
      if (res.data?.styling) {
        setStyling(res.data.styling);
        setSession(prev => ({ ...prev, styling: res.data.styling }));
      }

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
