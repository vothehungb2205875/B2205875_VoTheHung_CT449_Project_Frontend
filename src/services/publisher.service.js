import createApiClient from "./api.service";

class PublisherService {
  constructor(baseUrl = "/api/publishers") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(params) {
    const res = await this.api.get("/", { params });
    return res.data?.data || []; // Lấy mảng data từ kết quả có dạng { data, total }
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async getFiltered(params) {
    return (await this.api.get("/", { params })).data;
  }
}

export default new PublisherService();
