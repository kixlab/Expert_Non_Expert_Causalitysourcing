# -*- coding: utf-8 -*-

from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.db.models import Max, Min, Count, F,Q, Sum
from .models import Pre_step_Q, choice, Target_Article, Article, Entity, Question1_group, Question1, Answer1_group, Answer1, Question2_group, Question2, Interpretation, Q2_Art_Link, After_task_QA, Answer1_mid, Pass_Fail
import datetime
from django.core.urlresolvers import reverse
#from django.urls import reverse
import json
import random
from random import shuffle
#import nltk.data as nltk_d
import os
from os import listdir
from os.path import isfile, join
import uuid
import codecs
import io
# Create your views here.

def index(request):
    return render(request, 'crowdsourcer/index.html',{})

def admin_page(request):
    return render(request, 'crowdsourcer/admin.html', {})

def quiz_1(request):
    if Pass_Fail.objects.filter(step=1).count()==0:
        a= Pass_Fail(_pass=0, _fail=0, _tot=0, step=1)
        a.save()
    a = Pass_Fail.objects.get(step=1)
    a._tot = a._tot +1
    a.save()
    #gen_test_test()
    return render(request, 'crowdsourcer/quiz.html',{})
def quiz_2(request):
    if Pass_Fail.objects.filter(step=2).count()==0:
        a= Pass_Fail(_pass=0, _fail=0, _tot=0, step=2)
        a.save()
    a = Pass_Fail.objects.get(step=2)
    a._tot = a._tot +1
    a.save()
    #gen_test_test()
    return render(request, 'crowdsourcer/quiz.html',{})
def quiz_3(request):
    if Pass_Fail.objects.filter(step=3).count()==0:
        a= Pass_Fail(_pass=0, _fail=0, _tot=0, step=3)
        a.save()
    a = Pass_Fail.objects.get(step=3)
    a._tot = a._tot +1
    a.save()
    #gen_test_test()
    return render(request, 'crowdsourcer/quiz.html',{})
def quiz_4(request):
    if Pass_Fail.objects.filter(step=4).count()==0 :
        a= Pass_Fail(_pass=0, _fail=0, _tot=0, step=4)
        a.save()
    a = Pass_Fail.objects.get(step=4)
    a._tot = a._tot +1
    a.save()
    #gen_test_test()
    return render(request, 'crowdsourcer/quiz.html',{})
def quiz_5(request):
    if Pass_Fail.objects.filter(step=5).count()==0 :
        a= Pass_Fail(_pass=0, _fail=0, _tot=0, step=5)
        a.save()
    a = Pass_Fail.objects.get(step=5)
    a._tot = a._tot +1
    a.save()
    #gen_test_test()
    return render(request, 'crowdsourcer/quiz.html',{})


def fetch_quiz(request):
    num = int(request.GET.get('num'))
    questions =[]
    choices = []
    rand_range = [[k] for k in range(0, Pre_step_Q.objects.count())]
    shuffle(rand_range)
    q_set = Pre_step_Q.objects.order_by('pre_step_q_id')
    count = 0
    for k in rand_range:
        count = count+1
        if count==num+1:
            break;
        i=k[0]
        questions.append(q_set[i].question)
        choice_s = q_set[i].choice_set.order_by("choice_id")
        for j in range(0, 5):
            dic = {}
            dic['choice'] = choice_s[j].choice
            dic['answer'] = choice_s[j].is_right
            choices.append(dic)




    data = {
        'questions' : json.dumps(questions),
        'choices' : json.dumps(choices),
    }

    return JsonResponse(data)

def step1_info_Q_gen(request):
    p = Pass_Fail.objects.get(step=1)
    p._fail =p._fail+1
    p.save()
   # gen_target_art()
    #gen_sub_art()
    return render(request, 'crowdsourcer/step1.html',{})

def step2_info_Q_ans(request):
    p = _passFail.objects.get(step=1)
    p._pass =p._pass+1
    p.save()
    return render(request, 'crowdsourcer/step2.html',{})

def step3_causal_Q_gen(request):
    p = _passFail.objects.get(step=1)
    p._fail =p._fail+1
    p.save()
    #gen_target_art()
    return render(request, 'crowdsourcer/step3.html',{})
def step4_causal_link(request):
    p = _passFail.objects.get(step=1)
    p._pass =p._pass+1
    p.save()
    #gen_sub_art()
    return render(request, 'crowdsourcer/step4.html',{})
def step5_causality_interpret_e(request):
    #gen_sub_art()
    return render(request, 'crowdsourcer/step5.html',{})

def step5_causality_interpret_n(request):
    #gen_sub_art()
    return render(request, 'crowdsourcer/step5.html',{})

def not_pass(request):
    return render(request, 'crowdsourcer/not_pass.html', {})

def end_1(request, survey_code):
    return render(request, 'crowdsourcer/end.html', {})
def end_2(request, survey_code):
    return render(request, 'crowdsourcer/end.html', {})
def end_3(request, survey_code):
    return render(request, 'crowdsourcer/end.html', {})
def end_4(request, survey_code):
    return render(request, 'crowdsourcer/end.html', {})
def end_e5(request, survey_code):
    return render(request, 'crowdsourcer/end.html', {})
def end_n5(request, survey_code):
    return render(request, 'crowdsourcer/end.html', {})

def fetch_target_text(request):
    target = Target_Article.objects.all()[0]
    data={
        'worker_id' : str(uuid.uuid4())[:8],
        'title' : target.title,
        'summary' : target.summary,
    }
    return JsonResponse(data)

def fetch_sub_text(request):
    text_list = []
    tl = Article.objects.annotate(link_count = Count("q2_art_link")).order_by("-link_count").all()
    for ot in tl:
        dic={}
        dic['title'] = ot.title
        dic['summary'] =ot.summary
        text_list.append(dic)
    data={
        'texts': json.dumps(text_list)
    }
    return JsonResponse(data)
def fetch_causal_question(request):
    done_q =json.loads(request.GET.get("done_q"))
    dic={}
    if Question2_group.objects.exclude(Q2G_id__in=done_q).count()==0:
        data={
            'done' : True,
        }
        return JsonResponse(data)
    q2g = Question2_group.objects.exclude(Q2G_id__in=done_q).annotate(art_link = Sum('q2_art_link__num_vote')).order_by('art_link')[0]
    dic['q2g_id']=q2g.Q2G_id
    max_id = q2g.question2_set.aggregate(Max('Q2_id'))['Q2_id__max']
    q2 = q2g.question2_set.filter(Q2_id=max_id)[0].question
    dic['question']=q2
    dic['linked_article_list']=[]
    links = q2g.q2_art_link_set.all()
    for link in links:
        dic['linked_article_list'].append(link.Article.title)
    #print(Question2_group.objects.annotate(art_link = Count('q2_art_link')))
    print(q2, q2g.Q2G_id)
    print(dic)
    data={
        'done' : False,
        'causal_question_data' : json.dumps(dic)
    }
    return JsonResponse(data)

def fetch_causal_question_step5(request):
    done_q = json.loads(request.GET.get("done_q"))
    dic={}
    if Question2_group.objects.exclude(Q2G_id__in=done_q).count()==0:
        data={
            'end' : True
        }
        return JsonResponse(data)
    q2g = Question2_group.objects.exclude(Q2G_id__in=done_q).annotate(interpret_num = Count('interpretation')).order_by('interpret_num')[0]
    print(q2g)
    print(q2g.interpretation_set.count())
    dic['q2g_id']=q2g.Q2G_id
    max_id = q2g.question2_set.aggregate(Max('Q2_id'))['Q2_id__max']
    q2 = q2g.question2_set.filter(Q2_id=max_id)[0].question
    dic['question']=q2
    dic['linked_article_list']=[]
    links = q2g.q2_art_link_set.all().order_by('-num_vote')
    for link in links:
        print("this is", link.Article.title)
        dic['linked_article_list'].append(link.Article.title)
    #print(Question2_group.objects.annotate(art_link = Count('q2_art_link')))
    #print(q2, q2g.Q2G_id)
    #print(dic)
    data={
        'end' : False,
        'causal_question_data' : json.dumps(dic)
    }
    return JsonResponse(data)

def fetch_q1(request):
    cur_ent_set = json.loads(request.GET.get("cur_ent_set"))
    print(cur_ent_set)
    q_gs = Question1_group.objects.all()
    ents=[]
    ex_ents=[]
    ent_obj_all = Entity.objects.all()
    for ent_obj in ent_obj_all:
        if ent_obj.entity_id in cur_ent_set:
            ents.append(ent_obj)
        else:
            ex_ents.append(ent_obj)
    print(ents)
    q_gs= q_gs.filter(entity__in=ents)
    q_gs= q_gs.exclude(entity__in = ex_ents).annotate(num_ent=Count('entity')).filter(num_ent=len(ents))
    print(q_gs)
    qgset=[]
    for q_g in q_gs:
        q_g_dic = {}
        q_g_dic['group_id'] = q_g.Q1G_id
        q_g_dic['list'] = []
        q_set = q_g.question1_set.all()
        for q in q_set:
            q_dic={}
            q_dic['id'] = q.Q1_id
            q_dic['vote'] = q.num_vote
            q_dic['question'] = q.question
            q_g_dic['list'].append(q_dic)
        qgset.append(q_g_dic)
    data={
        'question_groups' : json.dumps(qgset),
    }
    return JsonResponse(data)

def fetch_q1_all(request):

    entities = Entity.objects.all()
    ent_list = []
    for entity in entities:
        entity_dic={}
        entity_dic['entity']=entity.entity_id
        entity_dic['q_g_list']=[]
        print(entity.question1_group_set)
        q_g_set = entity.question1_group_set.all()
        for q_g in q_g_set:
            q_g_dic = {}
            q_g_dic['group_id']=q_g.Q1G_id
            q_g_dic['list'] = []
            q_set = q_g.question1_set.all()
            for q in q_set:
                q_dic = {}
                q_dic['vote'] = q.num_vote
                q_dic['question'] = q.question
                q_g_dic['list'].append(q_dic)
            entity_dic['q_g_list'].append(q_g_dic)
        ent_list.append(entity_dic)

    data={
        'question_groups' : json.dumps(ent_list)
    }
    return JsonResponse(data)
def fetch_q1_for_answer(request):
    #gen_target_art()
    q_g_list =[]
    done = json.loads(request.GET.get("done"))
    print(done)
    hvq = Question1_group.objects.annotate(ans_num = Count('answer1')).filter(ans_num__lt=3)
    for d in done:
        print("excluding...")
        hvq=hvq.exclude(Q1G_id=d)
    print(hvq)
    if len(hvq)>0:
        print(hvq[0])
    max_v=-1
    question_=None
    for qgg in hvq:
        loc_v=0
        for q in qgg.question1_set.all():
            print("haha")
            loc_v = loc_v+q.num_vote
        if loc_v>max_v:
            question_=qgg
            max_v=loc_v

    mv = hvq.annotate(Sum('question1__num_vote')).aggregate(Max("question1__num_vote__sum"))['question1__num_vote__sum__max']
    print("mostly voted"+str(mv))
    print(type(mv))
    if question_==None:
        end=True
        data={
            'end' : end,
        }
        return JsonResponse(data)
    else:
        end=False
    #highly_voted_questions = highly_voted_questions.filter(ans_num__lt=5).order_by('ans_num')
    single_q_g = question_
    dic={}
    dic['entity'] = []
    ents=single_q_g.entity.all()
    for ent in ents:
        dic['entity'].append(ent.entity_id)
    dic['group_id'] = single_q_g.Q1G_id
    max_num_vote = single_q_g.question1_set.aggregate(Max("num_vote"))['num_vote__max']
    dic['question'] = single_q_g.question1_set.filter(num_vote=max_num_vote)[0].question
    dic['answer_list'] = []
    answer_all = single_q_g.answer1_set.all().order_by("-A1_id")
    for answer in answer_all:
        dic2={}
        dic2['answer'] = answer.answer
        dic2['num_vote']=answer.num_vote_A
        dic2['A1_id']=answer.A1_id
        dic['answer_list'].append(dic2)
    print(dic)
    data={
        'end' : end,
        'a_question' : json.dumps(dic)
    }
    return JsonResponse(data)

def fetch_q_a_step3(request):
    entities = []
    es = Entity.objects.all()
    for e in es:
        dic ={}
        dic['entity'] = e.entity_id
        dic['question_group']=[]
        qg_set = e.question1_group_set.annotate(tot_votes = Sum('question1__num_vote')).order_by('-tot_votes')
        for qg in qg_set:
            dic2={}
            dic2['group_id'] = qg.Q1G_id
            max_num_vote = qg.question1_set.aggregate(Max("num_vote"))['num_vote__max']
            dic2['question'] = qg.question1_set.filter(num_vote = max_num_vote)[0].question
            ent_list = []
            for ent in qg.entity.all():
                ent_list.append(ent.entity_id)
            dic2['ent_list']=ent_list
            if qg.answer1_set.count() >0 :
                dic2['answer'] = qg.answer1_set.order_by('-A1_id')[0].answer
                dic['question_group'].append(dic2)
        entities.append(dic)
    print(entities)
    data={
        'q_a_set' : json.dumps(entities)
    }
    return JsonResponse(data)

def fetch_prev_why_q_step3(request):
    #gen_target_art()
    q2g_set = Question2_group.objects.all()
    q2g_list = []
    for q2g in q2g_set:
        dic={}
        dic['group_id'] = q2g.Q2G_id
        dic['q_list']=[]
        q2set = q2g.question2_set.all()
        for question in q2set:
            dic2={}
            dic2['question'] = question.question
            dic2['num_vote'] = question.num_vote
            dic2['id'] = question.Q2_id
            dic['q_list'].append(dic2)
        q2g_list.append(dic)
    data={
        'prev_q' : json.dumps(q2g_list)
    }
    return JsonResponse(data)

def collect_reaction(request):
    dic = json.loads(request.GET.get("reaction"))
    qa_result = After_task_QA(int_id = After_task_QA.objects.count(), answer = dic['answer'], step=dic['step'], expert=dic['is_expert'])
    qa_result.save()
    data={

    }
    return JsonResponse(data)

def step1_return(request):
    survey_code = request.GET.get("survey_code")
    d = json.loads(request.GET.get("data"))
    print(d)
    for change in d:
        if change['group_id']<0:
            ents=[]
            for ent_id in change['entity_list']:
                ents.append(Entity.objects.get(entity_id = ent_id))
            qg = Question1_group(Q1G_id=Question1_group.objects.count())
            qg.save()
            for ent in ents:
                qg.entity.add(ent)
            qg.save()
            q1 = Question1(Q1_id=Question1.objects.count(), question=change['question'], num_vote=change['num_vote'], question_group=qg, worker_code = survey_code)
            q1.save()
        else:
            qg=Question1_group.objects.get(Q1G_id = change['group_id'])
            if change['id']<0:
                q1 = Question1(Q1_id=Question1.objects.count(), question=change['question'], num_vote=change['num_vote'], question_group=qg, worker_code = survey_code)
            else:
                q1 = Question1.objects.get(Q1_id = change['id'])
                q1.num_vote = change['num_vote']
            q1.save()
    """ents=[]
    for ent_id in d['entity_list']:
        ents.append(Entity.objects.get(entity_id = ent_id))

    if d['group_id']<0 :
        for q in d['qs']:
            qg = Question1_group(Q1G_id = Question1_group.objects.count())
            qg.save()
            for ent in ents:
                print(ent)
                qg.entity.add(ent)
            qg.save()
            q1 = Question1(Q1_id=Question1.objects.count(), question=q['question'], num_vote =q['num_vote'], question_group = qg)
            q1.save()"""
    data={

    }
    return JsonResponse(data)

def step2_return(request):
    survey_code = request.GET.get("survey_code")
    d= json.loads(request.GET.get("data"))
    q_g = Question1_group.objects.get(Q1G_id = d['group_id'])
    a = Answer1(A1_id=Answer1.objects.count(), answer=d['answer'], num_vote_A=1, question_group = q_g,  worker_code = survey_code)
    a.save()
    data={

    }
    return JsonResponse(data)
def step2_mid_return(request):
    survey_code = request.GET.get("survey_code")
    d= json.loads(request.GET.get("data"))
    q_g = Question1_group.objects.get(Q1G_id = d['group_id'])
    a = Answer1_mid(mid_answer=d['answer'],  question_group = q_g,  worker_code = survey_code)
    a.save()
    data={

    }
    return JsonResponse(data)

def step3_return(request):
    survey_code = request.GET.get("survey_code")
    d = json.loads(request.GET.get('data'))
    for q in d:
        if q['group_id']<0:
            qg = Question2_group(Q2G_id=Question2_group.objects.count())
            qg.save()
            q_save = Question2(Q2_id = Question2.objects.count(), question = q['question'], num_vote = 1, question_group = qg,  worker_code = survey_code)
            q_save.save()
        else:
            qg = Question2_group.objects.get(Q2G_id = q['group_id'])
            if q['id']>=0:
                q_save=Question2.objects.get(Q2_id=q['id'])
                q_save.num_vote = q['num_vote']
            else:
                q_save = Question2(Q2_id=Question2.objects.count(), question=q['question'], num_vote = q['num_vote'], question_group=qg, worker_code = survey_code)
            q_save.save()
    data={

    }
    return JsonResponse(data)

def step4_return(request):
    d= json.loads(request.GET.get("data"))
    print(d)
    for title in d['linked']:
        a = Article.objects.get(title = title)
        g = Question2_group.objects.get(Q2G_id = d['q2g_id'])
        if Q2_Art_Link.objects.filter(Q2G=g, Article=a).count()==0:
            l = Q2_Art_Link(Q2G=g, Article=a, num_vote=1)
        else:
            l = Q2_Art_Link.objects.get(Q2G=g, Article=a)
            l.num_vote = l.num_vote+1
        l.save()
    data={

    }
    return JsonResponse(data)

def step5_return(request):
    survey_code = request.GET.get("survey_code")
    d = json.loads(request.GET.get("data"))
    q2g= Question2_group.objects.get(Q2G_id=d['q2g_id'])
    i = Interpretation(question2_g = q2g, made_by_expert = d['is_expert'], interpretation = d['interpretation'], int_id = Interpretation.objects.count(),  worker_code = survey_code)
    i.save()
    print(d)
    data={}
    return JsonResponse(data)

def gen_entities(request):
    Entity.objects.all().delete()
    n = json.loads(request.GET.get("name"))
    i = json.loads(request.GET.get("ids"))
    print(n)
    print(i)
    for j in range(0, len(n)):
        print("entitymaking...")
        e = Entity(name = n[j], entity_id = i[j])
        e.save()
    data={}
    return JsonResponse(data)
def gen_test_test():
    choice.objects.all().delete()
    Pre_step_Q.objects.all().delete()

    for i in range(0, 10):
        q = Pre_step_Q(pre_step_q_id = Pre_step_Q.objects.count(), question = "Is this question "+str(i)+"?")
        q.save()
        for j in range(0, 5):
            c = choice(choice_id = j, choice = "Choice "+str(j)+" of question "+str(i), question = q)
            if j==i%5:
                c.is_right = True
            c.save()

def gen_target_art():
    Interpretation.objects.all().delete()
    Question2.objects.all().delete()

    Q2_Art_Link.objects.all().delete()
    Question2_group.objects.all().delete()
    Answer1.objects.all().delete()
    Question1.objects.all().delete()
    Question1_group.objects.all().delete()

    Target_Article.objects.all().delete()
    t = Target_Article(title="Korean-War", summary="")
    f = codecs.open(os.path.join(os.path.dirname(__file__), "Korean-War/Korean-War"), 'r', 'utf8')
    tt = f.read()
#    print(tt)
    t.summary = tt
    f.close()
    t.save()

def gen_sub_art():
   # choice.objects.all().delete()
   # Pre_step_Q.objects.all().delete()
    Interpretation.objects.all().delete()
    Question2.objects.all().delete()
    Q2_Art_Link.objects.all().delete()
    Question2_group.objects.all().delete()

    Answer1.objects.all().delete()
    Question1.objects.all().delete()
    Question1_group.objects.all().delete()
    Article.objects.all().delete()
    questions = []
    onlyfiles = []
    """for f in listdir(join(os.path.dirname(__file__), "Korean-War/questions")):
        questions.append(f)
    print(questions)
    for i in questions:
        f= codecs.open(os.path.join(os.path.dirname(__file__), "Korean-War/questions/"+i), "r", encoding="utf8")
        q = Pre_step_Q(pre_step_q_id=Pre_step_Q.objects.count(), question=i)
        q.save()
        for j in range(0, 5):
            tt = f.readline()
            if j!=4:
                c=choice(choice_id = j, choice = tt[1:len(tt)-1], question = q)
                print(tt[1:len(tt)-1])

            else:
                c=choice(choice_id = j, choice = tt[1:len(tt)], question = q)
                print(tt[1:len(tt)])
            if tt[0]=="T":
                c.is_right=True
            elif tt[0]=="F":
                c.is_right=False
            c.save()
        f.close()
    for f in listdir(join(os.path.dirname(__file__), "Korean-War/Sub")):
        onlyfiles.append(f)
#    print(onlyfiles)
#    print("subart")
    for i in onlyfiles:
        f = codecs.open(os.path.join(os.path.dirname(__file__), "Korean-War/Sub/"+i), "r", encoding="utf8")
        tt = f.read()
        t=Article(title=i[11:], summary=tt)
        t.save()
        f.close()"""
