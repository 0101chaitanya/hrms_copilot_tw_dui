export const rolePermissions = {
  admin: {
    canManageEmployees: true,
    canManageUsers: true,
    canManagePayroll: true,
    canViewAnalytics: true,
    canApproveLeaves: true,
  },
  hr: {
    canManageEmployees: true,
    canManageUsers: false,
    canManagePayroll: false,
    canViewAnalytics: true,
    canApproveLeaves: true,
  },
  employee: {
    canManageEmployees: false,
    canManageUsers: false,
    canManagePayroll: false,
    canViewAnalytics: false,
    canApproveLeaves: false,
  },
};
