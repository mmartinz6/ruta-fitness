import axios from "axios";

const CLOUD_NAME = "dcfoaq1vo";
const UPLOAD_PRESET = "ml_default"; 
const API_KEY = "842166596188568"; // Cloudinary API KEY, no secret key

// === SUBIR FOTO A CLOUDINARY ===
export async function subirFotoCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("api_key", API_KEY);

  try {
    const response = await axios.post(url, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary", error);
    return null;
  }
}

// === COMPARAR FOTOS CON IA (BACKEND) ===
export async function compararFotosIA(url1, url2) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/comparar-fotos/", // tenia esta y daba error http://127.0.0.1:8000/api/comparar-opencv/
      {
        foto1_url: url1,  // Coincide con lo que espera Django
        foto2_url: url2
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al conectar con la API", error);
    return { error: true };
  }
}