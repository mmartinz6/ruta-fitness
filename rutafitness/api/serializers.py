from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

UserGroup = User.groups.through


# PERFIL Y AUTENTICACIÓN
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    # --- Validaciones ---
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value

    # --- Encriptar la contraseña antes de guardar ---
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'

class UserGroupSerializers(serializers.ModelSerializer):
    class Meta:
        model=UserGroup
        fields = '__all__'     
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
                  'nivel', 'duracion_estimada', 'categoria', 'categoria_nombre')


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
    rutina_nombre = serializers.CharField(source='rutina.nombre', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = UsuarioRutina
        fields = '__all__'
        read_only_fields = ('fecha_asignacion', 'usuario')


# HISTORIAL DE ACTIVIDADES
class HistorialActividadesSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    rutina_nombre = serializers.CharField(source='rutina.nombre', read_only=True)

    class Meta:
        model = HistorialActividades
        fields = '__all__'
        read_only_fields = ('usuario', 'fecha', 'rutina')


# PROGRESO Y COMPARACIÓN IA
class ProgresoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgresoUsuario
        fields = '__all__'
        read_only_fields = ('usuario', 'fecha_registro', 'analisis_ia')


class ComparacionIASerializer(serializers.ModelSerializer):
    class Meta:
        model = ComparacionIA
        fields = '__all__'
        read_only_fields = ('usuario', 'resultado', 'fecha_comparacion')



    # COMUNIDAD Y CHAT
class ConversacionSerializer(serializers.ModelSerializer):
    entrenador_username = serializers.CharField(source='entrenador.username', read_only=True)
    alumno_username = serializers.CharField(source='alumno.username', read_only=True)

    class Meta:
        model = Conversacion
        fields = '__all__'


class MensajeChatSerializer(serializers.ModelSerializer):
    usuario_emisor_username = serializers.CharField(source='usuario_emisor.username', read_only=True)

    class Meta:
        model = MensajeChat
        fields = '__all__'
        read_only_fields = ('usuario_emisor', 'fecha_envio')


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

#TOKEN
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        # Buscar usuario por username o email
        user = User.objects.filter(username=username_or_email).first() or \
               User.objects.filter(email=username_or_email).first()

        if user and user.check_password(password):
            attrs["username"] = user.username
            data = super().validate(attrs)

            # Agregar info extra
            groups = user.groups.values_list('name', flat=True)
            data['role'] = groups[0] if groups else None
            data['id'] = user.id
            return data

        raise serializers.ValidationError("Usuario o contraseña incorrectos")

