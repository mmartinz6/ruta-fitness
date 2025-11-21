from django.urls import path
from . import views

urlpatterns = [

    # === PERFIL USUARIO ===
    path('usuarios/', views.UsuariosListCreateView.as_view(), name='usuarios-list-create'),
    path('usuarios/<int:pk>/', views.UsuariosDetailView.as_view(), name='usuarios-detail'),

    path('usuariosD/', views.UserDListCreateView.as_view(), name='usuariosd-list-create'),
    path('usergroup/', views.UserGroupView.as_view(), name='usergroup-listar-crear'),

    # === TOKEN ===
    path('api/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # === CATEGORÍA ===
    path('categorias/', views.CategoriaListCreateView.as_view(), name='categoria-list-create'),
    path('categorias/<int:pk>/', views.CategoriaDetailView.as_view(), name='categoria-detail'),

    # === EJERCICIO ===
    path('ejercicios/', views.EjercicioListCreateView.as_view(), name='ejercicio-list-create'),
    path('ejercicios/<int:pk>/', views.EjercicioDetailView.as_view(), name='ejercicio-detail'),

    # === RUTINA ===
    path('rutinas/', views.RutinaListCreateView.as_view(), name='rutina-list-create'),
    path('rutinas/<int:pk>/', views.RutinaDetailView.as_view(), name='rutina-detail'),

    # === RUTINA-EJERCICIO (Intermedia) ===
    path('rutina-ejercicios/', views.RutinaEjercicioListCreateView.as_view(), name='rutinaejercicio-list-create'),
    path('rutina-ejercicios/<int:pk>/', views.RutinaEjercicioDetailView.as_view(), name='rutinaejercicio-detail'),

    # === USUARIO-RUTINA (Asignaciones) ===
    path('usuario-rutinas/', views.UsuarioRutinaListCreateView.as_view(), name='usuariorutina-list-create'),
    path('usuario-rutinas/<int:pk>/', views.UsuarioRutinaDetailView.as_view(), name='usuariorutina-detail'),

    # === HISTORIAL DE ACTIVIDADES ===
    path('historial-actividades/', views.HistorialActividadesListCreateView.as_view(), name='historialactividades-list-create'),
    path('historial-actividades/<int:pk>/', views.HistorialActividadesDetailView.as_view(), name='historialactividades-detail'),

    # === PROGRESO USUARIO ===
    path('progresos-usuario/', views.ProgresoUsuarioListCreateView.as_view(), name='progresousuario-list-create'),
    path('progresos-usuario/<int:pk>/', views.ProgresoUsuarioDetailView.as_view(), name='progresousuario-detail'),

    # === COMPARACIÓN IA ===
    path('comparaciones-ia/', views.ComparacionIAListCreateView.as_view(), name='comparacionia-list-create'),
    path('comparaciones-ia/<int:pk>/', views.ComparacionIADetailView.as_view(), name='comparacionia-detail'),

    # === LOGROS ===
    path('logros/', views.LogroListCreateView.as_view(), name='logro-list-create'),
    path('logros/<int:pk>/', views.LogroDetailView.as_view(), name='logro-detail'),

    # === USUARIO LOGROS ===
    path('usuario-logros/', views.UsuarioLogroListCreateView.as_view(), name='usuariologro-list-create'),
    path('usuario-logros/<int:pk>/', views.UsuarioLogroDetailView.as_view(), name='usuariologro-detail'),

    # === BIENESTAR CONTENIDO ===
    path('bienestar-contenido/', views.BienestarContenidoListCreateView.as_view(), name='bienestarcontenido-list-create'),
    path('bienestar-contenido/<int:pk>/', views.BienestarContenidoDetailView.as_view(), name='bienestarcontenido-detail'),

    # === COMUNIDAD / FORO ===
    path('comunidad-posts/', views.ComunidadPostListCreateView.as_view(), name='comunidadpost-list-create'),
    path('comunidad-posts/<int:pk>/', views.ComunidadPostDetailView.as_view(), name='comunidadpost-detail'),

    # === COMENTARIOS EN POSTS ===
    path('comentario-posts/', views.ComentarioPostListCreateView.as_view(), name='comentariopost-list-create'),
    path('comentario-posts/<int:pk>/', views.ComentarioPostDetailView.as_view(), name='comentariopost-detail'),

    # === REACCIONES A POSTS ===
    path('posts/<int:post_id>/toggle-like/', views.ToggleLikePostView.as_view(), name='toggle-like-post'),

    # === CHAT (Usuario ↔ Entrenador) ===
    path('conversaciones/', views.ConversacionListCreateView.as_view(), name='conversacion-list-create'),
    path('conversaciones/<int:pk>/', views.ConversacionDetailView.as_view(), name='conversacion-detail'),

    # === MENSAJES EN CHAT ===
    path('mensajes-chat/', views.MensajeChatListCreateView.as_view(), name='mensajechat-list-create'),
    path('mensajes-chat/<int:pk>/', views.MensajeChatDetailView.as_view(), name='mensajechat-detail'),
]
