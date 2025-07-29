from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static     
from rest_framework.routers import DefaultRouter
from .views import *  

router = DefaultRouter()
router.register(r'salas', SalaViewSet)
router.register(r'tipo-interactivo', TipoInteractivoViewSet)
router.register(r'status-interactivo', StatusInteractivoViewSet)
router.register(r'interactivos', InteractivoViewSet)
router.register(r'tipo-mantenimiento', TipoMantenimientoViewSet)
router.register(r'dep-areas', DepAreaViewSet)
router.register(r'reportes-fallas', ReporteFallaViewSet)
router.register(r'tareas-mantenimiento', TareaMantenimientoViewSet)
router.register(r'reportes-mantenimiento', ReporteMantenimientoViewSet)
router.register(r'estados-tareas', EstadoTareaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'perfiles', PerfilViewSet)
router.register(r'proyectores', ProyectorViewSet)
router.register(r'status-mantenimientos', StatusMantenimientoViewSet)
router.register(r'niveles-prioridad', NivelPrioridadViewSet)
router.register(r'calendarizaciones', CalendarizacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
