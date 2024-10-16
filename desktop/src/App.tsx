import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootPage from "./routes/root.tsx";
import { MantineProvider } from "@mantine/core";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import AdminPage from "./routes/adminPage.tsx";
import UserInfoPage from "./routes/UserInfoPage.tsx";

function App() {
    const [queryClient] = useState(new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <Notifications />
                <BrowserRouter>
                    <Routes>
                        <Route path={"/"} element={<RootPage />}></Route>
                        <Route path={"/admin"} element={<AdminPage />}>
                            <Route path={"user/:userId"} element={<UserInfoPage />}></Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </MantineProvider>
        </QueryClientProvider>
    );
}

export default App;
