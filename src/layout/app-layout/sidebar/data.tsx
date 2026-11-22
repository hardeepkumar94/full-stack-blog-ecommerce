import {
  BoxIcon,
  FileIcon,
  LayoutGridIcon,
  ListIcon,
  UsersIcon,
} from "@/icons";
import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  {
    icon: <LayoutGridIcon className="size-6" />,
    key: "dashboard",
    path: "/admin",
  },
  {
    icon: <FileIcon className="size-6" />,
    key: "blogs",
    path: "/admin/blogs",
  },
  {
    icon: <BoxIcon className="size-6" />,
    key: "products",
    path: "/admin/products",
  },
  {
    icon: <UsersIcon className="size-6" />,
    key: "users",
    path: "/admin/users",
  },
  {
    icon: <ListIcon className="size-6" />,
    key: "orders",
    path: "/admin/orders",
  },
];

export const othersItems: NavItem[] = [];

export const supportItems: NavItem[] = [];
