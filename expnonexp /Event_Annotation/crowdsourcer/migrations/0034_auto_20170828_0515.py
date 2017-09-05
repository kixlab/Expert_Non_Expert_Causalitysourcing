# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-28 05:15
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsourcer', '0033_auto_20170827_1440'),
    ]

    operations = [
        migrations.RenameField(
            model_name='article',
            old_name='FT_annot_N',
            new_name='control_annot_N',
        ),
        migrations.RenameField(
            model_name='article',
            old_name='FT_annot_R',
            new_name='control_annot_R',
        ),
        migrations.AlterField(
            model_name='article',
            name='published_at',
            field=models.DateField(default=datetime.date(2017, 8, 28)),
        ),
    ]