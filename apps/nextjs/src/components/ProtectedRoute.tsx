import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.push("/signin");
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
