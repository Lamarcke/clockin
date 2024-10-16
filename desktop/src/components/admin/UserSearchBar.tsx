import React from "react";
import { TextInput, TextInputProps } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";

interface Props extends TextInputProps {
    onSearch: (q: string) => void;
}

const UserSearchBar = ({ onSearch, ...others }: Props) => {
    const handleSearch = useDebouncedCallback((q: string) => {
        console.log("Searching for: ", q);
        onSearch(q);
    }, 500);

    return (
        <TextInput
            {...others}
            onChange={(e) => {
                const value = e.currentTarget.value;
                handleSearch(value);
            }}
        ></TextInput>
    );
};

export default UserSearchBar;
