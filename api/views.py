from rest_framework import viewsets
from .models import Interactivo, Sala, Usuario, StatusInteractivo, TipoInteractivo, ReporteFalla, TareaMantenimiento, ReporteMantenimiento, EstadoTarea, TipoMantenimiento, DepArea
from .serializers import (
    InteractivoSerializer, SalaSerializer, UsuarioSerializer,
    StatusInteractivoSerializer, TipoInteractivoSerializer,
    ReporteFallaSerializer, TareaMantenimientoSerializer,
    ReporteMantenimientoSerializer, EstadoTareaSerializer,
    TipoMantenimientoSerializer, DepAreaSerializer
)

class InteractivoViewSet(viewsets.ModelViewSet):
    queryset = Interactivo.objects.all()
    serializer_class = InteractivoSerializer

class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class StatusInteractivoViewSet(viewsets.ModelViewSet):
    queryset = StatusInteractivo.objects.all()
    serializer_class = StatusInteractivoSerializer

class TipoInteractivoViewSet(viewsets.ModelViewSet):
    queryset = TipoInteractivo.objects.all()
    serializer_class = TipoInteractivoSerializer

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

class TipoMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = TipoMantenimiento.objects.all()
    serializer_class = TipoMantenimientoSerializer

class DepAreaViewSet(viewsets.ModelViewSet):
    queryset = DepArea.objects.all()
    serializer_class = DepAreaSerializer
