from django.contrib import admin
from .models import Task

admin.site.site_header = 'Task Manager'
admin.site.register(Task)
# Register your models here.
