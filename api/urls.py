from django.urls import path, include
from rest_framework import routers
from .views import (
    InteractivoViewSet, SalaViewSet, UsuarioViewSet, StatusInteractivoViewSet,
    TipoInteractivoViewSet, ReporteFallaViewSet, TareaMantenimientoViewSet,
    ReporteMantenimientoViewSet, EstadoTareaViewSet, TipoMantenimientoViewSet,
    DepAreaViewSet
)

router = routers.DefaultRouter()
router.register(r'interactivos', InteractivoViewSet)
router.register(r'salas', SalaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'statusinteractivo', StatusInteractivoViewSet)
router.register(r'tipointeractivo', TipoInteractivoViewSet)
router.register(r'reportesfallas', ReporteFallaViewSet)
router.register(r'tareasmantenimiento', TareaMantenimientoViewSet)
router.register(r'reportesmantenimiento', ReporteMantenimientoViewSet)
router.register(r'estadotareas', EstadoTareaViewSet)
router.register(r'tipomantenimiento', TipoMantenimientoViewSet)
router.register(r'deparea', DepAreaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
