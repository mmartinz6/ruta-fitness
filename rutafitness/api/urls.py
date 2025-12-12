from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .views import ProgresoUsuarioByUserView

router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')

urlpatterns = [

    # === TOKEN ===
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # === USUARIO ACTUAL ===
    path('usuarios/me/', usuario_actual, name='usuario-actual'),

    # === USUARIOS ===
    path('usuarios/', UsuariosListCreateView.as_view(), name='usuarios-list-create'),
    path('usuarios/<int:pk>/', UsuariosDetailView.as_view(), name='usuarios-detail'),

    # === USUARIOS - DATOS DETALLADOS (UserD) ===
    path('usuariosD/', UserDListCreateView.as_view(), name='usuariosd-list-create'),
    path('usuariosD/<int:pk>/', UserDDetailView.as_view(), name='usuariosd-detail'),

    # === USER GROUPS ===
    path('usergroup/', UserGroupView.as_view(), name='usergroup-listar-crear'),
    path('usergroup/<int:pk>/', UserGroupDetailView.as_view(), name='usergroup-detail'),

    # === CATEGORÍAS ===
    path('categorias/', CategoriaListCreateView.as_view(), name='categorias-list-create'),
    path('categorias/<int:pk>/', CategoriaDetailView.as_view(), name='categorias-detail'),

    # === EJERCICIOS ===
    path('ejercicios/', EjercicioListCreateView.as_view(), name='ejercicios-list-create'),
    path('ejercicios/<int:pk>/', EjercicioDetailView.as_view(), name='ejercicios-detail'),

    # === RUTINAS ===
    path('rutinas/', RutinaListCreateView.as_view(), name='rutinas-list-create'),
    path('rutinas/<int:pk>/', RutinaDetailView.as_view(), name='rutinas-detail'),

    # === RUTINA - EJERCICIOS ===
    path('rutina-ejercicios/', RutinaEjercicioListCreateView.as_view(), name='rutina-ejercicios-list-create'),
    path('rutina-ejercicios/<int:pk>/', RutinaEjercicioDetailView.as_view(), name='rutina-ejercicios-detail'),

    # === USUARIO - RUTINA ===
    path('usuario-rutinas/', UsuarioRutinaListCreateView.as_view(), name='usuario-rutinas-list-create'),
    path('usuario-rutinas/<int:pk>/', UsuarioRutinaDetailView.as_view(), name='usuario-rutinas-detail'),

    # === HISTORIAL ACTIVIDADES ===
    path('historial-actividades/', HistorialActividadesListCreateView.as_view(), name='historialactividades-list-create'),
    path('historial-actividades/<int:pk>/', HistorialActividadesDetailView.as_view(), name='historialactividades-detail'),

    # === PROGRESO DEL USUARIO ===
    path('progresos-usuario/', ProgresoUsuarioListCreateView.as_view(), name='progresousuario-list-create'),
    path('progresos-usuario/<int:pk>/', ProgresoUsuarioDetailView.as_view(), name='progresousuario-detail'),
    path('usuarios/<int:user_id>/avances/', ProgresoUsuarioByUserView.as_view(), name='progreso-usuario'),

    # === IA COMPARACIÓN ===
    path('comparaciones-ia/', ComparacionIAListCreateView.as_view(), name='comparacionia-list-create'),
    path('comparaciones-ia/<int:pk>/', ComparacionIADetailView.as_view(), name='comparacionia-detail'),
    path('comparar-fotos/', comparar_fotos_view, name='comparar-fotos'),

    # === LOGROS ===
    path('logros/', LogroListCreateView.as_view(), name='logro-list-create'),
    path('logros/<int:pk>/', LogroDetailView.as_view(), name='logro-detail'),

    # === USUARIO - LOGROS ===
    path('usuario-logros/', UsuarioLogroListCreateView.as_view(), name='usuariologro-list-create'),
    path('usuario-logros/<int:pk>/', UsuarioLogroDetailView.as_view(), name='usuariologro-detail'),

    # === CONTENIDO DE BIENESTAR ===
    path('bienestar-contenido/', BienestarContenidoListCreateView.as_view(), name='bienestarcontenido-list-create'),
    path('bienestar-contenido/<int:pk>/', BienestarContenidoDetailView.as_view(), name='bienestarcontenido-detail'),

    # === COMUNIDAD / FORO ===
    path('comunidad-posts/', ComunidadPostListCreateView.as_view(), name='comunidadpost-list-create'),
    path('comunidad-posts/<int:pk>/', ComunidadPostDetailView.as_view(), name='comunidadpost-detail'),

    # === COMENTARIOS ===
    path('comentario-posts/', ComentarioPostListCreateView.as_view(), name='comentariopost-list-create'),
    path('comentario-posts/<int:pk>/', ComentarioPostDetailView.as_view(), name='comentariopost-detail'),

    # === REACCIONES (LIKE) ===
    path('posts/<int:post_id>/toggle-like/', ToggleLikePostView.as_view(), name='toggle-like-post'),

    # === CHAT ===
    path('conversaciones/', ConversacionListCreateView.as_view(), name='conversacion-list-create'),
    path('conversaciones/<int:pk>/', ConversacionDetailView.as_view(), name='conversacion-detail'),

    path('mensajes-chat/', MensajeChatListCreateView.as_view(), name='mensajechat-list-create'),
    path('mensajes-chat/<int:pk>/', MensajeChatDetailView.as_view(), name='mensajechat-detail'),

    # === CONTACTO EMAIL ===
    path("contacto/", ContactoView.as_view()),

    # === RESUMEN PROCEDURE ===
    path('resumen/', resumen_view, name='resumen'),

    # === ADMIN ROUTER ===
    path('', include(router.urls)),

    # === GENERAR RUTINA ===
    path("generar-rutina/", GenerarRutinaAutomaticaView.as_view(), name="generar_rutina"),
]
