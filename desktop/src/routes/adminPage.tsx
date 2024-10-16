import React from "react";
import AdminLayout from "../components/admin/AdminLayout.tsx";
import { Outlet } from "react-router-dom";
import { Flex, Group, Stack, Title } from "@mantine/core";

const AdminPage = () => {
    return (
        <Flex w={"100%"} justify={"center"} mih={"100vh"} align={"center"} wrap={"wrap"}>
            <Stack w={"95%"} h={"95vh"} p={"md"}>
                <Group w={"100%"}>
                    <Title>ClockIn</Title>
                </Group>
                <AdminLayout>
                    <Outlet />
                </AdminLayout>
            </Stack>
        </Flex>
    );
};

export default AdminPage;
