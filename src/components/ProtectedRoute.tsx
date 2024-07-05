import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.push("/signup");
  }, [session, status]);

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }
  return children;
};
export default ProtectedRoute;
