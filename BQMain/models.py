from django.db import models
from django.contrib.auth.models import User, UserManager


# Create your models here.
class Strategy(models.Model):
    name = models.CharField('策略名', max_length=256)
    description = models.TextField('简介')
    content = models.TextField('详情')

    author = models.ForeignKey(User, on_delete=models.CASCADE)

    price = models.DecimalField('月租', max_digits=10, decimal_places=0, default=0)

    annualizedReturn = models.DecimalField('年化收益率', max_digits=10, decimal_places=2, null=True, default=0)
    investLine = models.DecimalField('投资额度', max_digits=10, decimal_places=2, null=True, default=10)

    pub_date = models.DateTimeField('发表时间', auto_now_add=True, editable=True)
    update_time = models.DateTimeField('更新时间', auto_now=True, null=True)

    published = models.BooleanField('正式发布', default=True)

    def __str__(self):
        return self.name


class Dealer(User):
    description = models.TextField(max_length=1000, default="暂无", blank=True)
    # headImage = models.ImageField(upload_to='/media/img/users/', null=True, blank=True)
    pop = models.IntegerField(default=0)

    objects = UserManager()
