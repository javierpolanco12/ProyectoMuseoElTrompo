from rest_framework import serializers
from .models import (
    Sala,
    Interactivo,
    StatusInteractivo,
    TipoInteractivo,
    Usuario,
    Perfil,
    TipoMantenimiento,
    DepArea,
    ReporteFalla,
    TareaMantenimiento,
    ReporteMantenimiento,
    EstadoTarea
)

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = '__all__'

class InteractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interactivo
        fields = '__all__'

class StatusInteractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusInteractivo
        fields = '__all__'

class TipoInteractivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoInteractivo
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
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
