# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-12 01:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('BQMain', '0006_auto_20170610_1514'),
    ]

    operations = [
        migrations.AddField(
            model_name='strategy',
            name='investLine',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True, verbose_name='投资额度'),
        ),
        migrations.AlterField(
            model_name='strategy',
            name='annualizedReturn',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True, verbose_name='年化收益率'),
        ),
    ]
