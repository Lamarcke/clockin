import { useQuery } from "@tanstack/react-query";
import { User } from "../../../util/types/user.ts";

export function useUsers() {
    return useQuery({
        queryKey: ["user", "all"],
        queryFn: async (): Promise<User[]> => {
            return (await fetch("http://localhost:8000/user")).json();
        },
    });
}
