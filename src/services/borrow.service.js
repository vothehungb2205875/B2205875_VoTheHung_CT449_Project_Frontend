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
}

export default new BorrowService();
