"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserLinks() {
  const { status } = useSession();
  return (
    <div>
      {status === "authenticated" ? (
        <div>
          <Link href="/orders">Orders</Link>
          <span
            className="ml-4 cursor-pointer"
            onClick={async () => {
              signOut();
            }}
          >
            Logout
          </span>
        </div>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  );
}
