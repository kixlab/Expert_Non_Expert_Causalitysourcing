# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-22 00:12
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0013_auto_20170822_0012'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateField(default=datetime.datetime(2017, 8, 22, 0, 12, 48, 625371, tzinfo=utc)),
        ),
    ]
