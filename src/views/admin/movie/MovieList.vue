<template>
  <div class="admin-movie-list">
    <div class="page-header">
      <h1>Manage Movies</h1>
      <button @click="showCreateModal = true" class="create-btn">
        Add New Movie
      </button>
    </div>

    <div v-if="loading" class="loading">Loading movies...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="movie-table-container">
      <table class="movie-table">
        <thead>
          <tr>
            <th>Poster</th>
            <th>Title</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in movieList" :key="movie.id">
            <td>
              <img
                :src="movie.poster || '/placeholder-movie.jpg'"
                :alt="movie.title"
                class="movie-thumbnail"
              />
            </td>
            <td>{{ movie.title }}</td>
            <td>{{ movie.year }}</td>
            <td>{{ movie.genre?.name }}</td>
            <td>
              <button @click="editMovie(movie)" class="edit-btn">Edit</button>
              <button @click="confirmDelete(movie)" class="delete-btn">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CREATE/EDIT MODAL -->
    <div
      v-if="showCreateModal || showEditModal"
      class="modal-overlay"
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <h2>{{ showEditModal ? "Edit Movie" : "Create Movie" }}</h2>
        <form @submit.prevent="handleSubmit" class="movie-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              v-model="formData.title"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="summary">Summary</label>
            <textarea
              id="summary"
              v-model="formData.summary"
              required
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="year">Year</label>
            <input
              type="text"
              id="year"
              v-model="formData.year"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="genre">Genre</label>
            <select
              id="genre"
              v-model="formData.genre_id"
              class="form-control"
              required
            >
              <option value="">Select Genre</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="poster">Poster</label>
            <input
              type="file"
              id="poster"
              @change="handleFileChange"
              accept="image/*"
            />
          </div>

          <div class="modal-actions">
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? "Saving..." : "Save" }}
            </button>
            <button type="button" class="cancel-btn" @click="closeModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- DELETE CONFIRMATION -->
    <div
      v-if="showDeleteModal"
      class="modal-overlay"
      @click="showDeleteModal = false"
    >
      <div class="modal-content" @click.stop>
        <h2>Delete Movie</h2>
        <p>Are you sure you want to delete "{{ movieToDelete?.title }}"?</p>
        <div class="modal-actions">
          <button
            class="delete-btn"
            @click="deleteMovie"
            :disabled="submitting"
          >
            {{ submitting ? "Deleting..." : "Delete" }}
          </button>
          <button class="cancel-btn" @click="showDeleteModal = false">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { movies, genres, handleApiError } from "@/api";

const movieList = ref([]);
const genresList = ref([]);
const loading = ref(false);
const error = ref(null);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);

const movieToDelete = ref(null);

const formData = ref({
  title: "",
  summary: "",
  year: "",
  genre_id: "",
  poster: null,
});

//--- Fetch
async function fetchMovies() {
  try {
    loading.value = true;
    const response = await movies.getAll(); // GET /movie
    // response.data => { message, data: [ {...}, ... ] }
    movieList.value = response.data.data;
  } catch (err) {
    error.value = handleApiError(err);
  } finally {
    loading.value = false;
  }
}

async function fetchGenres() {
  try {
    const res = await genres.getAll(); // GET /genre
    genresList.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
}

//--- Modal
function closeModal() {
  showCreateModal.value = false;
  showEditModal.value = false;
  showDeleteModal.value = false;
  movieToDelete.value = null;
  formData.value = {
    title: "",
    summary: "",
    year: "",
    genre_id: "",
    poster: null,
  };
}

//--- CRUD
function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    formData.value.poster = file;
  }
}

async function handleSubmit() {
  try {
    submitting.value = true;
    if (showEditModal.value && movieToDelete.value) {
      // Update
      await movies.update(movieToDelete.value.id, formData.value);
    } else {
      // Create
      await movies.create(formData.value);
    }
    await fetchMovies();
    closeModal();
  } catch (err) {
    handleApiError(err);
  } finally {
    submitting.value = false;
  }
}

function editMovie(movie) {
  movieToDelete.value = movie; //menyimpan data
  formData.value = {
    title: movie.title,
    summary: movie.summary,
    year: movie.year,
    genre_id: movie.genre_id,
    poster: null, // reset file
  };
  showEditModal.value = true;
}

function confirmDelete(movie) {
  movieToDelete.value = movie;
  showDeleteModal.value = true;
}

async function deleteMovie() {
  if (!movieToDelete.value) return;
  try {
    submitting.value = true;
    await movies.delete(movieToDelete.value.id);
    await fetchMovies();
    showDeleteModal.value = false;
  } catch (err) {
    handleApiError(err);
  } finally {
    submitting.value = false;
  }
}

//--- Lifecycle
onMounted(async () => {
  await fetchMovies();
  await fetchGenres();
});
</script>

<style scoped>
.admin-movie-list {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-btn {
  background: #28a745;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background: #218838;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
.genre-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-input {
  flex: 1;
}

.genre-select {
  min-width: 150px;
}

.movie-table-container {
  overflow-x: auto;
}

.movie-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.movie-table th,
.movie-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.movie-table th {
  background: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.movie-thumbnail {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-btn {
  background: #4a90e2;
  color: white;
}

.edit-btn:hover {
  background: #357abd;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.movie-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.genre-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.submit-btn,
.cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn {
  background: #28a745;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #218838;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background: #c82333;
}

.loading,
.error-message {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.error-message {
  background: #f8d7da;
  color: #dc3545;
}
</style>
