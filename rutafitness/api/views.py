from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import *
from .serializers import *
from rest_framework import permissions

# === PERFIL USUARIO ===
class UsuariosListCreateView(ListCreateAPIView):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer

class UsuariosDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer


# === CATEGORÍA ===
class CategoriaListCreateView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# === EJERCICIO ===
class EjercicioListCreateView(ListCreateAPIView):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer

class EjercicioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer


# === RUTINA ===
class RutinaListCreateView(ListCreateAPIView):
    queryset = Rutina.objects.all()
    serializer_class = RutinaSerializer

class RutinaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Rutina.objects.all()
    serializer_class = RutinaSerializer


# === RUTINA EJERCICIO ===
class RutinaEjercicioListCreateView(ListCreateAPIView):
    queryset = RutinaEjercicio.objects.all()
    serializer_class = RutinaEjercicioSerializer

class RutinaEjercicioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = RutinaEjercicio.objects.all()
    serializer_class = RutinaEjercicioSerializer


# === USUARIO RUTINA ===
class UsuarioRutinaListCreateView(ListCreateAPIView):
    queryset = UsuarioRutina.objects.all()
    serializer_class = UsuarioRutinaSerializer

class UsuarioRutinaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = UsuarioRutina.objects.all()
    serializer_class = UsuarioRutinaSerializer


# === HISTORIAL ACTIVIDADES ===
class HistorialActividadesListCreateView(ListCreateAPIView):
    queryset = HistorialActividades.objects.all()
    serializer_class = HistorialActividadesSerializer

class HistorialActividadesDetailView(RetrieveUpdateDestroyAPIView):
    queryset = HistorialActividades.objects.all()
    serializer_class = HistorialActividadesSerializer


# === PROGRESO USUARIO ===
class ProgresoUsuarioListCreateView(ListCreateAPIView):
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer

class ProgresoUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer


# === COMPARACIÓN IA ===
""" class ComparacionIAListCreateView(ListCreateAPIView):
    queryset = ComparacionIA.objects.all()
    serializer_class = ComparacionIASerializer

class ComparacionIADetailView(RetrieveUpdateDestroyAPIView):
    queryset = ComparacionIA.objects.all()
    serializer_class = ComparacionIASerializer """



class ComparacionIAListCreateView(ListCreateAPIView):
    # 1. Seguridad: Solo usuarios logueados pueden acceder
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ComparacionIASerializer
    
    # 2. QuerySet: Solo ve sus propios datos
    def get_queryset(self):
        # Filtra por el usuario logueado
        return ComparacionIA.objects.filter(usuario=self.request.user).order_by('-fecha_comparacion')

    # 3. Lógica: Asignar usuario y ejecutar IA
    def perform_create(self, serializer):
        
        # A. Guardar el objeto con el usuario logueado.
        comparacion = serializer.save(usuario=self.request.user)
    
  
# Continúa en el mismo archivo views.py
class ComparacionIADetailView(RetrieveUpdateDestroyAPIView):
    # 1. Seguridad: Solo usuarios logueados pueden acceder
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ComparacionIASerializer
    
    # 2. QuerySet: Asegura que el PK que se intenta ver/editar pertenece al usuario
    def get_queryset(self):
        # Filtra por el usuario logueado
        return ComparacionIA.objects.filter(usuario=self.request.user)

# === LOGROS ===
class LogroListCreateView(ListCreateAPIView):
    queryset = Logro.objects.all()
    serializer_class = LogroSerializer

class LogroDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Logro.objects.all()
    serializer_class = LogroSerializer


# === USUARIO LOGRO ===
class UsuarioLogroListCreateView(ListCreateAPIView):
    queryset = UsuarioLogro.objects.all()
    serializer_class = UsuarioLogroSerializer

class UsuarioLogroDetailView(RetrieveUpdateDestroyAPIView):
    queryset = UsuarioLogro.objects.all()
    serializer_class = UsuarioLogroSerializer


# === BIENESTAR CONTENIDO ===
class BienestarContenidoListCreateView(ListCreateAPIView):
    queryset = BienestarContenido.objects.all()
    serializer_class = BienestarContenidoSerializer

class BienestarContenidoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = BienestarContenido.objects.all()
    serializer_class = BienestarContenidoSerializer


# === COMUNIDAD POST ===
class ComunidadPostListCreateView(ListCreateAPIView):
    queryset = ComunidadPost.objects.all().order_by('-fecha_publicacion')
    serializer_class = ComunidadPostSerializer

class ComunidadPostDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ComunidadPost.objects.all()
    serializer_class = ComunidadPostSerializer


# === COMENTARIO POST ===
class ComentarioPostListCreateView(ListCreateAPIView):
    queryset = ComentarioPost.objects.all()
    serializer_class = ComentarioPostSerializer

class ComentarioPostDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ComentarioPost.objects.all()
    serializer_class = ComentarioPostSerializer


# === REACCIÓN POST ===
class ReaccionPostListCreateView(ListCreateAPIView):
    queryset = ReaccionPost.objects.all()
    serializer_class = ReaccionPostSerializer

class ReaccionPostDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ReaccionPost.objects.all()
    serializer_class = ReaccionPostSerializer


# === CONVERSACIÓN ===
class ConversacionListCreateView(ListCreateAPIView):
    queryset = Conversacion.objects.all()
    serializer_class = ConversacionSerializer

class ConversacionDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Conversacion.objects.all()
    serializer_class = ConversacionSerializer


# === MENSAJE CHAT ===
class MensajeChatListCreateView(ListCreateAPIView):
    queryset = MensajeChat.objects.all().order_by('-fecha_envio')
    serializer_class = MensajeChatSerializer

class MensajeChatDetailView(RetrieveUpdateDestroyAPIView):
    queryset = MensajeChat.objects.all()
    serializer_class = MensajeChatSerializer