from api.models import (
    Usuarios, Ejercicio, Rutina, RutinaEjercicio, UsuarioRutina
)
from django.contrib.auth.models import User
import random


def generar_rutina_automatica(usuario_id):
    """
    Genera una rutina automática basada en los datos del perfil del usuario.
    """

    # 1. Perfil del usuario
    perfil = Usuarios.objects.get(idUser_id=usuario_id)

    # 2. Determinar nivel según actividad
    actividad = perfil.nivel_actividad.lower()

    if actividad == "bajo":
        nivel = "fácil"
    elif actividad == "medio":
        nivel = "medio"
    else:
        nivel = "avanzado"

    # 3. Seleccionar ejercicios del nivel adecuado
    ejercicios = Ejercicio.objects.filter(nivel=nivel)

    ejercicios = list(ejercicios)
    random.shuffle(ejercicios)

    # Elegimos 6 ejercicios
    ejercicios_seleccionados = ejercicios[:6]

    # 4. Conseguir entrenador por defecto (primer usuario en el grupo "entrenador")
    entrenador = User.objects.filter(groups__name="entrenador").first()

    if entrenador is None:
        raise Exception("No existe un entrenador registrado en el sistema.")

    # 5. Crear la rutina
    rutina = Rutina.objects.create(
        entrenador=entrenador,
        nombre=f"Rutina automática de {perfil.idUser.username}",
        descripcion="Rutina generada automáticamente por el sistema.",
        nivel=nivel
    )

    # 6. Crear los pasos de la rutina
    orden = 1
    for ejer in ejercicios_seleccionados:
        RutinaEjercicio.objects.create(
            rutina=rutina,
            ejercicio=ejer,
            repeticiones="12 repeticiones",
            descanso="45 segundos",
            orden=orden
        )
        orden += 1

    # 7. Asignar rutina al usuario
    UsuarioRutina.objects.create(
        usuario=perfil.idUser,
        rutina=rutina,
        estado="activa"
    )

    return rutina