# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-31 07:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0036_auto_20170831_0301'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='target_article',
            name='episode',
        ),
        migrations.RemoveField(
            model_name='target_article',
            name='season',
        ),
        migrations.RemoveField(
            model_name='target_article',
            name='time_description',
        ),
    ]