import { Role, RoutePaths } from "./enum";

const messages = {
  USER_DELETE: "Are you sure you want to delete this user?",
  UPDATED_SUCCESS: "Record updated successfully",
  UPDATED_FAIL: "Record cannot be updated",
  DELETE_SUCCESS: "Record deleted successfully",
  DELETE_FAIL: "Record cannot be deleted",
  ORDER_SUCCESS: "Your order is successfully placed",
};

const LocalStorageKeys = {
  USER: "user",
};

const NavigationItems = [
  {
    name: "Users",
    route: RoutePaths.User,
    access: [Role.Admin],
  },
  {
    name: "Categories",
    route: RoutePaths.Category,
    access: [Role.Admin],
  },
  {
    name: "Books",
    route: RoutePaths.Book,
    access: [Role.Admin, Role.Seller],
  },
  {
    name: "Update Profile",
    route: RoutePaths.UpdateProfile,
    access: [Role.Admin, Role.Buyer, Role.Seller],
  },
];

const hasAccess = (pathname, user) => {
  const navItem = NavigationItems.find((x) => pathname.includes(x.route));
  if (navItem) {
    return (
      !navItem.access ||
      !!(navItem.access && navItem.access.includes(user.roleId))
    );
  }
  return true;
};

export default {
  hasAccess,
  messages,
  LocalStorageKeys,
  NavigationItems,
};