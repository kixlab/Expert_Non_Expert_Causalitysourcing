from django.contrib import admin
from .models import Article, Target_Article, Entity, Question1_group, Question1, Answer1_group, Answer1, Question2_group, Q2_Art_Link, Question2, After_task_QA, Interpretation
# Register your models here.
admin.site.register(Target_Article)
admin.site.register(Article)
admin.site.register(Entity)
admin.site.register(Question1_group)
admin.site.register(Question1)
admin.site.register(Answer1)
admin.site.register(Question2_group)
admin.site.register(Question2)
admin.site.register(Q2_Art_Link)
admin.site.register(After_task_QA)
