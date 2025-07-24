<template>
  <div class="chatbot-container mt-0 p-1">
    <h2 class="text-center fw-bold mb-3">CTLIB CHATBOT</h2>

    <!-- Khung chat -->
    <div class="chat-box mb-2" ref="chatBox">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['chat-message', msg.role === 'user' ? 'user' : 'bot']"
      >
        <div class="message-bubble">
          <template v-if="msg.role === 'bot'">
            <div v-html="renderMarkdown(msg.text)"></div>
          </template>
          <template v-else>
            <p>{{ msg.text }}</p>
          </template>
        </div>
      </div>
    </div>

    <!-- Input -->
    <form @submit.prevent="handleSubmit" class="chat-input-group">
      <textarea
        v-model="userInput"
        class="form-control"
        rows="2"
        placeholder="Nhấn Enter để gửi, Shift + Enter để xuống dòng"
        :disabled="loading"
        @keydown.enter.exact.prevent="handleSubmit"
      ></textarea>
      <button class="btn btn-primary" type="submit" :disabled="loading || !userInput.trim()">
        Gửi
      </button>
    </form>

    <!-- Gợi ý -->
    <div class="quick-questions mt-3">
      <span
        v-for="(question, i) in suggestedQuestions"
        :key="i"
        class="badge bg-secondary me-2 mb-2 quick-btn"
        @click="sendQuickQuestion(question)"
      >
        {{ question }}
      </span>
      <p class="m-0">Độc giả có thể liên hệ trực tiếp cho fanpage CTLIB nếu có thắc mắc mà Chatbot không thể giải đáp.</p>
    </div>

    <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { marked } from 'marked'
import ChatbotService from '@/services/chatbot.service'

const userInput = ref('')
const messages = ref([])
const loading = ref(false)
const error = ref('')
const chatBox = ref(null)

const suggestedQuestions = ref([
  'Làm sao để đăng ký mượn sách?',
  'Có thể mượn tối đa bao nhiêu quyển?',
  'Gia hạn mượn sách như thế nào?',
  'Nếu làm mất sách thì phải xử lý sao?',
  'Thời hạn mượn là bao lâu?',
  'Tôi bị trễ hạn trả sách thì sao?'
])

function renderMarkdown(text) {
  return marked.parse(text || '')
}

function sendQuickQuestion(text) {
  userInput.value = text
  handleSubmit()
}

async function handleSubmit() {
  if (!userInput.value.trim()) return

  const question = userInput.value.trim()
  messages.value.push({ role: 'user', text: question })
  userInput.value = ''
  error.value = ''
  loading.value = true

  await nextTick(() => {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  })

  try {
    const { reply } = await ChatbotService.ask(question)
    messages.value.push({ role: 'bot', text: reply })

    await nextTick(() => {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    })
  } catch (err) {
    error.value = err.message || 'Lỗi khi gửi yêu cầu'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chatbot-container {
  max-width: 1000px;
  margin: auto;
  padding: 0 1rem;
}

.chat-box {
  background: #f9f9f9;
  border: 1px solid #ccc;
  height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
  border-radius: 8px;
}

.chat-message {
  display: flex;
  margin-bottom: 0.4rem;
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.bot {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 75%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  background-color: #e1f5fe;
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: pre-wrap;
}

.chat-message.user .message-bubble {
  background-color: #d1e7dd;
  text-align: right;
}

.chat-message.bot .message-bubble {
  background-color: #f1f0f0;
}

/* Markdown */
.message-bubble h1,
.message-bubble h2,
.message-bubble h3 {
  margin: 0.5rem 0;
  font-weight: bold;
}

.message-bubble ul {
  margin: 0.3rem 0;
  padding-left: 1.25rem;
}

.message-bubble li {
  margin-bottom: 0.25rem;
}

.message-bubble code {
  background: #eee;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.message-bubble pre {
  background: #eee;
  padding: 0.5rem;
  overflow-x: auto;
  border-radius: 4px;
}

.chat-input-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

textarea {
  resize: none;
  flex: 1;
  font-size: 0.9rem;
  padding: 0.5rem;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.quick-btn {
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
}
</style>
