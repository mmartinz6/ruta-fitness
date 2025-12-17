from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class Usuarios(models.Model):
    # Clave foránea al usuario de autenticación de Django
    idUser = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Usuarios")

    # NUEVO CAMPO: Sexo
    sexo = models.CharField(
        max_length=10,
        choices=[
            ('masculino', 'Masculino'),
            ('femenino', 'Femenino')
        ],
        default='masculino'  #default masculino
    )

    edad = models.IntegerField()
    peso = models.DecimalField(max_digits=5, decimal_places=2)
    altura = models.DecimalField(max_digits=5, decimal_places=2)

    nivel_actividad = models.CharField(max_length=20, choices=[
        ('bajo', 'Bajo'),
        ('medio', 'Medio'),
        ('alto', 'Alto')
    ])

    # NUEVO CAMPO: Lugar Preferido de Entrenamiento
    lugar_entrenamiento = models.CharField(
        max_length=20,
        choices=[
            ('casa', 'En Casa'),
            ('gimnasio', 'Gimnasio'),
            ('aire_libre', 'Aire Libre')
        ],
        default='casa'
    )

    def __str__(self):
        return f"Perfil de {self.idUser.username}"


#  CATEGORÍAS Y EJERCICIOS 
class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Ejercicio(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name="ejercicios")
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    video_url = models.CharField(max_length=255, null=True, blank=True)
    imagen_url = models.CharField(max_length=255, null=True, blank=True)
    nivel = models.CharField(max_length=20, choices=[
        ('fácil', 'Fácil'),
        ('medio', 'Medio'),
        ('avanzado', 'Avanzado')
    ])

    def __str__(self):
        return f"{self.nombre} ({self.nivel})"


#  RUTINAS Y RELACIÓN CON EJERCICIOS 
class Rutina(models.Model):
    entrenador = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rutinas_creadas")
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    nivel = models.CharField(max_length=20, choices=[
        ('fácil', 'Fácil'),
        ('medio', 'Medio'),
        ('avanzado', 'Avanzado')
    ])
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.entrenador.username}"


class RutinaEjercicio(models.Model):
    rutina = models.ForeignKey(Rutina, on_delete=models.CASCADE, related_name="rutina_ejercicios")
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE, related_name="ejercicio_rutinas")
    repeticiones = models.CharField(max_length=50)
    descanso = models.CharField(max_length=50)
    orden = models.IntegerField()

    def __str__(self):
        return f"{self.rutina.nombre} - {self.ejercicio.nombre}"


# models.py (adiciones y ajustes)

class UsuarioRutina(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rutinas_asignadas")
    rutina = models.ForeignKey(Rutina, on_delete=models.CASCADE, related_name="usuarios_asignados")
    fecha_asignacion = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateField(null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=[('activa', 'Activa'), ('finalizada', 'Finalizada'), ('vencida', 'Vencida')],
        default='activa'
    )
    fecha_ultima_sesion = models.DateField(null=True, blank=True)  # <-- Nuevo campo

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['usuario'],
                condition=models.Q(estado='activa'),
                name='una_sola_rutina_activa_por_usuario'
            )
        ]

    def save(self, *args, **kwargs):
        if not self.fecha_fin:
            self.fecha_fin = timezone.now().date() + timedelta(days=7)
        super().save(*args, **kwargs)

    def sesion_del_dia_completada(self):
        return self.fecha_ultima_sesion == timezone.now().date()



#  HISTORIAL DE ACTIVIDADES 
class HistorialActividades(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="historial_actividades")
    rutina = models.ForeignKey(Rutina, on_delete=models.SET_NULL, null=True, blank=True)
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_realizacion = models.DateTimeField(auto_now_add=True)
    duracion = models.IntegerField(help_text="Duración en minutos")
    calorias_quemadas = models.DecimalField(max_digits=6, decimal_places=2)
    completado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.fecha_realizacion.strftime('%Y-%m-%d')}"
    
# Registrar progreso por serie
class ProgresoSerie(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="progreso_series")
    usuario_rutina = models.ForeignKey(UsuarioRutina, on_delete=models.CASCADE, related_name="progreso_series")
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    serie_numero = models.IntegerField()
    completado = models.BooleanField(default=False)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'usuario_rutina', 'ejercicio', 'serie_numero')

    def completar_serie(self):
        if not self.completado:
            self.completado = True
            self.save()
            # Actualizar fecha de última sesión
            self.usuario_rutina.fecha_ultima_sesion = timezone.now().date()
            self.usuario_rutina.save()


# PROGRESO Y COMPARACIÓN
class ProgresoUsuario(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="progresos", null=True, blank=True)
    peso_actual = models.DecimalField(max_digits=5, decimal_places=2)
    hombros = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    espalda = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    abdomen = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    gluteos = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    pierna1 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    pierna2 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    brazo1 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    brazo2 = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    fecha_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Progreso de {self.usuario.username} - {self.fecha_registro}"


class ComparacionIA(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comparaciones_ia", null=True, blank=True)
    
    #CAMPOS CRÍTICOS AÑADIDOS
    foto_anterior = models.CharField(max_length=255) 
    foto_nueva = models.CharField(max_length=255)
    
    resultado = models.TextField(blank=True, null=True) 
    fecha_comparacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comparación de {self.usuario.username} ({self.fecha_comparacion.date()})"


#  LOGROS 
class Logro(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    icono_url = models.CharField(max_length=255)
    criterio = models.TextField()

    def __str__(self):
        return self.nombre


class UsuarioLogro(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="logros_obtenidos")
    logro = models.ForeignKey(Logro, on_delete=models.CASCADE, related_name="usuarios_con_logro")
    fecha_obtenido = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'logro')

    def __str__(self):
        return f"{self.usuario.username} - {self.logro.nombre}"


# CONTENIDO DE BIENESTAR 
class BienestarContenido(models.Model):
    autor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contenidos_bienestar")
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    fecha_publicacion = models.DateField(auto_now_add=True)
    tipo = models.CharField(max_length=20, choices=[
        ('salud', 'Salud'),
        ('nutrición', 'Nutrición'),
        ('motivación', 'Motivación')
    ])
    imagen_url = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.titulo} ({self.tipo})"


# COMUNIDAD / FORO 
class ComunidadPost(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    contenido = models.TextField()
    imagen_url = models.CharField(max_length=255, null=True, blank=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post de {self.usuario.username} - {self.fecha_publicacion.strftime('%Y-%m-%d')}"


class ReaccionPost(models.Model):
    post = models.ForeignKey(ComunidadPost, on_delete=models.CASCADE, related_name="reacciones")
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reacciones")
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'usuario')

    def __str__(self):
        return f"{self.usuario.username} dio 'Me gusta' al post {self.post.id}"


class ComentarioPost(models.Model):
    post = models.ForeignKey(
        ComunidadPost,
        on_delete=models.CASCADE,
        related_name="comentarios"
    )
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comentarios"
    )
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)

    #permite responder comentarios (hilo)
    respuesta_a = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='respuestas'
    )

    def __str__(self):
        return f"Comentario de {self.usuario.username} en {self.post.id}"

#  CHAT ENTRE USUARIO Y ENTRENADOR 
class Conversacion(models.Model):
    entrenador = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversaciones_entrenador")
    alumno = models.ForeignKey(User, on_delete=models.CASCADE, related_name="conversaciones_alumno")
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Chat {self.entrenador.username} ↔ {self.alumno.username}"


class MensajeChat(models.Model):
    conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE, related_name="mensajes")
    usuario_emisor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="mensajes_enviados")
    contenido = models.TextField()
    archivo_url = models.CharField(max_length=255, null=True, blank=True)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False)

    def __str__(self):
        return f"Mensaje de {self.usuario_emisor.username} ({'Leído' if self.leido else 'No leído'})"
    

# MENSAJES CONTACTO EMAIL 
class MensajeContacto(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField()
    asunto = models.CharField(max_length=150)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} - {self.asunto}"