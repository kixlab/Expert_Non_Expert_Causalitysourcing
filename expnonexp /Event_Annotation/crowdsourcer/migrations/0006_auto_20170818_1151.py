# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-18 11:51
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0005_auto_20170818_1053'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateTimeField(default=datetime.datetime(2017, 8, 18, 11, 51, 48, 542822, tzinfo=utc)),
        ),
    ]
