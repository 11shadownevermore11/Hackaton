import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import App from "./App";
import MapPage from "./pages/MapPage";
import CatalogPage from "./pages/CatalogPage";
import ProfilePage from "./pages/ProfilePage";
import RoutesPage from "./pages/RoutesPage";
import BookmarksPage from "./pages/BookmarksPage";
import LocationPage from "./pages/LocationPage";
import AddLocationPage from "./pages/AddLocationPage";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                path: "/map",
                Component: MapPage,
            },
            {
                path: "/location/:id",
                Component: LocationPage,
            },
            {
                path: "/catalog",
                Component: CatalogPage,
            },
            {
                path: "/bookmarks",
                Component: BookmarksPage,
            },
            {
                path: "/routes",
                Component: RoutesPage,
            },
            {
                path: "/profile",
                Component: ProfilePage,
            },
            {
                path: "/addLocation",
                Component: AddLocationPage,
            },
        ]
    },
    {
        path: '*',
        element: <Navigate to="/map" replace />,
    },
]);

const Router: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default Router;
