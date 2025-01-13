<template>
  <div class="cast-movie-list">
    <div class="page-header">
      <h1>Manage Cast-Movie Relations</h1>
      <button @click="showCreateModal = true" class="create-btn">
        Add New Cast-Movie
      </button>
    </div>

    <div v-if="loading" class="loading">Loading cast-movie relations...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Name (Role)</th>
            <th>Cast</th>
            <th>Movie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in castMoviesList" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.cast?.name }}</td>
            <td>{{ item.movie?.title }}</td>
            <td>
              <button @click="editCastMovie(item)" class="edit-btn">
                Edit
              </button>
              <button @click="confirmDelete(item)" class="delete-btn">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="modal-overlay"
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <h2>
          {{ showEditModal ? "Edit Cast-Movie" : "Add New Cast-Movie" }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Relation Name (Role)</label>
            <input
              type="text"
              v-model="formData.name"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label>Cast</label>
            <select v-model="formData.cast_id" required class="form-control">
              <option value="">Select Cast</option>
              <option v-for="c in castsList" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Movie</label>
            <select v-model="formData.movie_id" required class="form-control">
              <option value="">Select Movie</option>
              <option v-for="m in moviesList" :key="m.id" :value="m.id">
                {{ m.title }}
              </option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{
                submitting ? "Saving..." : showEditModal ? "Update" : "Create"
              }}
            </button>
            <button type="button" class="cancel-btn" @click="closeModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="modal-overlay"
      @click="showDeleteModal = false"
    >
      <div class="modal-content" @click.stop>
        <h2>Delete Cast-Movie Relation</h2>
        <p>
          Are you sure you want to delete relation "{{
            castMovieToDelete?.name
          }}"?
        </p>
        <div class="modal-actions">
          <button
            @click="deleteCastMovie"
            class="delete-btn"
            :disabled="submitting"
          >
            {{ submitting ? "Deleting..." : "Delete" }}
          </button>
          <button @click="showDeleteModal = false" class="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { castMovies, casts, movies, handleApiError } from "@/api";

const castMoviesList = ref([]);
const castsList = ref([]);
const moviesList = ref([]);

const loading = ref(false);
const error = ref(null);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);

const castMovieToDelete = ref(null);
const formData = ref({
  name: "",
  cast_id: "",
  movie_id: "",
});

const fetchAllData = async () => {
  try {
    loading.value = true;
    const [cmRes, cRes, mRes] = await Promise.all([
      castMovies.getAll(),
      casts.getAll(),
      movies.getAll(),
    ]);
    castMoviesList.value = cmRes.data;
    castsList.value = cRes.data;
    moviesList.value = mRes.data;
  } catch (err) {
    error.value = handleApiError(err);
  } finally {
    loading.value = false;
  }
};

const editCastMovie = (item) => {
  showEditModal.value = true;
  castMovieToDelete.value = item;
  formData.value = {
    name: item.name,
    cast_id: item.cast_id,
    movie_id: item.movie_id,
  };
};

const confirmDelete = (item) => {
  castMovieToDelete.value = item;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  showDeleteModal.value = false;
  castMovieToDelete.value = null;
  formData.value = { name: "", cast_id: "", movie_id: "" };
};

const handleSubmit = async () => {
  try {
    submitting.value = true;
    if (showEditModal.value && castMovieToDelete.value) {
      await castMovies.update(castMovieToDelete.value.id, formData.value);
    } else {
      await castMovies.create(formData.value);
    }
    await fetchAllData();
    closeModal();
  } catch (err) {
    handleApiError(err);
  } finally {
    submitting.value = false;
  }
};

const deleteCastMovie = async () => {
  if (!castMovieToDelete.value) return;
  try {
    submitting.value = true;
    await castMovies.delete(castMovieToDelete.value.id);
    castMoviesList.value = castMoviesList.value.filter(
      (cm) => cm.id !== castMovieToDelete.value.id
    );
    closeModal();
  } catch (err) {
    handleApiError(err);
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchAllData);
</script>

<style scoped>
.cast-movie-list {
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

.cast-movie-table-container {
  overflow-x: auto;
}

.cast-movie-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cast-movie-table th,
.cast-movie-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.cast-movie-table th {
  background: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.cast-info,
.movie-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cast-thumbnail,
.movie-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
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
  max-width: 500px;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.cast-movie-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
