# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-10 07:14
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('BQMain', '0005_auto_20170610_1512'),
    ]

    operations = [
        migrations.RenameField(
            model_name='strategy',
            old_name='author1',
            new_name='author',
        ),
    ]
