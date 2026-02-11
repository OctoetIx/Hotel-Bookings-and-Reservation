"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get("/super-admin/users").then((res) => setUsers(res.data));
  }, []);

  const promote = async (id: string, role: User["role"]) => {
  await api.patch(`/super-admin/users/${id}/role`, { role });

  setUsers((prev) =>
    prev.map((u) => (u.id === id ? { ...u, role } : u))
  );
};


  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="pt-28 max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-6">User Management</h1>

        <table className="w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 space-x-2">
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => promote(u.id, "ADMIN")}
                      className="px-3 py-1 bg-black text-white rounded text-sm"
                    >
                      Make Admin
                    </button>
                  )}
                  {u.role !== "USER" && (
                    <button
                      onClick={() => promote(u.id, "USER")}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}