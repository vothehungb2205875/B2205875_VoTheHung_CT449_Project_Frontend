<template>
    <div>
      <h2>Quản lý Độc giả</h2>
      <form @submit.prevent="addReader">
        <input v-model="newReader.name" placeholder="Tên độc giả" />
        <button type="submit">Thêm</button>
      </form>
  
      <ul>
        <li v-for="(reader, index) in readers" :key="index">
          {{ reader.name }}
          <button @click="deleteReader(index)">Xóa</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        readers: [],
        newReader: {
          name: ''
        }
      };
    },
    methods: {
      addReader() {
        if (this.newReader.name) {
          this.readers.push({ ...this.newReader });
          this.newReader.name = '';
        }
      },
      deleteReader(index) {
        this.readers.splice(index, 1);
      }
    }
  };
  </script>
  