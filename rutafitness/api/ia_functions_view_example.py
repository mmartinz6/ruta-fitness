import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt 

# IMPORTANTE: 
# Asegúrate de que esta línea de importación sea correcta para tu estructura de carpetas.
# Si tu función está en 'ia_functions.py' en la misma carpeta 'api', usa '.ia_functions'
from .ia_functions import comparar_progresos_opencv 

@csrf_exempt 
def comparar_fotos_view(request):
    """
    Función de vista (endpoint POST) que:
    1. Recibe dos URLs de imagen de Cloudinary desde el frontend (React).
    2. Llama a 'comparar_progresos_opencv' para realizar el análisis de IA.
    3. Devuelve el resultado del análisis (un string con el progreso) a React.
    
    Ruta esperada: /api/comparar-opencv/
    """
    # Solo procesamos solicitudes POST, que es el método que usará el frontend para enviar datos.
    if request.method == 'POST':
        try:
            # 1. Decodificar el cuerpo de la solicitud (que viene como JSON)
            data = json.loads(request.body)
            foto1_url = data.get('foto1_url') # URL de la foto anterior
            foto2_url = data.get('foto2_url') # URL de la foto más reciente

            if not foto1_url or not foto2_url:
                # Si faltan datos, devuelve un error 400 (Bad Request)
                return JsonResponse({"error": "Debes proporcionar ambas URLs (foto1_url y foto2_url)."}, status=400)

            # 2. Ejecutar la lógica de análisis de OpenCV/IA
            analisis_resultado = comparar_progresos_opencv(foto1_url, foto2_url)
            
            # 3. Devolver el resultado de la función de IA
            return JsonResponse({"resultado": analisis_resultado})

        except json.JSONDecodeError:
            # Si el JSON es inválido
            return JsonResponse({"error": "Formato de cuerpo de solicitud JSON inválido."}, status=400)
        
        except Exception as e:
            # Manejo general de cualquier otro error (ej. fallos en la descarga o procesamiento de OpenCV)
            print(f"Error al procesar la comparación de fotos: {e}")
            return JsonResponse({
                "error": "Error interno del servidor al procesar las imágenes.", 
                "details": str(e)
            }, status=500)

    # Si se accede con un método diferente a POST, devolvemos un error 405
    return JsonResponse({"error": "Método no permitido. Por favor, use POST."}, status=405)