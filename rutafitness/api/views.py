from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import *
from .serializers import *
from .ia_functions import comparar_progresos_opencv
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()
UserGroup = User.groups.through


# ========= UTILS ============
def get_authenticated_user(request):
    """Devuelve el usuario autenticado o lanza error."""
    if not request.user or request.user.is_anonymous:
        raise PermissionDenied("Debe iniciar sesión para realizar esta acción.")
    return request.user


# ========= USER GROUP ============
class UserGroupView(ListCreateAPIView):
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializers


# ========= USUARIOS ============
class UsuariosListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer

    def perform_create(self, serializer):
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


# ========= CATEGORIA ============
class CategoriaListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


# ========= EJERCICIO ============
class EjercicioListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer


class EjercicioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer


# ========= RUTINA ============
class RutinaListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Rutina.objects.all()
    serializer_class = RutinaSerializer


class RutinaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Rutina.objects.all()
    serializer_class = RutinaSerializer


# ========= RUTINA EJERCICIO ============
class RutinaEjercicioListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = RutinaEjercicio.objects.all()
    serializer_class = RutinaEjercicioSerializer


class RutinaEjercicioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = RutinaEjercicio.objects.all()
    serializer_class = RutinaEjercicioSerializer


# ========= USUARIO RUTINA ============
class UsuarioRutinaListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = UsuarioRutina.objects.all()
    serializer_class = UsuarioRutinaSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        serializer.save(usuario=user)


class UsuarioRutinaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = UsuarioRutina.objects.all()
    serializer_class = UsuarioRutinaSerializer


# ========= HISTORIAL ACTIVIDADES ============
class HistorialActividadesListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = HistorialActividades.objects.all()
    serializer_class = HistorialActividadesSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        serializer.save(usuario=user)


class HistorialActividadesDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = HistorialActividades.objects.all()
    serializer_class = HistorialActividadesSerializer


# ========= PROGRESO USUARIO ============
class ProgresoUsuarioListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        progreso = serializer.save(usuario=user)


class ProgresoUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer


# ========= COMPARACIÓN IA ============
class ComparacionIAListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComparacionIA.objects.all()
    serializer_class = ComparacionIASerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        comparacion = serializer.save(usuario=user)

        foto_anterior = comparacion.foto_anterior
        foto_nueva = comparacion.foto_nueva

        if foto_anterior and foto_nueva:
            resultado = comparar_progresos_opencv(foto_anterior, foto_nueva)
        else:
            resultado = "Error: Fotos no válidas."

        comparacion.resultado = resultado
        comparacion.save()


class ComparacionIADetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComparacionIA.objects.all()
    serializer_class = ComparacionIASerializer


# ========= LOGRO ============
class LogroListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Logro.objects.all()
    serializer_class = LogroSerializer


class LogroDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Logro.objects.all()
    serializer_class = LogroSerializer


# ========= USUARIO LOGRO ============
class UsuarioLogroListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = UsuarioLogro.objects.all()
    serializer_class = UsuarioLogroSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        serializer.save(usuario=user)


class UsuarioLogroDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = UsuarioLogro.objects.all()
    serializer_class = UsuarioLogroSerializer


# ========= BIENESTAR CONTENIDO ============
class BienestarContenidoListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = BienestarContenido.objects.all()
    serializer_class = BienestarContenidoSerializer


class BienestarContenidoDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = BienestarContenido.objects.all()
    serializer_class = BienestarContenidoSerializer


# ========= COMUNIDAD POST ============
class ComunidadPostListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComunidadPost.objects.all().order_by('-fecha_publicacion')
    serializer_class = ComunidadPostSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        serializer.save(usuario=user)


class ComunidadPostDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComunidadPost.objects.all()
    serializer_class = ComunidadPostSerializer


# ========= COMENTARIO POST ============
class ComentarioPostListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComentarioPost.objects.all()
    serializer_class = ComentarioPostSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        serializer.save(usuario=user)


class ComentarioPostDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = ComentarioPost.objects.all()
    serializer_class = ComentarioPostSerializer

# ========= REACCION LIKE POST ============
class ToggleLikePostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        try:
            post = ComunidadPost.objects.get(id=post_id)
        except ComunidadPost.DoesNotExist:
            return Response({"error": "Post no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Verificar si ya existe el like
        reaccion = ReaccionPost.objects.filter(post=post, usuario=user).first()
        if reaccion:
            reaccion.delete()
            return Response({"liked": False, "num_reacciones": post.reacciones.count()})
        else:
            ReaccionPost.objects.create(post=post, usuario=user)
            return Response({"liked": True, "num_reacciones": post.reacciones.count()})

# ========= CONVERSACION ============
class ConversacionListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Conversacion.objects.all()
    serializer_class = ConversacionSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        conversacion = serializer.save()
        conversacion.participantes.add(user)
        conversacion.save()


class ConversacionDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Conversacion.objects.all()
    serializer_class = ConversacionSerializer


# ========= MENSAJE CHAT ============
class MensajeChatListCreateView(ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = MensajeChat.objects.all().order_by('-fecha_envio')
    serializer_class = MensajeChatSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        serializer.save(emisor=user)


class MensajeChatDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = MensajeChat.objects.all()
    serializer_class = MensajeChatSerializer


# ========= TOKEN ============
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer