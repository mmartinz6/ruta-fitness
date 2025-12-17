from api.models import (  
    Usuarios, Ejercicio, Rutina, RutinaEjercicio,
    UsuarioRutina, ProgresoSerie, HistorialActividades
)
from django.contrib.auth.models import User
from django.utils import timezone
import random
from datetime import timedelta

# ==================== CONFIGURACIÓN POR NIVEL ====================
# Los descansos se pasan en segundos para usar en el frontend

NIVELES = {
    "fácil": {
        "repeticiones": 10,
        "series": 1,
        "descanso": 5,          # segundos
        "descanso_circuito": 0  # segundos
    },
    "medio": {
        "repeticiones": 12,
        "series": 1,
        "descanso": 5,
        "descanso_circuito": 0
    },
    "avanzado": {
        "repeticiones": 15,
        "series": 1,
        "descanso": 5,
        "descanso_circuito": 0
    },
}

# ==================== GENERAR RUTINA ====================

def generar_rutina_automatica(usuario_id):
    try:
        perfil = Usuarios.objects.get(idUser_id=usuario_id)
    except Usuarios.DoesNotExist:
        raise Exception("El usuario no tiene perfil registrado.")

    actividad = perfil.nivel_actividad.lower()
    if actividad == "bajo":
        nivel = "fácil"
    elif actividad == "medio":
        nivel = "medio"
    else:
        nivel = "avanzado"

    # Verificar si ya tiene una rutina activa
    usuario_rutina = UsuarioRutina.objects.filter(usuario_id=usuario_id, estado='activa').first()
    if usuario_rutina:
        # Si ya tiene rutina activa, verificar si ha pasado un día desde la última sesión
        if usuario_rutina.sesion_del_dia_completada():
            raise Exception("Rutina del día ya completada. Espera hasta mañana para generar una nueva rutina.")
        else:
            raise Exception("Tienes una rutina activa. Finaliza la rutina actual antes de comenzar una nueva.")

    # Si no hay rutina activa, procedemos con la creación de la rutina
    ejercicios = list(Ejercicio.objects.filter(nivel=nivel))
    if not ejercicios:
        raise Exception(f"No hay ejercicios disponibles para el nivel {nivel}.")

    random.shuffle(ejercicios)
    ejercicios_seleccionados = ejercicios[:6]

    entrenador = User.objects.filter(groups__name="entrenador").first()
    if not entrenador:
        raise Exception("No existe un entrenador registrado.")

    rutina = Rutina.objects.create(
        entrenador=entrenador,
        nombre=f"Rutina automática de {perfil.idUser.username}",
        descripcion="Rutina generada automáticamente por el sistema.",
        nivel=nivel
    )

    usuario_rutina = UsuarioRutina.objects.create(
        usuario=perfil.idUser,
        rutina=rutina,
        estado="activa"
    )

    params = NIVELES[nivel]

    for idx, ejer in enumerate(ejercicios_seleccionados, start=1):
        RutinaEjercicio.objects.create(
            rutina=rutina,
            ejercicio=ejer,
            repeticiones=f"{params['repeticiones']} repeticiones",
            descanso=params['descanso'],
            orden=idx
        )

    # Guardar la fecha de inicio
    usuario_rutina.fecha_ultima_sesion = timezone.now().date()
    usuario_rutina.save()

    return usuario_rutina

# ==================== RUTINA DEL DÍA ====================

def obtener_rutina_del_dia(usuario_id):
    usuario_rutina = UsuarioRutina.objects.filter(
        usuario_id=usuario_id,
        estado='activa'
    ).first()

    if not usuario_rutina:
        return None, "No tiene rutina activa."

    if usuario_rutina.sesion_del_dia_completada():
        return None, "Rutina del día ya completada."

    ejercicios = RutinaEjercicio.objects.filter(
        rutina=usuario_rutina.rutina
    ).select_related("ejercicio").order_by("orden")

    params = NIVELES[usuario_rutina.rutina.nivel]

    ejercicios_lista = []

    for ejercicio in ejercicios:
        series_completadas = ProgresoSerie.objects.filter(
            usuario_rutina=usuario_rutina,
            ejercicio=ejercicio.ejercicio,
            completado=True
        ).count()

        ejercicios_lista.append({
            "id": ejercicio.ejercicio.id,
            "nombre": ejercicio.ejercicio.nombre,
            "descripcion": ejercicio.ejercicio.descripcion,
            "video_url": ejercicio.ejercicio.video_url,
            "repeticiones": params["repeticiones"],
            "descanso": params['descanso'],
            "series_completadas": series_completadas,
            "total_series": params["series"]  # total de circuitos
        })

    # Retornar también total de circuitos para React
    return {
    "usuario_rutina_id": usuario_rutina.id,
    "ejercicios_rutina": ejercicios_lista,
    "total_circuitos": params["series"]
    }, None


# ==================== COMPLETAR SERIE (CIRCUITO) ====================

def completar_serie(usuario_id, ejercicio_id, serie_numero):
    usuario_rutina = UsuarioRutina.objects.filter(
        usuario_id=usuario_id,
        estado="activa"
    ).first()

    if not usuario_rutina:
        return False, {"mensaje": "No tiene rutina activa."}

    if usuario_rutina.sesion_del_dia_completada():
        return False, {"mensaje": "Rutina del día ya completada."}

    # Marcar ejercicio como completado en esta serie (circuito)
    ProgresoSerie.objects.get_or_create(
        usuario_id=usuario_id,
        usuario_rutina=usuario_rutina,
        ejercicio_id=ejercicio_id,
        serie_numero=serie_numero,
        defaults={"completado": True}
    )

    # Registrar historial
    HistorialActividades.objects.create(
        usuario_id=usuario_id,
        rutina=usuario_rutina.rutina,
        ejercicio_id=ejercicio_id,
        duracion=5,
        calorias_quemadas=10,
        completado=True
    )

    # Total de ejercicios en el circuito
    total_ejercicios = RutinaEjercicio.objects.filter(
        rutina=usuario_rutina.rutina
    ).count()

    # Ejercicios completados en esta serie
    completados = ProgresoSerie.objects.filter(
        usuario_rutina=usuario_rutina,
        serie_numero=serie_numero,
        completado=True
    ).values_list("ejercicio_id", flat=True).distinct().count()

    params = NIVELES[usuario_rutina.rutina.nivel]

    # ✅ Circuito completo
    if completados >= total_ejercicios:

        # 🏁 Rutina del día finalizada
        if serie_numero >= params["series"]:
            usuario_rutina.fecha_ultima_sesion = timezone.now().date()
            usuario_rutina.save()

            return True, {
                "mensaje": "Rutina del día completada.",
                "fin_rutina": True
            }

        # ⏸ Descanso entre circuitos
        return True, {
            "mensaje": "Circuito completado.",
            "fin_circuito": True,
            "descanso_circuito": params["descanso_circuito"],  # en segundos
            "siguiente_circuito": serie_numero + 1
        }

    # ➡️ Continúa el circuito actual
    return True, {
        "mensaje": "Ejercicio completado.",
        "fin_circuito": False
    }
