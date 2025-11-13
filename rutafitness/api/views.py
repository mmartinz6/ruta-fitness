from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model 
from .models import *
from .serializers import *
from .ia_functions import comparar_progresos_opencv
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly 

User = get_user_model() 

#  Función de utilidad temporal para asignar el usuario 
def get_temp_user():
    """Retorna el primer usuario de la base de datos o None."""
    return User.objects.first()

class UsuariosListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer

    def perform_create(self, serializer):
        # Usa el idUser que viene del frontend
        id_user = self.request.data.get("idUser")
        if not id_user:
            raise PermissionDenied("El campo 'idUser' es obligatorio.")

        if Usuarios.objects.filter(idUser_id=id_user).exists():
            raise PermissionDenied("Ya existe un perfil para este usuario.")

        serializer.save(idUser_id=id_user)



class UsuariosDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer

class UserDListCreateView(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

#  CATEGORÍA (Datos Maestros - Ahora abiertos) 
class CategoriaListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

# EJERCICIO (Datos Maestros - 
class EjercicioListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer

class EjercicioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer

#  RUTINA (Datos Maestros - Ahora abiertos) 
class RutinaListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = Rutina.objects.all()
    serializer_class = RutinaSerializer

class RutinaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = Rutina.objects.all()
    serializer_class = RutinaSerializer

#  RUTINA EJERCICIO (Datos Maestros - Ahora abiertos) 
class RutinaEjercicioListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = RutinaEjercicio.objects.all()
    serializer_class = RutinaEjercicioSerializer

class RutinaEjercicioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = RutinaEjercicio.objects.all()
    serializer_class = RutinaEjercicioSerializer

# === USUARIO RUTINA (Datos privados - Ahora abiertos) ===
class UsuarioRutinaListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = UsuarioRutina.objects.all()
    serializer_class = UsuarioRutinaSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=get_temp_user())

class UsuarioRutinaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = UsuarioRutina.objects.all()
    serializer_class = UsuarioRutinaSerializer

# === HISTORIAL ACTIVIDADES (Datos privados - Ahora abiertos) ===
class HistorialActividadesListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = HistorialActividades.objects.all()
    serializer_class = HistorialActividadesSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=get_temp_user())

class HistorialActividadesDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = HistorialActividades.objects.all()
    serializer_class = HistorialActividadesSerializer


#=== PROGRESO USUARIO (Datos privados - Ahora abiertos) ===
class ProgresoUsuarioListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer

    def perform_create(self, serializer):
        # Asigna el usuario temporal para evitar fallos de NULL
        progreso = serializer.save(usuario=get_temp_user()) 
        # Lógica de IA simple comentada

        

class ProgresoUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer


#  COMPARACIÓN IA (Lógica de OpenCV ACTIVADA - Abierta) 
class ComparacionIAListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny] 
    
    #CORRECCIÓN AÑADIDA: Define el queryset para la acción LIST (GET)
    queryset = ComparacionIA.objects.all() 
    
    serializer_class = ComparacionIASerializer
    
    def perform_create(self, serializer):
        temp_user = get_temp_user()
        
        # 1. Guarda el objeto con el usuario temporal
        comparacion = serializer.save(usuario=temp_user)
        
        # 2. Lógica de IA sin .url
        foto_anterior_url = comparacion.foto_anterior if comparacion.foto_anterior else None
        foto_nueva_url = comparacion.foto_nueva if comparacion.foto_nueva else None
        
        # Ejecutar la función de IA
        if foto_anterior_url and foto_nueva_url:
            resultado_analisis = comparar_progresos_opencv(foto_anterior_url, foto_nueva_url)
        else:
            resultado_analisis = "Error: URLs no válidas o no cargadas."

        # 3. Guarda el resultado devuelto por la IA
        comparacion.resultado = resultado_analisis
        comparacion.save()



class ComparacionIADetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComparacionIA.objects.all()
    serializer_class = ComparacionIASerializer

# === LOGROS (Datos Maestros - Ahora abiertos) ===
class LogroListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Logro.objects.all()
    serializer_class = LogroSerializer

class LogroDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Logro.objects.all()
    serializer_class = LogroSerializer

# === USUARIO LOGRO (Datos privados - Ahora abiertos) ===
class UsuarioLogroListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = UsuarioLogro.objects.all()
    serializer_class = UsuarioLogroSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=get_temp_user())

class UsuarioLogroDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = UsuarioLogro.objects.all()
    serializer_class = UsuarioLogroSerializer

# === BIENESTAR CONTENIDO (Datos Maestros - Ahora abiertos) ===
class BienestarContenidoListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = BienestarContenido.objects.all()
    serializer_class = BienestarContenidoSerializer

class BienestarContenidoDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = BienestarContenido.objects.all()
    serializer_class = BienestarContenidoSerializer

# === COMUNIDAD POST (Datos Comunitarios - Ahora abiertos) ===
class ComunidadPostListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = ComunidadPost.objects.all().order_by('-fecha_publicacion')
    serializer_class = ComunidadPostSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=get_temp_user())

class ComunidadPostDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny] 
    queryset = ComunidadPost.objects.all()
    serializer_class = ComunidadPostSerializer

# === COMENTARIO POST (Datos Comunitarios - Ahora abiertos) ===
class ComentarioPostListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComentarioPost.objects.all()
    serializer_class = ComentarioPostSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=get_temp_user())

class ComentarioPostDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComentarioPost.objects.all()
    serializer_class = ComentarioPostSerializer

# === REACCIÓN POST (Datos Comunitarios - Ahora abiertos) ===
class ReaccionPostListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ReaccionPost.objects.all()
    serializer_class = ReaccionPostSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=get_temp_user())

class ReaccionPostDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ReaccionPost.objects.all()
    serializer_class = ReaccionPostSerializer

# === CONVERSACIÓN (Datos privados - Ahora abiertos) ===
class ConversacionListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Conversacion.objects.all()
    serializer_class = ConversacionSerializer
    
    def perform_create(self, serializer):
        conversacion = serializer.save()
        conversacion.participantes.add(get_temp_user())
        conversacion.save()

class ConversacionDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Conversacion.objects.all()
    serializer_class = ConversacionSerializer

# === MENSAJE CHAT (Datos privados - Ahora abiertos) ===
class MensajeChatListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = MensajeChat.objects.all().order_by('-fecha_envio')
    serializer_class = MensajeChatSerializer
    
    def perform_create(self, serializer):
        serializer.save(emisor=get_temp_user())

class MensajeChatDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = MensajeChat.objects.all()
    serializer_class = MensajeChatSerializer