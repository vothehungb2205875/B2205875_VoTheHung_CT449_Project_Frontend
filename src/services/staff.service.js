import createApiClient from "./api.service";

class StaffService {
  constructor(baseUrl = "/api/staffs") {
    this.api = createApiClient(baseUrl);
  }

  async getStaffById(id) {
    return (await this.api.get(`/${id}`)).data;
  }
}

export default new StaffService();
