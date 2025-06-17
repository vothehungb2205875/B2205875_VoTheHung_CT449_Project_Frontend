import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async login(data) {
    return (await this.api.post("/login", data)).data;
  }

  async register(data) {
    return (
      await this.api.post("/register", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Bắt buộc khi gửi ảnh
        },
      })
    ).data;
  }

  async logout() {
    return (await this.api.post("/logout")).data;
  }

  async getCurrentUser() {
    return (await this.api.get("/me")).data;
  }
}

export default new AuthService();
