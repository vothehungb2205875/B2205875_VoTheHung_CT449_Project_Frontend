import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/borrows") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Có thể thêm các hàm khác như getAll, getByUser, v.v.
}

export default new BorrowService();
