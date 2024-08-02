import { useState, useEffect } from "react";
import axios from "axios";
import { LIST_OF_USERS } from "@/lib/types";

const useFetchUsers = (excludeUserName?: string | null) => {
  const [listOfUsers, setListOfUsers] = useState<Array<LIST_OF_USERS>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getAllUser");
        const users = res.data.filter((user: LIST_OF_USERS) => {
          if (excludeUserName) {
            return user.name !== excludeUserName;
          }
          return true;
        });
        setListOfUsers(users);
        setError(null);
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [excludeUserName]);

  return { listOfUsers, loading, error };
};

export default useFetchUsers;
