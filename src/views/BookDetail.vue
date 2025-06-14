<template>
    <div class="page-layout">
        <Header />

        <main class="flex-fill">
            <div class="container mt-5" v-if="book">
                <div class="row">
                    <div class="col-md-4">
                        <img :src="`http://localhost:3000/${book.BiaSach}`" class="img-fluid rounded shadow" />
                    </div>
                    <div class="col-md-8">
                        <button class="btn btn-secondary mb-4" @click="goBack">
                            <font-awesome-icon icon="fa-solid fa-arrow-left" /> Quay lại
                        </button>

                        <h2>{{ book.TenSach }}</h2>
                        <p><strong>Tác giả:</strong> {{ book.TacGia }}</p>
                        <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</p>
                        <p><strong>Giá:</strong> {{ book.DonGia.toLocaleString() }}₫</p>
                        <p><strong>Số quyển còn:</strong> {{ book.SoQuyen }}</p>
                        <p><strong>Nhà xuất bản:</strong> {{ book.MaNXB }}</p>
                    </div>
                </div>
            </div>
        </main>

        <Footer />
    </div>
</template>
  

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const route = useRoute()
const book = ref(null)

const goBack = () => router.back()

onMounted(async () => {
    try {
        const res = await axios.get(`http://localhost:3000/api/books/${route.params.id}`)
        book.value = res.data
    } catch (err) {
        console.error('Không tìm thấy sách:', err)
    }
})
</script>


<style scoped>
img {
    width: 100%;
    max-width: 500px;
    height: auto;
    padding: 10px;
    margin-bottom: 20px;
}

.page-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;
}
</style>
  
