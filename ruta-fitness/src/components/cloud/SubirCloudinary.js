// COMPONENTE SUBIRCLOUD
export async function uploadToCloudinary(file) {
  const nombreCloud = "dccesiq4s"; // tu Cloud name
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "RutaFitnessBucket"); // tu preset
  data.append("cloud_name", nombreCloud);


  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dccesiq4s/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();
    return result; // secure_url, public_id, etc.
  } catch (error) {
    console.error("Error al subir a Cloudinary:", error);
    throw error;
  }
}
