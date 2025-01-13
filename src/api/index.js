import axios from "axios";

// Auth API
export const auth = {
  register: (data) => axios.post("/auth/register", data),
  login: (data) => axios.post("/auth/login", data),
  logout: () => axios.post("/auth/logout"),
  generateOtp: (data) => axios.post("/auth/generate-otp-code", data),
  verifyEmail: (data) => axios.post("/auth/verification-email", data),
  getMe: () => axios.get("/me"),
  updateUser: (data) => axios.put("/user", data),
};

// Genre API
export const genres = {
  getAll: () => axios.get("/genre"),
  getById: (id) => axios.get(`/genre/${id}`),
  create: (data) => axios.post("/genre", data),
  update: (id, data) =>
    axios.post(`/genre/${id}`, data, {
      // Karena di Laravel route update Genre pakai POST + defaults('_method','PUT')
    }),
  delete: (id) => axios.post(`/genre/${id}/delete`),
};

// Movie API
export const movies = {
  getAll: () => axios.get("/movie"),
  getById: (id) => axios.get(`/movie/${id}`),
  create: (data) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key === "poster" && value instanceof File) {
        formData.append("poster", value);
      } else {
        formData.append(key, value);
      }
    }
    return axios.post("/movie", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id, data) => {
    // Laravel update pakai post ke /movie/{id} + _method=PUT
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key === "poster" && value instanceof File) {
        formData.append("poster", value);
      } else {
        formData.append(key, value);
      }
    }
    return axios.post(`/movie/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id) => axios.post(`/movie/${id}/delete`),
};

// Cast API
export const casts = {
  getAll: () => axios.get("/cast"),
  getById: (id) => axios.get(`/cast/${id}`),
  create: (data) => {
    // Cast only has name, bio, age (no photo)
    return axios.post("/cast", data);
  },
  update: (id, data) => {
    return axios.post(`/cast/${id}`, data);
  },
  delete: (id) => axios.post(`/cast/${id}/delete`),
};

// Cast Movie API
export const castMovies = {
  getAll: () => axios.get("/cast-movie"),
  getById: (id) => axios.get(`/cast-movie/${id}`),
  create: (data) => axios.post("/cast-movie", data),
  update: (id, data) => {
    // route update pakai post => /cast-movie/{id} + _method=PUT
    // tapi di code kita pakai PUT, sementara di routes:
    // Route::post('/cast-movie/{id}', [CastMovieController::class, 'update'])->name('castmovie.update')->defaults('_method','PUT');
    // lebih aman pakai post
    return axios.post(`/cast-movie/${id}`, data);
  },
  delete: (id) => axios.post(`/cast-movie/${id}/delete`),
};

// Review API
export const reviews = {
  create: (data) => axios.post("/review", data),
};

// Error Handler
export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 401:
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        break;
      case 403:
        alert("You do not have permission to perform this action");
        break;
      case 422:
        return data.errors || data.message;
      default:
        alert(data.message || "An error occurred");
    }
  } else if (error.request) {
    alert("Unable to connect to the server");
  } else {
    alert("An error occurred while making the request");
  }
  return null;
};
