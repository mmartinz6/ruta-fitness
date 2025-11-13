import cv2
import numpy as np
import requests
import traceback
from typing import Optional, Union

def _descargar_e_decodificar(url: str) -> Optional[np.ndarray]:
    """Descarga una imagen de una URL y la decodifica usando OpenCV."""
    try:
        # Petición HTTP con timeout para evitar cuelgues
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status() # Lanza error para códigos 4xx/5xx
        
        # Lee el contenido como un array de bytes
        arr = np.asarray(bytearray(response.content), dtype=np.uint8)
        
        # Decodifica la imagen. cv2.IMREAD_COLOR = 1
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("No se pudo decodificar la imagen.")
            
        return img
    
    except requests.exceptions.RequestException as e:
        print(f"Error de red/descarga para {url}: {e}")
        return None
    except Exception as e:
        print(f"Error general al procesar la imagen {url}: {e}")
        return None


def comparar_progresos_opencv(foto1_url: str, foto2_url: str) -> str:
    """
    Compara dos imágenes de progreso físico (antes/después) usando la Diferencia Absoluta (AbsDiff) 
    y devuelve un análisis de texto.
    """
    img1 = _descargar_e_decodificar(foto1_url)
    img2 = _descargar_e_decodificar(foto2_url)

    if img1 is None or img2 is None:
        return "Análisis IA fallido: Al menos una de las imágenes no se pudo descargar o decodificar. Verifique que las URLs sean públicas."

    try:
        # 1. Preprocesamiento: Asegurar el mismo tamaño
        ancho, alto = 600, 800
        img1_redim = cv2.resize(img1, (ancho, alto))
        img2_redim = cv2.resize(img2, (ancho, alto))
        
        # 2. Convertir a escala de grises
        gris1 = cv2.cvtColor(img1_redim, cv2.COLOR_BGR2GRAY)
        gris2 = cv2.cvtColor(img2_redim, cv2.COLOR_BGR2GRAY)

        # 3. Diferencia Absoluta (AbsDiff): Resalta los cambios entre las fotos
        diferencia = cv2.absdiff(gris1, gris2)
        
        # 4. Umbral: Resaltar solo las diferencias significativas (ej. diferencia de tono > 30)
        _, umbral = cv2.threshold(diferencia, 30, 255, cv2.THRESH_BINARY)
        
        # 5. Cálculo: Contar cuántos píxeles cambiaron
        pixeles_diferentes = np.count_nonzero(umbral)
        total_pixeles = ancho * alto
        porcentaje_cambio = (pixeles_diferentes / total_pixeles) * 100

        # 6. Análisis: Generar el informe
        if porcentaje_cambio > 10:
            return f"Análisis IA: ¡Excelente progreso! El {porcentaje_cambio:.2f}% de la imagen muestra cambios significativos en forma y composición. Esto indica una alta efectividad de tu rutina."
        elif porcentaje_cambio > 5:
            return f"Análisis IA: Progreso detectado. Se ha registrado un {porcentaje_cambio:.2f}% de cambio. Revisa la alineación de tus fotos para un análisis más preciso."
        else:
            return f"Análisis IA: Cambio sutil ({porcentaje_cambio:.2f}%). Sugerimos revisar la iluminación y la postura en ambas fotos para asegurar la fiabilidad de la comparación."

    except Exception as e:
        print(f"Error interno de OpenCV: {traceback.format_exc()}")
        return f"Error fatal durante el procesamiento de imágenes: {e}"

        