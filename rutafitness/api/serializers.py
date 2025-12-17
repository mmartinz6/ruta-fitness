from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

User = get_user_model()
UserGroup = User.groups.through


# USUARIOS / PERFIL
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'date_joined', 'is_active', 'password'
        )
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
        }

    def validate_username(self, value):
        if self.instance and self.instance.username == value:
            return value
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def validate_email(self, value):
        if self.instance and self.instance.email == value:
            return value
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)

        if password:
            instance.password = make_password(password)
            instance.save()

        return instance


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'


class UserGroupSerializers(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = UserGroup
        fields = '__all__'
        # Devuelve: id, user, group, group_name

    def validate(self, data):
        if UserGroup.objects.filter(user_id=data['user'], group_id=data['group']).exists():
            raise serializers.ValidationError("Ya tiene ese grupo asignado.")
        return data
    

# RUTINAS Y EJERCICIOS
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class EjercicioSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    class Meta:
        model = Ejercicio
        fields = ('id', 'nombre', 'descripcion', 'video_url', 'imagen_url', 
                  'nivel', 'categoria', 'categoria_nombre')


class RutinaEjercicioSerializer(serializers.ModelSerializer):
    ejercicio = EjercicioSerializer(read_only=True)

    class Meta:
        model = RutinaEjercicio
        fields = ('repeticiones', 'descanso', 'orden', 'ejercicio')


class RutinaSerializer(serializers.ModelSerializer):
    entrenador_username = serializers.CharField(source='entrenador.username', read_only=True)
    ejercicios_rutina = RutinaEjercicioSerializer(source='rutina_ejercicios', many=True, read_only=True)

    class Meta:
        model = Rutina
        fields = ('id', 'nombre', 'descripcion', 'nivel', 'fecha_creacion', 
                  'entrenador', 'entrenador_username', 'ejercicios_rutina')


class UsuarioRutinaSerializer(serializers.ModelSerializer):
    rutina = RutinaSerializer(read_only=True)
    rutina_nombre = serializers.CharField(source='rutina.nombre', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = UsuarioRutina
        fields = (
            'id',
            'usuario',
            'usuario_username',
            'rutina',
            'rutina_nombre',
            'estado',
            'fecha_asignacion',
            'fecha_fin',
        )
        read_only_fields = ('usuario', 'fecha_asignacion')


# HISTORIAL DE ACTIVIDADES
class HistorialActividadesSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    rutina_nombre = serializers.CharField(source='rutina.nombre', read_only=True)

    class Meta:
        model = HistorialActividades
        fields = '__all__'
        read_only_fields = ('usuario', 'rutina')


#PROGRESO SERIES
class ProgresoSerieSerializer(serializers.ModelSerializer):
    ejercicio_nombre = serializers.CharField(source='ejercicio.nombre', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = ProgresoSerie
        fields = ['id', 'usuario', 'usuario_username', 'usuario_rutina', 'ejercicio', 'ejercicio_nombre', 'serie_numero', 'completado', 'fecha']
        read_only_fields = ['usuario', 'fecha']


# PROGRESO Y COMPARACIÓN IA
class ProgresoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgresoUsuario
        fields = '__all__'
        read_only_fields = ('usuario', 'fecha_registro')


class ComparacionIASerializer(serializers.ModelSerializer):
    class Meta:
        model = ComparacionIA
        fields = '__all__'
        read_only_fields = ('usuario', 'resultado', 'fecha_comparacion')



# COMUNIDAD Y CHAT
#------------------------------------------ chat entre entrenador y alumno ------------------------------------------#

from .models import Conversacion, MensajeChat

class ConversacionSerializer(serializers.ModelSerializer):
    entrenador_username = serializers.CharField(source="entrenador.username", read_only=True)
    alumno_username = serializers.CharField(source="alumno.username", read_only=True)

    class Meta:
        model = Conversacion
        fields = [
            "id",
            "entrenador",
            "entrenador_username",
            "alumno",
            "alumno_username",
            "fecha_inicio",
            "ultima_actualizacion",
        ]
        read_only_fields = ["fecha_inicio", "ultima_actualizacion"]


class MensajeChatSerializer(serializers.ModelSerializer):
    usuario_emisor_username = serializers.CharField(
        source="usuario_emisor.username",
        read_only=True
    )

    class Meta:
        model = MensajeChat
        fields = [
            "id",
            "conversacion",
            "usuario_emisor",
            "usuario_emisor_username",
            "contenido",
            "archivo_url",
            "fecha_envio",
            "leido",
        ]
        read_only_fields = ["usuario_emisor", "fecha_envio", "leido"]


class ComentarioPostSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    respuestas = serializers.SerializerMethodField()

    class Meta:
        model = ComentarioPost
        fields = '__all__'
        read_only_fields = ('usuario', 'post', 'fecha_publicacion')

    def get_respuestas(self, obj):
        return ComentarioPostSerializer(obj.respuestas.all(), many=True).data


class ReaccionPostSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = ReaccionPost
        fields = '__all__'
        read_only_fields = ('usuario', 'post', 'fecha')


class ComunidadPostSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.first_name', read_only=True)
    usuario_apellido = serializers.CharField(source='usuario.last_name', read_only=True)

    num_reacciones = serializers.SerializerMethodField()
    num_comentarios = serializers.SerializerMethodField()

    class Meta:
        model = ComunidadPost
        fields = (
            'id', 'usuario', 'usuario_username', 'usuario_nombre', 'usuario_apellido',
            'contenido', 'imagen_url', 'fecha_publicacion',
            'num_reacciones', 'num_comentarios'
        )
        read_only_fields = ('usuario', 'fecha_publicacion')

    def get_num_reacciones(self, obj):
        return obj.reacciones.count()

    def get_num_comentarios(self, obj):
        return obj.comentarios.count()


# GAMIFICACIÓN Y CONTENIDO
class LogroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logro
        fields = '__all__'


class UsuarioLogroSerializer(serializers.ModelSerializer):
    logro = LogroSerializer(read_only=True)

    class Meta:
        model = UsuarioLogro
        fields = '__all__'
        read_only_fields = ('usuario', 'fecha_obtenido')


class BienestarContenidoSerializer(serializers.ModelSerializer):
    autor_username = serializers.CharField(source='autor.username', read_only=True)

    class Meta:
        model = BienestarContenido
        fields = '__all__'
        read_only_fields = ('autor', 'fecha_publicacion')

# TOKEN
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        # Intento 1: Autenticación por username directo
        user = authenticate(username=username_or_email, password=password)

        # Intento 2: Buscar email
        if user is None:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if user is None:
            raise serializers.ValidationError({
                "detail": "Credenciales inválidas."
            })

        # JWT necesita el username real
        attrs["username"] = user.username  

        data = super().validate(attrs)

        # Obtener el rol del grupo
        groups = list(user.groups.values_list("name", flat=True))
        role = groups[0] if groups else None

        data["id"] = user.id
        data["username"] = user.username
        data["email"] = user.email
        data["role"] = role

        return data
    

# CONTACTO MENSAJES EMAIL
class ContactoSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()


# ==================== RUTINA DIARIA ====================
class RutinaDiaEjercicioSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre = serializers.CharField()
    descripcion = serializers.CharField()
    video_url = serializers.CharField(allow_null=True)
    repeticiones = serializers.CharField()
    descanso = serializers.CharField()
    series_completadas = serializers.IntegerField()
    total_series = serializers.IntegerField()
    activo = serializers.BooleanField()


class CompletarSerieSerializer(serializers.Serializer):
    ejercicio_id = serializers.IntegerField()
    serie_numero = serializers.IntegerField()


# Serializer para ejercicios de la rutina editable por entrenador
class RutinaEjercicioEntrenadorSerializer(serializers.ModelSerializer):
    nombre_ejercicio = serializers.CharField(source='ejercicio.nombre', read_only=True)
    descripcion = serializers.CharField(source='ejercicio.descripcion', read_only=True)
    video_url = serializers.CharField(source='ejercicio.video_url', read_only=True)

    class Meta:
        model = RutinaEjercicio
        fields = ['id', 'ejercicio', 'nombre_ejercicio', 'descripcion', 'video_url', 'orden']

# Serializer para rutina completa editable por entrenador
class UsuarioRutinaEntrenadorSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    ejercicios = RutinaEjercicioEntrenadorSerializer(many=True, source='rutina.rutina_ejercicios')  # <-- CORRECCIÓN

    class Meta:
        model = UsuarioRutina
        fields = ['id', 'usuario', 'usuario_username', 'rutina', 'estado', 'ejercicios']
