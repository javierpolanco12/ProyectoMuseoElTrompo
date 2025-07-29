from rest_framework import viewsets
from .models import *
from .serializers import *

class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer

class TipoInteractivoViewSet(viewsets.ModelViewSet):
    queryset = TipoInteractivo.objects.all()
    serializer_class = TipoInteractivoSerializer

class StatusInteractivoViewSet(viewsets.ModelViewSet):
    queryset = StatusInteractivo.objects.all()
    serializer_class = StatusInteractivoSerializer

class InteractivoViewSet(viewsets.ModelViewSet):
    queryset = Interactivo.objects.all()
    serializer_class = InteractivoSerializer

class TipoMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer

class DepAreaViewSet(viewsets.ModelViewSet):
    queryset = DepArea.objects.all()
    serializer_class = DepAreaSerializer

class ReporteFallaViewSet(viewsets.ModelViewSet):
    queryset = ReporteFalla.objects.all()
    serializer_class = ReporteFallaSerializer

class TareaMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = TareaMantenimiento.objects.all()
    serializer_class = TareaMantenimientoSerializer

class ReporteMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = ReporteMantenimiento.objects.all()
    serializer_class = ReporteMantenimientoSerializer

class EstadoTareaViewSet(viewsets.ModelViewSet):
    queryset = EstadoTarea.objects.all()
    serializer_class = EstadoTareaSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer

class ProyectorViewSet(viewsets.ModelViewSet):
    queryset = Proyector.objects.all()
    serializer_class = ProyectorSerializer

class StatusMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = StatusMantenimiento.objects.all()
    serializer_class = StatusMantenimientoSerializer


class NivelPrioridadViewSet(viewsets.ModelViewSet):
    queryset = NivelPrioridad.objects.all().order_by('nivel')
    serializer_class = NivelPrioridadSerializer


class CalendarizacionViewSet(viewsets.ModelViewSet):
    queryset = Calendarizacion.objects.all().order_by('-fecha_inicio')
    serializer_class = CalendarizacionSerializer
