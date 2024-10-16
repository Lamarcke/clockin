import { MutationOptions, useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API_BASE_PATH } from "../../../util/constants.ts";

import { DetectMatchResponse } from "../../../util/types/detection.ts";

type Options<TData, TError> = Omit<UseMutationOptions<TData, TError, any, unknown>, "mutationFn">;

export function useMatchFaceMutation<TError = Error>(options: Options<DetectMatchResponse, TError>) {
    return useMutation({
        ...options,
        mutationFn: async (image: Blob) => {
            const formData = new FormData();
            formData.append("picture", image);

            const req = await fetch(`${API_BASE_PATH}/detection/match`, {
                method: "POST",
                body: formData,
            });

            if (!req.ok) {
                throw new Error("Failed to match!");
            }

            const json: DetectMatchResponse = await req.json();

            return json;
        },
    });
}
