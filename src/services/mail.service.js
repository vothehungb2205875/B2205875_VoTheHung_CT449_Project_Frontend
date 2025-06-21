import createApiClient from "./api.service";

class MailService {
  constructor(baseUrl = "/api/mail") {
    this.api = createApiClient(baseUrl);
  }

  async sendReminder(data) {
    return await this.api.post("/reminder", data);
  }
}

export default new MailService();
