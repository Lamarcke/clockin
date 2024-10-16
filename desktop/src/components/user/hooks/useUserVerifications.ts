import { useQuery } from "@tanstack/react-query";

export function useUserVerifications(userId: number) {
    return useQuery({
        queryKey: ["user", "verifications", userId],
        queryFn: async () => {
            return (await fetch(`http://localhost:8000/user/verification/${userId}`)).json();
        },
    });
}
