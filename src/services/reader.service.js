import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl = "/api/readers") {
    this.api = createApiClient(baseUrl);
  }

  async getReaderById(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async updateReader(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
}

export default new ReaderService();
