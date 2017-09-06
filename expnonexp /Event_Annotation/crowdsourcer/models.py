from django.db import models
import datetime
from django.utils import timezone


# Create your models here.
class Pre_step_Q(models.Model):
    pre_step_q_id = models.IntegerField(default = 0)
    question = models.TextField(default = "", max_length = 200)
    def __str__(self):
        return str(self.pre_step_q_id)+"_"+self.question

class choice(models.Model):
    choice_id = models.IntegerField(default=0)
    choice = models.TextField(default = "", max_length=200)
    question = models.ForeignKey(Pre_step_Q, on_delete= models.CASCADE)
    is_right = models.BooleanField(default = False)
    def __str__(self):
        return str(self.question.pre_step_q_id)+"_"+str(self.choice_id)+"_"+str(self.choice)

class Target_Article(models.Model):
    title = models.CharField(default="", max_length=200)
    #season = models.IntegerField(default=0)
    #episode = models.IntegerField(default=0)
    #time_description = models.CharField(default="", max_length=200)
    summary = models.TextField(default="", max_length = 1000)
    def __str__(self):
        return self.title

class Article(models.Model):
    title = models.CharField(default="", max_length=200)
    #season = models.IntegerField(default=0)
    #episode = models.IntegerField(default=0)
    #time_description = models.CharField(default="", max_length=200)
    summary = models.TextField(default="", max_length = 1000)
    def __str__(self):
        return self.title

class Entity(models.Model):
    name = models.CharField(default="", max_length=200)
    entity_id = models.CharField(default="", max_length=200)
    def __str__(self):
        return self.name;

class Question1_group(models.Model):
    Q1G_id = models.IntegerField(default = 0)
    entity = models.ManyToManyField(Entity)
    def __str__(self):
        return str(self.Q1G_id)

class Question1(models.Model):
    Q1_id = models.IntegerField(default = 0)
    question = models.TextField(default ="", max_length = 1000)
    num_vote = models.IntegerField(default = 0)
    question_group = models.ForeignKey(Question1_group, on_delete = models.PROTECT)
    worker_code = models.TextField(default="", max_length = 200)
    def __str__(self):
        return self.worker_code+str(self.question_group.Q1G_id)+"_"+str(self.Q1_id)+"_"+self.question


class Answer1_group(models.Model):
    A1G_id = models.IntegerField(default = 0)
    question_group = models.ForeignKey(Question1_group, on_delete = models.PROTECT)
    def __str__(self):
        return "Answer group to "+str(self.Q1G_id)

class Answer1(models.Model):
    A1_id = models.IntegerField(default = 0)
    answer = models.TextField(default = "", max_length = 1000)
    num_vote_A = models.IntegerField(default = 0)
    question_group = models.ForeignKey(Question1_group,default=None, on_delete = models.PROTECT)
    worker_code = models.TextField(default="", max_length = 200)
    def __str__(self):
        return str(self.A1_id)+"_"+self.answer

class Answer1_mid(models.Model):
    worker_code = models.TextField(default="", max_length=200)
    mid_answer = models.TextField(default = "", max_length=1000)
    question_group = models.ForeignKey(Question1_group, default=None, on_delete=models.PROTECT)


class Question2_group(models.Model):
    Q2G_id = models.IntegerField(default = 0)
    #related_articles = models.ManyToManyField(Article)
    def __str__(self):
        return "Why question "+str(self.Q2G_id)

class Q2_Art_Link(models.Model):
    Q2G = models.ForeignKey(Question2_group, on_delete=models.PROTECT)
    Article = models.ForeignKey(Article, on_delete=models.PROTECT)
    num_vote = models.IntegerField(default = 0)
    worker_code = models.TextField(default="", max_length = 200)
    def __str__(self):
        return str(self.Q2G.Q2G_id)+self.Article.title



class Question2(models.Model):
    worker_code = models.TextField(default="", max_length = 200)
    Q2_id = models.IntegerField(default = 0)
    question = models.TextField(default="", max_length = 1000)
    num_vote = models.IntegerField(default = 0)
    question_group = models.ForeignKey(Question2_group, on_delete = models.PROTECT)
    def __str__(self):
        return str(self.question_group.Q2G_id)+"_"+str(self.Q2_id)+"_"+self.question

class Interpretation(models.Model):
    int_id = models.IntegerField(default = 0)
    interpretation = models.TextField(default="", max_length = 1000)
    made_by_expert = models.BooleanField(default = False)
    question2_g = models.ForeignKey(Question2_group, on_delete = models.PROTECT)
    worker_code = models.TextField(default="", max_length = 200)
    def __str__(self):
        return str(self.question2_g.Q2G_id)+"_"+str(self.int_id)+"_"+self.interpretation


class After_task_QA(models.Model):
    int_id = models.IntegerField(default = 0)
    answer = models.TextField(default="", max_length= 1000)
    step = models.IntegerField(default = 0)
    expert = models.BooleanField(default = False)
    worker_code = models.TextField(default="", max_length = 200)
    def __str__(self):
        exp=""
        if self.expert :
            exp = "expert"
        else :
            exp = "novice"
        return str(self.step)+"_"+exp+"_"+self.answer
