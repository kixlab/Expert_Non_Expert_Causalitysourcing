# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-22 04:44
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0017_auto_20170822_0241'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='article_id',
            field=models.CharField(db_index=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateField(default=datetime.datetime(2017, 8, 22, 4, 44, 47, 269159, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='article',
            name='title',
            field=models.CharField(db_index=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='entity',
            name='entity_text',
            field=models.CharField(db_index=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='entity',
            name='entity_uri',
            field=models.CharField(db_index=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='link',
            name='link_id',
            field=models.IntegerField(db_index=True, default='0'),
        ),
        migrations.AlterField(
            model_name='session_info',
            name='session_id',
            field=models.IntegerField(db_index=True, default='0'),
        ),
    ]
