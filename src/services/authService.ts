// Default admin credentials
const DEFAULT_ADMIN = {
  phone: "+998500735768",
  password: "12345678"
};

export const authService = {
  login: (phone: string, password: string): boolean => {
    return phone === DEFAULT_ADMIN.phone && password === DEFAULT_ADMIN.password;
  },
  
  isAuthenticated: (): boolean => {
    return localStorage.getItem("isAdminAuthenticated") === "true";
  },
  
  setAuthenticated: (value: boolean): void => {
    if (value) {
      localStorage.setItem("isAdminAuthenticated", "true");
    } else {
      localStorage.removeItem("isAdminAuthenticated");
    }
  },
  
  logout: (): void => {
    localStorage.removeItem("isAdminAuthenticated");
  }
};