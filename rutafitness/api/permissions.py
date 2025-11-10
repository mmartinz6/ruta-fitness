from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite solo lectura a usuarios normales,
    pero permite escritura/modificación a administradores o staff.
    """
    def has_permission(self, request, view):
        # Métodos seguros: GET, HEAD, OPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True
        # Solo staff o superusuarios pueden modificar
        return request.user and request.user.is_staff


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Solo el dueño del objeto puede modificarlo o eliminarlo.
    Los demás solo pueden leer.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Verifica que el objeto tenga un campo 'usuario' y coincida con el usuario autenticado
        return hasattr(obj, 'usuario') and obj.usuario == request.user
