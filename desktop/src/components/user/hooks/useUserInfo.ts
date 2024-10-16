import { useQuery } from "@tanstack/react-query";
import { User } from "../../../util/types/user.ts";

export function useUserInfo(userId: number) {
    return useQuery({
        queryKey: ["user", "info", userId],
        queryFn: async (): Promise<User> => {
            return (await fetch(`http://localhost:8000/user/${userId}`)).json();
        },
    });
}
