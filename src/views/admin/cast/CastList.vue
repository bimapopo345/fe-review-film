<template>
  <div class="cast-list">
    <div class="page-header">
      <h1>Manage Cast Members</h1>
      <button @click="showCreateModal = true" class="create-btn">
        Add New Cast
      </button>
    </div>

    <div v-if="loading" class="loading">Loading cast members...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else class="cast-grid">
      <div v-for="castItem in castList" :key="castItem.id" class="cast-card">
        <div class="cast-info">
          <h3>{{ castItem.name }}</h3>
          <p>Age: {{ castItem.age }}</p>
          <p class="cast-bio">{{ truncateText(castItem.bio, 80) }}</p>
          <div class="action-buttons">
            <button @click="editCast(castItem)" class="edit-btn">Edit</button>
            <button @click="confirmDelete(castItem)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="modal-overlay"
      @click="closeModal"
    >
      <div class="modal-content" @click.stop>
        <h2>
          {{ showEditModal ? "Edit Cast Member" : "Add New Cast Member" }}
        </h2>
        <form @submit.prevent="handleSubmit" class="cast-form">
          <div class="form-group">
            <label>Name</label>
            <input
              type="text"
              v-model="formData.name"
              required
              class="form-control"
              :disabled="submitting"
            />
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea
              rows="4"
              v-model="formData.bio"
              required
              class="form-control"
              :disabled="submitting"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Age</label>
            <input
              type="number"
              v-model="formData.age"
              required
              class="form-control"
              :disabled="submitting"
            />
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
        <h2>Delete Cast Member</h2>
        <p>Are you sure you want to delete "{{ castToDelete?.name }}"?</p>
        <div class="modal-actions">
          <button @click="deleteCast" class="delete-btn" :disabled="submitting">
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
import { casts, handleApiError } from "@/api";

const castList = ref([]);
const loading = ref(false);
const error = ref(null);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);

const castToDelete = ref(null);
const formData = ref({
  name: "",
  bio: "",
  age: 0,
});

const truncateText = (text, length) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

const fetchCasts = async () => {
  try {
    loading.value = true;
    const res = await casts.getAll();
    castList.value = res.data;
  } catch (err) {
    error.value = handleApiError(err);
  } finally {
    loading.value = false;
  }
};

const editCast = (castItem) => {
  showEditModal.value = true;
  castToDelete.value = castItem;
  formData.value = {
    name: castItem.name,
    bio: castItem.bio,
    age: castItem.age,
  };
};

const confirmDelete = (castItem) => {
  castToDelete.value = castItem;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  showDeleteModal.value = false;
  castToDelete.value = null;
  formData.value = { name: "", bio: "", age: 0 };
};

const handleSubmit = async () => {
  try {
    submitting.value = true;
    if (showEditModal.value) {
      // update
      await casts.update(castToDelete.value.id, formData.value);
    } else {
      // create
      await casts.create(formData.value);
    }
    await fetchCasts();
    closeModal();
  } catch (err) {
    handleApiError(err);
  } finally {
    submitting.value = false;
  }
};

const deleteCast = async () => {
  if (!castToDelete.value) return;
  try {
    submitting.value = true;
    await casts.delete(castToDelete.value.id);
    castList.value = castList.value.filter(
      (c) => c.id !== castToDelete.value.id
    );
    closeModal();
  } catch (err) {
    handleApiError(err);
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchCasts);
</script>

<style scoped>
.cast-list {
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

.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.cast-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cast-photo {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.cast-info {
  padding: 1.5rem;
}

.cast-info h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.cast-bio {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.edit-btn,
.delete-btn {
  flex: 1;
  padding: 0.5rem;
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

.cast-form {
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
