from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from .models import *
from .serializers import *
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly

##############################################################################################
    # === PERFIL USUARIO (Datos privados) ===
class UsuariosListCreateView(ListCreateAPIView):
    # Solo usuarios logueados pueden interactuar
    permission_classes = [permissions.IsAuthenticated] 
    serializer_class = UsuariosSerializer
    
    def get_queryset(self):
        # Filtro de seguridad: Solo permite listar/ver el perfil propio
        return Usuarios.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asigna el usuario logueado automáticamente al crear el perfil
        if Usuarios.objects.filter(usuario=self.request.user).exists():
             raise PermissionDenied("Ya existe un perfil de usuario para esta cuenta.")
        serializer.save(usuario=self.request.user)

class UsuariosDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UsuariosSerializer
    
    def get_queryset(self):
        # Solo permite editar/eliminar el perfil propio
        return Usuarios.objects.filter(usuario=self.request.user)

# === CATEGORÍA (Datos Maestros - Solo Admin/Staff puede modificar) ===
class CategoriaListCreateView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminOrReadOnly] 

class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminOrReadOnly] 

# === EJERCICIO (Datos Maestros - Solo Admin/Staff puede modificar) ===
class EjercicioListCreateView(ListCreateAPIView):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer
    permission_classes = [IsAdminOrReadOnly] 

class EjercicioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer
    permission_classes = [IsAdminOrReadOnly] 

# === RUTINA (Datos Maestros - Solo Admin/Staff puede modificar) ===
class RutinaListCreateView(ListCreateAPIView):
    queryset = Rutina.objects.all()
    serializer_class = RutinaSerializer
    permission_classes = [IsAdminOrReadOnly] 

class RutinaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Rutina.objects.all()
    serializer_class = RutinaSerializer
    permission_classes = [IsAdminOrReadOnly] 

# === RUTINA EJERCICIO (Datos Maestros - Solo Admin/Staff puede modificar) ===
class RutinaEjercicioListCreateView(ListCreateAPIView):
    queryset = RutinaEjercicio.objects.all()
    serializer_class = RutinaEjercicioSerializer
    permission_classes = [IsAdminOrReadOnly] 

class RutinaEjercicioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = RutinaEjercicio.objects.all()
    serializer_class = RutinaEjercicioSerializer
    permission_classes = [IsAdminOrReadOnly] 

# === USUARIO RUTINA (Datos privados - Solo ve sus asignaciones) ===
class UsuarioRutinaListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UsuarioRutinaSerializer
    
    def get_queryset(self):
        # Filtra para ver solo las rutinas asignadas al usuario logueado
        return UsuarioRutina.objects.filter(usuario=self.request.user)
    
    def perform_create(self, serializer):
        # Asigna el usuario que está marcando la rutina (asume que la rutina_id la envía el frontend)
        serializer.save(usuario=self.request.user)

class UsuarioRutinaDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UsuarioRutinaSerializer
    
    def get_queryset(self):
        # Asegura que solo pueda modificar su propia asignación
        return UsuarioRutina.objects.filter(usuario=self.request.user)

# === HISTORIAL ACTIVIDADES (Datos privados) ===
class HistorialActividadesListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HistorialActividadesSerializer
    
    def get_queryset(self):
        # Filtra para ver solo el historial del usuario logueado
        return HistorialActividades.objects.filter(usuario=self.request.user)
    
    def perform_create(self, serializer):
        # Asigna el usuario que está registrando la actividad
        serializer.save(usuario=self.request.user)

class HistorialActividadesDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HistorialActividadesSerializer
    
    def get_queryset(self):
        # Asegura que solo pueda ver/modificar su propio historial
        return HistorialActividades.objects.filter(usuario=self.request.user)

# === PROGRESO USUARIO (Datos privados con Lógica de IA) ===
class ProgresoUsuarioListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProgresoUsuarioSerializer

    def get_queryset(self):
        return ProgresoUsuario.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        progreso = serializer.save(usuario=self.request.user)
        
        # 🚨 LÓGICA DE IA SIMPLE (Cálculo inmediato)
        # Aquí se ejecutaría la IA para la foto individual si es necesario.
        # from .ia_functions import analizar_progreso_simple 
        # resultado_ia = analizar_progreso_simple(progreso)
        # progreso.analisis_ia = resultado_ia
        # progreso.save()
        
class ProgresoUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProgresoUsuarioSerializer
    
    def get_queryset(self):
        return ProgresoUsuario.objects.filter(usuario=self.request.user)

# === COMPARACIÓN IA (Datos privados con Lógica de IA) ===
class ComparacionIAListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ComparacionIASerializer
    
    def get_queryset(self):
        return ComparacionIA.objects.filter(usuario=self.request.user).order_by('-fecha_comparacion')

    def perform_create(self, serializer):
        comparacion = serializer.save(usuario=self.request.user)
        
        # LÓGICA DE COMPARACIÓN DE IMÁGENES (OpenCV)
        # Aquí se invocaría la función de OpenCV para procesar foto_anterior y foto_nueva.
        # from .ia_functions import comparar_progresos_opencv
        # resultado_analisis = comparar_progresos_opencv(comparacion.foto_anterior, comparacion.foto_nueva)
        # comparacion.resultado = resultado_analisis
        # comparacion.save()

class ComparacionIADetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ComparacionIASerializer
    
    def get_queryset(self):
        return ComparacionIA.objects.filter(usuario=self.request.user)

# === LOGROS (Datos Maestros - Solo Admin/Staff puede modificar) ===
class LogroListCreateView(ListCreateAPIView):
    queryset = Logro.objects.all()
    serializer_class = LogroSerializer
    permission_classes = [IsAdminOrReadOnly]

class LogroDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Logro.objects.all()
    serializer_class = LogroSerializer
    permission_classes = [IsAdminOrReadOnly]

# === USUARIO LOGRO (Datos privados - Solo ve sus logros obtenidos) ===
class UsuarioLogroListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UsuarioLogroSerializer
    
    def get_queryset(self):
        # Solo muestra los logros obtenidos por el usuario actual
        return UsuarioLogro.objects.filter(usuario=self.request.user)
    
    # Nota: No se requiere perform_create aquí, los logros se asignan por la lógica de negocio

class UsuarioLogroDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UsuarioLogroSerializer
    
    def get_queryset(self):
        # Asegura que solo pueda ver/borrar sus propios logros obtenidos
        return UsuarioLogro.objects.filter(usuario=self.request.user)

# === BIENESTAR CONTENIDO (Datos Maestros - Solo Admin/Staff puede modificar) ===
class BienestarContenidoListCreateView(ListCreateAPIView):
    queryset = BienestarContenido.objects.all()
    serializer_class = BienestarContenidoSerializer
    permission_classes = [IsAdminOrReadOnly]

class BienestarContenidoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = BienestarContenido.objects.all()
    serializer_class = BienestarContenidoSerializer
    permission_classes = [IsAdminOrReadOnly]

# === COMUNIDAD POST (Datos Comunitarios - Requiere propiedad para editar) ===
class ComunidadPostListCreateView(ListCreateAPIView):
    # Cualquiera logueado puede crear, cualquiera puede leer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 
    queryset = ComunidadPost.objects.all().order_by('-fecha_publicacion')
    serializer_class = ComunidadPostSerializer
    
    def perform_create(self, serializer):
        # Asigna el usuario logueado como autor del post
        serializer.save(usuario=self.request.user)

class ComunidadPostDetailView(RetrieveUpdateDestroyAPIView):
    # Solo el dueño del post puede editar/eliminarlo
    permission_classes = [IsOwnerOrReadOnly] 
    queryset = ComunidadPost.objects.all()
    serializer_class = ComunidadPostSerializer

# === COMENTARIO POST (Datos Comunitarios - Requiere propiedad para editar) ===
class ComentarioPostListCreateView(ListCreateAPIView):
    # Cualquiera logueado puede crear, cualquiera puede leer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ComentarioPost.objects.all()
    serializer_class = ComentarioPostSerializer
    
    def perform_create(self, serializer):
        # Asigna el usuario logueado como autor del comentario
        serializer.save(usuario=self.request.user)

class ComentarioPostDetailView(RetrieveUpdateDestroyAPIView):
    # Solo el dueño del comentario puede editar/eliminarlo
    permission_classes = [IsOwnerOrReadOnly]
    queryset = ComentarioPost.objects.all()
    serializer_class = ComentarioPostSerializer

# === REACCIÓN POST (Datos Comunitarios - Requiere propiedad para editar) ===
class ReaccionPostListCreateView(ListCreateAPIView):
    # Cualquiera logueado puede crear (no aplica IsOwnerOrReadOnly a la creación)
    permission_classes = [permissions.IsAuthenticated]
    queryset = ReaccionPost.objects.all()
    serializer_class = ReaccionPostSerializer
    
    def perform_create(self, serializer):
        # Asigna el usuario logueado como autor de la reacción
        serializer.save(usuario=self.request.user)

class ReaccionPostDetailView(RetrieveUpdateDestroyAPIView):
    # Solo el dueño de la reacción puede editar/eliminarla
    permission_classes = [IsOwnerOrReadOnly]
    queryset = ReaccionPost.objects.all()
    serializer_class = ReaccionPostSerializer

# === CONVERSACIÓN (Datos privados - Solo ve sus conversaciones) ===
class ConversacionListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversacionSerializer
    
    def get_queryset(self):
   
        return Conversacion.objects.filter(participantes=self.request.user)
    
    def perform_create(self, serializer):
        # Asegura que el usuario actual sea uno de los participantes
        conversacion = serializer.save()
        conversacion.participantes.add(self.request.user)
        conversacion.save()

class ConversacionDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversacionSerializer
    
    def get_queryset(self):
        # Solo permite operar en conversaciones de las que es participante
        return Conversacion.objects.filter(participantes=self.request.user)

# === MENSAJE CHAT (Datos privados - Solo ve mensajes de sus conversaciones) ===
class MensajeChatListCreateView(ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = MensajeChat.objects.all().order_by('-fecha_envio')
    serializer_class = MensajeChatSerializer
    
    def get_queryset(self):
        # Filtra mensajes basados en las conversaciones del usuario
        conversaciones_ids = Conversacion.objects.filter(participantes=self.request.user).values_list('id', flat=True)
        return MensajeChat.objects.filter(conversacion_id__in=conversaciones_ids).order_by('fecha_envio')
        
    def perform_create(self, serializer):
        # Asigna el usuario logueado como emisor del mensaje
        serializer.save(emisor=self.request.user)

class MensajeChatDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MensajeChatSerializer
    
    def get_queryset(self):
        # Filtra mensajes basados en las conversaciones del usuario
        conversaciones_ids = Conversacion.objects.filter(participantes=self.request.user).values_list('id', flat=True)
        return MensajeChat.objects.filter(conversacion_id__in=conversaciones_ids)