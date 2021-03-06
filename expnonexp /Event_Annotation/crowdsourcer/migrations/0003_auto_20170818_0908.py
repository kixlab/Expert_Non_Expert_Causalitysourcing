# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-18 09:08
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0002_article_published_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='Entities',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_uri', models.CharField(default='', max_length=200)),
                ('entity_text', models.CharField(default='', max_length=200)),
            ],
        ),
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateField(default=datetime.datetime(2017, 8, 18, 9, 8, 18, 577471)),
        ),
        migrations.AddField(
            model_name='article',
            name='entities',
            field=models.ManyToManyField(to='crowdsourcer.Entities'),
        ),
    ]
