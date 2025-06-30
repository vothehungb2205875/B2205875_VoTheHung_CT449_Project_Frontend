import createApiClient from "./api.service";

class StaffService {
  constructor(baseUrl = "/api/staffs") {
    this.api = createApiClient(baseUrl);
  }

  // Lấy tất cả nhân viên (mặc định chỉ nhân viên còn hoạt động)
  async getAll(params) {
    return (await this.api.get("/", { params })).data;
  }

  // Lấy 1 nhân viên theo ID
  async getStaffById(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  // Thêm mới nhân viên
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Cập nhật nhân viên
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async getFiltered(params) {
    return (await this.api.get("/", { params })).data;
  }
}

export default new StaffService();
