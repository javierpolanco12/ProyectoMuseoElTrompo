from rest_framework import serializers
from .models import (
    Sala,
    TipoInteractivo,
    StatusInteractivo,
    Interactivo,
    TipoMantenimiento,
    DepArea,
    ReporteFalla,
    TareaMantenimiento,
    ReporteMantenimiento,
    EstadoTarea,
    Usuario,
    Perfil,
    Proyector,
    StatusMantenimiento,
    NivelPrioridad,
    Calendarizacion
)

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = '__all__'


class TipoInteractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoInteractivo
        fields = '__all__'


class StatusInteractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusInteractivo
        fields = '__all__'


class InteractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interactivo
        fields = '__all__'


class TipoMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMantenimiento
        fields = '__all__'


class DepAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepArea
        fields = '__all__'


class ReporteFallaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReporteFalla
        fields = '__all__'


class TareaMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TareaMantenimiento
        fields = '__all__'


class ReporteMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReporteMantenimiento
        fields = '__all__'


class EstadoTareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoTarea
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = '__all__'


class ProyectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyector
        fields = '__all__'

class StatusMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusMantenimiento
        fields = '__all__'


class NivelPrioridadSerializer(serializers.ModelSerializer):
    class Meta:
        model = NivelPrioridad
        fields = '__all__'


class CalendarizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendarizacion
        fields = '__all__'