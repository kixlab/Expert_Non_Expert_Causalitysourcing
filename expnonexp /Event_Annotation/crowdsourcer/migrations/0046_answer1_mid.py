# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-06 11:40
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0045_auto_20170906_1102'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer1_mid',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('worker_code', models.TextField(default='', max_length=200)),
                ('mid_answer', models.TextField(default='', max_length=1000)),
                ('question_group', models.ForeignKey(default=None, on_delete=django.db.models.deletion.PROTECT, to='crowdsourcer.Question1_group')),
            ],
        ),
    ]
