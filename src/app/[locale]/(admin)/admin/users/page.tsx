import ComponentCard from "@/components/common/component-card";
import PageBreadcrumb from "@/components/common/page-breadcrumb";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { changeUserRole } from "@/lib/admin/actions";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users | Admin" };

export default async function UsersPage() {
  const [session, users] = await Promise.all([
    auth(),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <PageBreadcrumb pageTitle="Users" />
      <ComponentCard title={`Registered users (${users.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400"><tr><th className="px-3 py-3 text-start">Name</th><th className="px-3 py-3 text-start">Email</th><th className="px-3 py-3 text-start">Role</th><th className="px-3 py-3 text-start">Action</th></tr></thead>
            <tbody>{users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="px-3 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                <td className="px-3 py-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                <td className="px-3 py-4 text-gray-600 dark:text-gray-300">{user.role}</td>
                <td className="px-3 py-4">
                  {user.id === session?.user.id ? <span className="text-gray-400">Current admin</span> : (
                    <form action={changeUserRole}>
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="role" value={user.role === "ADMIN" ? "USER" : "ADMIN"} />
                      <Button type="submit" variant="outline" size="sm">Make {user.role === "ADMIN" ? "user" : "admin"}</Button>
                    </form>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </ComponentCard>
    </>
  );
}
