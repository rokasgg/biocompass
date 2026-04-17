import { useEffect } from "react";
import { useUserStore } from '../store'

export function useUsers() {
    const { users, loading, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, users]);

    return { users, loading };

}