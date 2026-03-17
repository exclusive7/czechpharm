import { useEffect, useState } from "react";
import {
  fetchAdminMe,
  loginAdmin,
  logoutAdmin,
} from "../data/adminAuthStore";
import { AdminAuthContext } from "./AdminAuthContextObject";

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);

    try {
      const nextUser = await fetchAdminMe();
      setUser(nextUser);
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      setLoading(true);

      try {
        const nextUser = await fetchAdminMe();

        if (!active) {
          return;
        }

        setUser(nextUser);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login: async (credentials) => {
      const nextUser = await loginAdmin(credentials);
      setUser(nextUser);
      return nextUser;
    },
    logout: async () => {
      await logoutAdmin();
      setUser(null);
    },
    refresh,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
