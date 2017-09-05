# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-22 02:09
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0015_auto_20170822_0203'),
    ]

    operations = [
        migrations.AddField(
            model_name='session_info',
            name='Link_done',
            field=models.ManyToManyField(to='crowdsourcer.Link'),
        ),
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateField(default=datetime.datetime(2017, 8, 22, 2, 9, 59, 469181, tzinfo=utc)),
        ),
    ]