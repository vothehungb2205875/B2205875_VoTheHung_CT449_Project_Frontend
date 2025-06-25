import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/borrows") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async history(maDocGia) {
    return (await this.api.get(`/history/${maDocGia}`)).data;
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async markAsReturned(id) {
    const payload = {
      TrangThai: "Đã trả",
    };
    return await this.api.put(`/${id}`, payload);
  }

  async cancelBorrow(id) {
    const payload = { TrangThai: "Đã hủy" };
    return await this.api.put(`/${id}`, payload);
  }

  async markAsReminded(id) {
    const payload = { TrangThai: "Quá hạn" };
    return await this.api.put(`/${id}`, payload);
  }

  async markAsBorrowed(id) {
    const payload = { TrangThai: "Đang mượn" };
    return await this.api.put(`/${id}`, payload);
  }

  async statistic() {
    return (await this.api.get("/statistic")).data;
  }

  async getFiltered(params) {
    return (await this.api.get("/", { params })).data;
  }
}

export default new BorrowService();
