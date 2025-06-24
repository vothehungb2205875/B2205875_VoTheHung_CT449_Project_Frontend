import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl = "/api/readers") {
    this.api = createApiClient(baseUrl);
    this.authApi = createApiClient("/api/auth"); // Dùng để gọi register
  }

  async getReaderById(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async getReaderByMa(MaDocGia) {
    return (await this.api.get(`/ma/${MaDocGia}`)).data;
  }

  async update(id, data) {
    return (
      await this.api.put(`/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  async getAll() {
    return (await this.api.get(`/`)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  // Thêm độc giả: chuyển sang dùng auth/register
  async create(data) {
    return (
      await this.authApi.post("/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  async statistic() {
    return (await this.api.get("/statistic")).data;
  }

  // reader.service.js
  async getFiltered(params) {
    return (await this.api.get("/", { params })).data;
  }
}

export default new ReaderService();
