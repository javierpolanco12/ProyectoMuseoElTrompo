from django.db import models


class Sala(models.Model):
    nombre = models.CharField(max_length=100)
    ubicacion = models.TextField()
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre


class TipoInteractivo(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre


class StatusInteractivo(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Interactivo(models.Model):
    nombre = models.CharField(max_length=100)
    numero_serie = models.CharField(max_length=100)
    modelo_computadora = models.CharField(max_length=100, null=True, blank=True)
    marca_computadora = models.CharField(max_length=100, null=True, blank=True)
    fecha_instalado = models.DateField()
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE)
    tipo = models.ForeignKey(TipoInteractivo, on_delete=models.CASCADE)
    status = models.ForeignKey(StatusInteractivo, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre


class TipoMantenimiento(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre


class DepArea(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre


class StatusMantenimiento(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class NivelPrioridad(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True)
    nivel = models.PositiveSmallIntegerField(
        unique=True,
        help_text="1 = Urgente, 2 = Alta, 3 = Media, 4 = Baja"
    )

    def __str__(self):
        return f"{self.nombre} (Nivel {self.nivel})"


class ReporteFalla(models.Model):
    interactivo = models.ForeignKey(Interactivo, on_delete=models.CASCADE)
    descripcion = models.TextField()
    foto = models.ImageField(upload_to='reportes_fallas/', null=True, blank=True)
    fecha_reporte = models.DateField()
    estado = models.ForeignKey(StatusMantenimiento, on_delete=models.PROTECT)
    prioridad = models.ForeignKey(NivelPrioridad, on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return f"Falla en {self.interactivo.nombre} - {self.estado.nombre}"


class TareaMantenimiento(models.Model):
    interactivo = models.ForeignKey(Interactivo, on_delete=models.CASCADE)
    reporte = models.ForeignKey(ReporteFalla, on_delete=models.CASCADE)
    area = models.ForeignKey(DepArea, on_delete=models.CASCADE)
    tipo = models.ForeignKey(TipoMantenimiento, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_programada = models.DateField()
    fecha_realizada = models.DateField(null=True, blank=True)
    estado = models.ForeignKey('StatusMantenimiento', on_delete=models.RESTRICT)


    def __str__(self):
        return self.titulo


class ReporteMantenimiento(models.Model):
    interactivo = models.ForeignKey(Interactivo, on_delete=models.CASCADE)
    tarea = models.ForeignKey(TareaMantenimiento, on_delete=models.CASCADE)
    observaciones = models.TextField()
    fecha = models.DateField()
    estado = models.ForeignKey(StatusMantenimiento, on_delete=models.PROTECT)

    def __str__(self):
        return f"Reporte {self.id} - {self.estado.nombre}"


class EstadoTarea(models.Model):
    tarea = models.ForeignKey(TareaMantenimiento, on_delete=models.CASCADE)
    estado_anterior = models.CharField(max_length=50)
    estado_nuevo = models.CharField(max_length=50)
    fecha_cambio = models.DateField()
    status = models.ForeignKey(StatusMantenimiento, on_delete=models.PROTECT, default=1)

    def __str__(self):
        return f"Cambio en Tarea {self.tarea.id}"



class Usuario(models.Model):
    nombre_usuario = models.CharField(max_length=100, unique=True)
    correo = models.EmailField(max_length=150)
    contrasena_hash = models.TextField()
    rol = models.CharField(max_length=50)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre_usuario


class Perfil(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    nombre_completo = models.CharField(max_length=150)
    telefono = models.CharField(max_length=20)
    foto_url = models.TextField(null=True, blank=True)
    direccion = models.TextField()
    fecha_nacimiento = models.DateField()
    genero = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre_completo


class Proyector(models.Model):
    nombre = models.CharField(max_length=100)
    numero_serie = models.CharField(max_length=100, unique=True)
    modelo = models.CharField(max_length=100)
    marca = models.CharField(max_length=100)
    fecha_instalado = models.DateField()
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE)
    status = models.ForeignKey(StatusInteractivo, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} ({self.numero_serie})"
    
class Calendarizacion(models.Model):
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    
    # Relaciones con otras tablas
    interactivo = models.ForeignKey('Interactivo', on_delete=models.CASCADE, null=True, blank=True)
    tarea = models.ForeignKey('TareaMantenimiento', on_delete=models.CASCADE, null=True, blank=True)
    creado_por = models.ForeignKey('Usuario', on_delete=models.SET_NULL, null=True)
    
    # Fecha automática de creación
    creado_el = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} ({self.fecha_inicio.date()} - {self.fecha_fin.date()})"
   
    
