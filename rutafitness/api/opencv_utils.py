import cv2
import numpy as np
import requests
from io import BytesIO
from PIL import Image

def comparar_progresos_opencv(foto_anterior_url, foto_nueva_url):
    """
    Compara dos imágenes y devuelve un análisis visual más descriptivo:
    - Tonificación
    - Posible aumento o pérdida de grasa
    - Cambios visibles en brazos, pecho y abdomen
    """
    
    def _cargar_imagen_desde_url(url):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return Image.open(BytesIO(response.content)).convert("RGB")
        except Exception as e:
            raise IOError(f"No se pudo procesar la imagen desde {url}: {e}")

    # 1. Cargar imágenes
    img1_pil = _cargar_imagen_desde_url(foto_anterior_url)
    img2_pil = _cargar_imagen_desde_url(foto_nueva_url)

    # 2. Convertir a escala de grises
    img1 = cv2.cvtColor(np.array(img1_pil), cv2.COLOR_RGB2GRAY)
    img2 = cv2.cvtColor(np.array(img2_pil), cv2.COLOR_RGB2GRAY)

    # 3. Redimensionar la nueva al tamaño de la anterior
    img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))

    # 4. Calcular diferencia absoluta
    diff = cv2.absdiff(img1, img2)
    mean_diff = np.mean(diff)

    # 5. Analizar cambios simples según la diferencia media
    if mean_diff < 10:
        analisis = "Cambio muy leve. No se observan diferencias visibles significativas."
    elif mean_diff < 30:
        analisis = "Progreso leve: ligera tonificación, pequeña pérdida de grasa o aumento de definición."
    elif mean_diff < 60:
        analisis = "Progreso notable: cambios visibles en brazos, pecho y abdomen. Puede haber pérdida de grasa o ganancia muscular."
    else:
        analisis = "Cambio extremo: grandes diferencias visuales. Posible pérdida significativa de grasa, aumento de definición y mayor musculatura."

    # 6. Añadir recomendaciones/humanización (opcional)
    detalle = ""
    if mean_diff >= 30:
        detalle += "Se observa mayor definición en brazos y pecho. "
        if mean_diff > 50:
            detalle += "Abdomen más marcado y cambio de postura notable."

    # 7. Devolver el resultado como JSON-friendly
    resultado = {
        "analisis": analisis + (" " + detalle if detalle else ""),
        "diferencia_media": float(mean_diff),
        "nota": "Mientras más alta la diferencia, mayor el cambio entre fotos."
    }

    return resultado