# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-23 12:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('BQMain', '0017_auto_20170623_2003'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='noticeList',
            field=models.ManyToManyField(related_name='通知列表', to='BQMain.Notice'),
        ),
    ]
