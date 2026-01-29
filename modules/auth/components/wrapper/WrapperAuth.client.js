"use client";

import { ContextAuth } from "@/modules/auth/context/ContextAuth";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { clientApi, setDataError, setDataSuccess } from "@/modules/general/libs/api";
import { defaultSetting as settings, defaultStyling } from "@/modules/general/libs/defaults";
import { deepMerge } from "@/modules/general/libs/merge.mjs";
import { toast } from "@/modules/general/libs/toast";
import { useEffect, useState } from "react";

export default function WrapperAuthClient({ authSession, children }) {
  const [session, setSession] = useState(authSession);
  const { setStyling } = useStyling();

  useEffect(() => {
    setSession(authSession);
    if (authSession?.styling) {
      setStyling(deepMerge(defaultStyling, authSession.styling));
    }
  }, [authSession, setStyling]);

  const updateProfile = async (data) => {
    // Optimistic update
    setSession((prev) => ({ ...prev, ...data }));

    // Update styling context if present in data,
    // because components like IconFavicon rely on useStyling()
    if (data.styling) {
      setStyling(deepMerge(defaultStyling, data.styling));
    }

    try {
      // The data object already contains everything we need including logo
      // because we're passing { ...inputs, styling, logo } from DashboardProfile
      const res = await clientApi.post(settings.paths.api.userUpdate, data);

      // If server returns updated data (e.g. with server-generated logo), update local state again
      if (res.data?.styling) {
        setStyling(deepMerge(defaultStyling, res.data.styling));
        setSession((prev) => ({ ...prev, styling: res.data.styling }));
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
    updateProfile,
  };

  return <ContextAuth.Provider value={value}>{children}</ContextAuth.Provider>;
}
