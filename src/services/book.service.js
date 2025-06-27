import createApiClient from "./api.service";
// Nơi nhận dữ liêu từ API và xử lý các yêu cầu liên quan đến sách
class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data; // .data là để lấy dữ liệu từ phản hồi thay vì toàn bộ đối tượng phản hồi
  }

  async create(data) {
    return (
      await this.api.post("/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    if (data instanceof FormData) {
      return (
        await this.api.put(`/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    } else {
      return (await this.api.put(`/${id}`, data)).data;
    }
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async getTopViewed() {
    return (await this.api.get("/top")).data;
  }

  async getFiltered(params) {
    return (await this.api.get("/", { params })).data;
  }

  async getFilters() {
    return (await this.api.get("/filters")).data;
  }
}

export default new BookService();
