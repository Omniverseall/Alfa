// services/authService.ts

const DEFAULT_ADMIN = {
  phone: "+998900166699",
  password: "raximbaev1996"
};

export const authService = {
  login: (phone: string, password: string): boolean => {
    return phone === DEFAULT_ADMIN.phone && password === DEFAULT_ADMIN.password;
  },
  
  isAuthenticated: (): boolean => {
    // Проверяем sessionStorage вместо localStorage
    return sessionStorage.getItem("isAdminAuthenticated") === "true";
  },
  
  setAuthenticated: (value: boolean): void => {
    if (value) {
      // Устанавливаем в sessionStorage
      sessionStorage.setItem("isAdminAuthenticated", "true");
    } else {
      // Удаляем из sessionStorage
      sessionStorage.removeItem("isAdminAuthenticated");
    }
  },
  
  logout: (): void => {
    // Удаляем из sessionStorage
    sessionStorage.removeItem("isAdminAuthenticated");
    // Дополнительно можно перенаправить на страницу логина, если это не делается в вызывающем коде
    // window.location.href = '/login'; // или использовать navigate из react-router-dom
  }
};