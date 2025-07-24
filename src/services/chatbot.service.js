import createApiClient from "./api.service";

class ChatbotService {
  constructor(baseUrl = "/api/chatbot") {
    this.api = createApiClient(baseUrl);
  }

  async ask(question) {
    return (await this.api.post("/", { question })).data;
  }
}

export default new ChatbotService();
