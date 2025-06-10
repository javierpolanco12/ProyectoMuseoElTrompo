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


class ReporteFalla(models.Model):
    interactivo = models.ForeignKey(Interactivo, on_delete=models.CASCADE)
    descripcion = models.TextField()
    foto_url = models.TextField()
    fecha_reporte = models.DateField()
    estado = models.CharField(max_length=50)

    def __str__(self):
        return f"Falla en {self.interactivo.nombre} - {self.estado}"


class TareaMantenimiento(models.Model):
    interactivo = models.ForeignKey(Interactivo, on_delete=models.CASCADE)
    reporte = models.ForeignKey(ReporteFalla, on_delete=models.CASCADE)
    area = models.ForeignKey(DepArea, on_delete=models.CASCADE)
    tipo = models.ForeignKey(TipoMantenimiento, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_programada = models.DateField()
    fecha_realizada = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=50)

    def __str__(self):
        return self.titulo


class ReporteMantenimiento(models.Model):
    interactivo = models.ForeignKey(Interactivo, on_delete=models.CASCADE)
    tarea = models.ForeignKey(TareaMantenimiento, on_delete=models.CASCADE)
    observaciones = models.TextField()
    fecha = models.DateField()
    estado = models.CharField(max_length=50)

    def __str__(self):
        return f"Reporte {self.id} - {self.estado}"


class EstadoTarea(models.Model):
    tarea = models.ForeignKey(TareaMantenimiento, on_delete=models.CASCADE)
    estado_anterior = models.CharField(max_length=50)
    estado_nuevo = models.CharField(max_length=50)
    fecha_cambio = models.DateField()

    def __str__(self):
        return f"Cambio en Tarea {self.tarea.id}"


class Usuario(models.Model):
    nombre_usuario = models.CharField(max_length=100, unique=True)
    correo = models.EmailField(max_length=150)
    contrasena_hash = models.TextField()
    rol = models.CharField(max_length=50)
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
