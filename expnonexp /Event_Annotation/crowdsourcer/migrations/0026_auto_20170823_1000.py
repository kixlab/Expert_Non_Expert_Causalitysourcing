# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-23 10:00
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0025_auto_20170823_0300'),
    ]

    operations = [
        migrations.AddField(
            model_name='link',
            name='endfirst',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='link',
            name='notsure',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='link',
            name='startfirst',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateField(default=datetime.datetime(2017, 8, 23, 10, 0, 32, 761891, tzinfo=utc)),
        ),
    ]
