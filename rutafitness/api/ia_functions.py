import cv2
import numpy as np
import requests
from io import BytesIO
from PIL import Image


def _cargar_imagen(url):
    """Descarga una imagen desde una URL y retorna IMG PIL."""
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        return Image.open(BytesIO(r.content)).convert("RGB")
    except Exception as e:
        raise IOError(f"No se pudo descargar/leer la imagen ({url}): {e}")


def comparar_progresos_opencv(foto_anterior_url, foto_nueva_url):
    """
    Compara dos imágenes de progreso usando OpenCV (AbsDiff).
    Devuelve un diccionario con análisis y diferencia.
    """
    try:
        img1_pil = _cargar_imagen(foto_anterior_url)
        img2_pil = _cargar_imagen(foto_nueva_url)
    except IOError as e:
        return {"error": str(e)}

    img1 = cv2.cvtColor(np.array(img1_pil), cv2.COLOR_RGB2GRAY)
    img2 = cv2.cvtColor(np.array(img2_pil), cv2.COLOR_RGB2GRAY)

    img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))

    diff = cv2.absdiff(img1, img2)
    mean_diff = np.mean(diff)

    if mean_diff < 5:
        resultado = "Similitud muy alta (cambio mínimo)."
    elif mean_diff < 20:
        resultado = "Progreso leve o cambio sutil."
    elif mean_diff < 50:
        resultado = "Progreso notable."
    else:
        resultado = "Cambio extremo (gran diferencia visual)."

    return {
        "analisis": resultado,
        "diferencia_media":  float(mean_diff),
        "nota": "Mientras más alta la diferencia, mayor el cambio entre fotos."
    }