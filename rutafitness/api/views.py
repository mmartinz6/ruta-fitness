import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions, generics
from rest_framework.decorators import api_view, permission_classes

from .models import *
from .serializers import *
from .ia_functions import comparar_progresos_opencv
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.conf import settings


User = get_user_model()
UserGroup = User.groups.through

EXPECTED_IMAGE_DOMAIN = 'cloudinary.com'


# ========= UTILS ============
def get_authenticated_user(request):
    """Devuelve usuario autenticado o None."""
    if request.user and not request.user.is_anonymous:
        return request.user
    return None

 # ========= USUARIO ACTUAL ========= 
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def usuario_actual(request):
    user = request.user

    # Buscar el perfil Usuarios vinculado al auth_user
    try:
        perfil = Usuarios.objects.get(idUser=user.id)
    except Usuarios.DoesNotExist:
        perfil = None

    # Rol desde grupos
    groups = list(user.groups.values_list("name", flat=True))
    role = groups[0] if groups else None

    return Response({
        "id_user": user.id,  # ID del auth_user
        "perfil_id": perfil.id if perfil else None,  # ID real del modelo Usuarios
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "nombre_completo": f"{user.first_name} {user.last_name}".strip(),
        "role": role,
        "perfil": UsuariosSerializer(perfil).data if perfil else None,
    })



# ========= USER GROUP ============
class UserGroupView(ListCreateAPIView):
    queryset = UserGroup.objects.all()
    serializer_class = UserGroupSerializers

class UserGroupDetailView(RetrieveUpdateDestroyAPIView):
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

class UserDDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]  # ajusta si quieres permisos distintos
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
    permission_classes = [permissions.IsAuthenticated]
    queryset = UsuarioRutina.objects.all()
    serializer_class = UsuarioRutinaSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class UsuarioRutinaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = UsuarioRutina.objects.all()
    serializer_class = UsuarioRutinaSerializer


# ========= HISTORIAL ============
class HistorialActividadesListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = HistorialActividades.objects.all()
    serializer_class = HistorialActividadesSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class HistorialActividadesDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = HistorialActividades.objects.all()
    serializer_class = HistorialActividadesSerializer


# ========= PROGRESO USUARIO ============
class ProgresoUsuarioListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class ProgresoUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer


# ========= COMPARACION IA ============
class ComparacionIAListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = ComparacionIA.objects.all()
    serializer_class = ComparacionIASerializer

    def perform_create(self, serializer):
        comparacion = serializer.save(usuario=self.request.user)
        if comparacion.foto_anterior and comparacion.foto_nueva:
            try:
                resultado = comparar_progresos_opencv(
                    comparacion.foto_anterior.url,
                    comparacion.foto_nueva.url
                )
            except Exception as e:
                resultado = f"Error IA: {e}"
        else:
            resultado = "Error: Fotos no válidas."
        comparacion.resultado = resultado
        comparacion.save()


class ComparacionIADetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = ComparacionIA.objects.all()
    serializer_class = ComparacionIASerializer


# ========= LOGROS ============
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
    permission_classes = [permissions.IsAuthenticated]
    queryset = UsuarioLogro.objects.all()
    serializer_class = UsuarioLogroSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class UsuarioLogroDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
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
    serializer_class = ComentarioPostSerializer

    def get_queryset(self):
        # Filtra solo comentarios raíz del post solicitado
        post_id = self.request.query_params.get("post")
        qs = ComentarioPost.objects.filter(respuesta_a=None)

        if post_id:
            qs = qs.filter(post_id=post_id)

        return qs.order_by("-fecha_publicacion")

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)

        post_id = self.request.data.get("post")
        respuesta_id = self.request.data.get("respuesta_a")

        serializer.save(
            usuario=user,
            post_id=post_id,
            respuesta_a_id=respuesta_id
        )

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
    permission_classes = [permissions.IsAuthenticated]
    queryset = MensajeChat.objects.all().order_by('-fecha_envio')
    serializer_class = MensajeChatSerializer

    def perform_create(self, serializer):
        serializer.save(usuario_emisor=self.request.user)


class MensajeChatDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = MensajeChat.objects.all()
    serializer_class = MensajeChatSerializer


# ========= TOKEN ============
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ========= ADMIN ============
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


# ========= IA DIRECTA ============
@csrf_exempt
def comparar_fotos_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
        foto1_url = data.get("foto1_url")
        foto2_url = data.get("foto2_url")
        user = request.user if request.user.is_authenticated else None

        if not foto1_url or not foto2_url:
            return JsonResponse({"error": "Debes enviar foto1_url y foto2_url"}, status=400)

        # Ejecutar la función de comparación
        resultado = comparar_progresos_opencv(foto1_url, foto2_url)

        # Guardar en la base de datos
        from .models import ComparacionIA  # importa tu modelo
        comparacion = ComparacionIA.objects.create(
            usuario=user,
            foto_anterior=foto1_url,
            foto_nueva=foto2_url,
            resultado=resultado  # si quieres guardar como JSON, usa json.dumps(resultado)
        )

        return JsonResponse({"resultado": resultado, "id": comparacion.id}, status=200)

    except Exception as e:
        return JsonResponse({"error": "Error interno", "detalle": str(e)}, status=500)



class ProgresoUsuarioByUserView(generics.ListAPIView):
    serializer_class = ProgresoUsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return ProgresoUsuario.objects.filter(usuario__id=user_id)
    

# ========= CONTACTO MENSAJE EMAIL ============ 
from api.utils.email_service import enviar_correo

class ContactoView(APIView):
    def post(self, request):
        serializer = ContactoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # Guarda en BD
        MensajeContacto.objects.create(
            nombre=data["name"],
            correo=data["email"],
            asunto=data["subject"],
            mensaje=data["message"],
        )

        # Asunto tomado del usuario
        subject = f"Contacto: {data['subject']}"

        # Texto plano
        body = f"""
Nuevo mensaje recibido desde el formulario:

Nombre: {data['name']}
Correo: {data['email']}

Mensaje:
{data['message']}
"""

        # HTML mostrar correo con diseño
        html_body = f"""
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #0A7E3E;">Nuevo mensaje desde el formulario</h2>

    <p><strong>Nombre:</strong> {data['name']}</p>
    <p><strong>Correo:</strong> {data['email']}</p>

    <div style="margin-top: 20px; padding: 15px; background: #f6f6f6; border-left: 4px solid #0A7E3E;">
        <strong>Mensaje:</strong>
        <p>{data['message']}</p>
    </div>

    <p style="margin-top: 30px; font-size: 12px; color: #777;">
        Mensaje generado por el sistema de Ruta Fitness.
    </p>
</div>
"""

        enviar_correo(
            subject=subject,
            body=body,
            destinatarios=[settings.EMAIL_HOST_USER],
            reply_to=[data["email"]],
            html_body=html_body,
        )

        return Response({"success": "Mensaje enviado correctamente"})
    

# ========= LLAMA AL PROCEDURE DEL RESUMEN DEL ADMIN ============
from django.db import connection
from django.http import JsonResponse

def resumen_view(request):
    with connection.cursor() as cursor:
        cursor.execute("CALL obtener_resumen();")
        row = cursor.fetchone()
        data = {
            "usuarios": row[0],
            "entrenadores": row[1],
            "sesiones": row[2],
            "rutinas": row[3]
        }
    return JsonResponse(data)


# ========= GENERAR RUTINA AUTOMATICA ============
from api.utils.generador_rutinas import generar_rutina_automatica

class GenerarRutinaAutomaticaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        usuario_id = request.user.id

        try:
            rutina = generar_rutina_automatica(usuario_id)
            return Response({
                "success": True,
                "rutina_id": rutina.id,
                "mensaje": "Rutina generada correctamente."
            })
        except Exception as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=400)
