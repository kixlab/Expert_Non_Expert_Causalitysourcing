# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-21 13:16
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0011_auto_20170821_1106'),
    ]

    operations = [
        migrations.CreateModel(
            name='Session_Info',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_id', models.IntegerField(default='0')),
            ],
        ),
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateField(default=datetime.datetime(2017, 8, 21, 13, 16, 29, 732022, tzinfo=utc)),
        ),
        migrations.AddField(
            model_name='session_info',
            name='Article_done',
            field=models.ManyToManyField(to='crowdsourcer.Article'),
        ),
    ]
