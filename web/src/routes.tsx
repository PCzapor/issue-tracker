import { createBrowserRouter } from "react-router-dom"
import { Layout } from "./features/pages/LayoutPage"
import { NotFound } from "./features/pages/NotFoundPage"
import { IssueDetailsPage } from "./features/pages/IssueDetailsPage"
import { IssuesPage } from "./features/pages/IssuePage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <IssuesPage />,
      },
      {
        path: "issues/:id",
        element: <IssueDetailsPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])
