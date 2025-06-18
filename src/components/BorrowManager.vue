<template>
    <div>
      <h2>Quản lý Mượn sách</h2>
      <form @submit.prevent="addBorrow">
        <input v-model="borrow.reader" placeholder="Tên độc giả" />
        <input v-model="borrow.book" placeholder="Tên sách" />
        <button type="submit">Mượn</button>
      </form>
  
      <ul>
        <li v-for="(b, index) in borrows" :key="index">
          {{ b.reader }} mượn "{{ b.book }}"
          <button @click="returnBook(index)">Trả sách</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        borrow: { reader: '', book: '' },
        borrows: []
      };
    },
    methods: {
      addBorrow() {
        if (this.borrow.reader && this.borrow.book) {
          this.borrows.push({ ...this.borrow });
          this.borrow.reader = '';
          this.borrow.book = '';
        }
      },
      returnBook(index) {
        this.borrows.splice(index, 1);
      }
    }
  };
  </script>
  