import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import {
    ActionIcon,
    AspectRatio,
    Box,
    Divider,
    Group,
    Image,
    ScrollArea,
    Stack,
    TextInput,
    UnstyledButton,
    Text,
} from "@mantine/core";
import { useUsers } from "../user/hooks/useUsers.ts";
import { getUploadedImageURL } from "../../util/image/getUploadedImageURL.ts";
import { User } from "../../util/types/user.ts";
import UserSearchBar from "./UserSearchBar.tsx";
import Fuse from "fuse.js";
import { IconPlus } from "@tabler/icons-react";
import { Link, useNavigate, useNavigation } from "react-router-dom";

const buildFuse = (items: User[]) => {
    return new Fuse(items, {
        keys: ["name", "identifier"],
    });
};

interface Props extends PropsWithChildren {}

const AdminLayout = ({ children }: Props) => {
    const navigate = useNavigate();

    const fuse = useRef<Fuse<User>>(buildFuse([]));
    const [visibleUsers, setVisibleUsers] = useState<User[]>([]);

    const usersQuery = useUsers();

    useEffect(() => {
        if (usersQuery.data) {
            setVisibleUsers(usersQuery.data);
            fuse.current = buildFuse(usersQuery.data);
            console.log(fuse.current);
        }
    }, [usersQuery.data]);

    const usersList = useMemo(() => {
        if (visibleUsers == undefined) return null;

        return visibleUsers.map((user) => {
            return (
                <Stack key={user.id} w={"90%"}>
                    <UnstyledButton
                        onClick={() => {
                            navigate(`/admin/user/${user.id}`);
                        }}
                    >
                        <Group w={"100%"} align={"start"} wrap={"nowrap"}>
                            <Box w={"35%"}>
                                <AspectRatio ratio={264 / 354} pos="relative" h={"100%"} w={"auto"}>
                                    <Image src={getUploadedImageURL(`face_${user.id}.png`)} w={"100%"} h={"auto"} />
                                </AspectRatio>
                            </Box>

                            <Stack gap={"xs"}>
                                <Text fw={"bold"}>Name: </Text>
                                <Text>{user.name}</Text>
                                <Text fw={"bold"}>Identifier: </Text>
                                <Text>{user.identifier}</Text>
                            </Stack>
                        </Group>
                    </UnstyledButton>

                    <Divider />
                </Stack>
            );
        });
    }, [visibleUsers]);

    return (
        <Group
            w={"100%"}
            h={"100%"}
            style={{
                borderStyle: "solid",
                borderWidth: "2px",
                borderRadius: "8px",
            }}
            wrap={"nowrap"}
        >
            <Stack w={"30%"} h={"100%"} miw={"30%"} mih={"100%%"}>
                <Group w={"100%"} align={"center"} px={"sm"} mt={"md"}>
                    <UserSearchBar
                        placeholder={"Search for users"}
                        onSearch={(v) => {
                            if (v == undefined || v.trim() === "") {
                                setVisibleUsers(usersQuery.data!);
                                return;
                            }
                            const search = fuse.current.search(v);
                            const items = search.map((item) => item.item);
                            setVisibleUsers(items);
                        }}
                    />
                    <ActionIcon>
                        <IconPlus />
                    </ActionIcon>
                </Group>
                <ScrollArea.Autosize mah={600} w={"100%"} h={"100%"}>
                    <Stack h={"100%"} w={"100%"} px={"sm"}>
                        <Box w={"90%"}></Box>
                        {usersList}
                    </Stack>
                </ScrollArea.Autosize>
            </Stack>

            <Divider orientation={"vertical"} />
            <Box w={"70%"} h={"100%"}>
                {children}
            </Box>
        </Group>
    );
};

export default AdminLayout;
