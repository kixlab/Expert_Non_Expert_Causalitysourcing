# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-21 10:19
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0008_auto_20170819_0834'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='deprecated',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateTimeField(default=datetime.datetime(2017, 8, 21, 10, 19, 27, 668252, tzinfo=utc)),
        ),
    ]
