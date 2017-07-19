from django.db import models
from django.contrib.auth.models import User, UserManager

# Create your models here.
from django.utils.timezone import now


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Notice(models.Model):
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=1000)

    crt_date = models.DateTimeField('创建时间', auto_now_add=True, editable=True)
    pub_date = models.DateTimeField('发表时间', auto_now_add=True, editable=True)
    update_time = models.DateTimeField('更新时间', auto_now=True, null=True)

    author = models.ForeignKey('Dealer', on_delete=models.PROTECT)
    strategy = models.ForeignKey('Strategy', on_delete=models.PROTECT)

    published = models.BooleanField('正式发布', default=True)

    def __str__(self):
        return self.title


class Strategy(models.Model):
    name = models.CharField('策略名', max_length=256)
    code = models.CharField('策略编码', null=False, default='1', max_length=20)
    description = models.TextField('简介')
    content = models.TextField('详情')

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField('打分', default=3)
    tags = models.ManyToManyField('Tag', '标签')
    tagMain = models.ForeignKey('Tag', on_delete=models.CASCADE)

    price = models.DecimalField('月租', max_digits=10, decimal_places=0, default=0)
    viewCount = models.IntegerField('热度', null=True, default=0)
    likeCount = models.IntegerField('点赞数', null=True, default=0)
    followCount = models.IntegerField('关注数', null=True, default=0)
    dealCount = models.IntegerField('交易数', null=True, default=0)

    # 收益统计
    totalReturn = models.DecimalField('总收益率', max_digits=10, decimal_places=2, null=True, default=0)
    annualizedReturn = models.DecimalField('年化收益率', max_digits=10, decimal_places=2, null=True, default=0)
    initialReturn = models.DecimalField('自创建日收益', max_digits=10, decimal_places=2, null=True, default=0)
    initialTime = models.DateTimeField('创建时间', auto_now_add=True, editable=True)
    sharp = models.DecimalField('夏普比率', max_digits=10, decimal_places=2, null=True, default=0)
    retracementMax = models.DecimalField('最大回撤率', max_digits=10, decimal_places=2, null=True, default=0)
    volatility = models.DecimalField('收益波动率', max_digits=10, decimal_places=2, null=True, default=0)
    informationRatio = models.DecimalField('信息比率', max_digits=10, decimal_places=2, null=True, default=0)
    alpha = models.DecimalField('Beta', max_digits=10, decimal_places=2, null=True, default=0)
    beta = models.DecimalField('Alpha', max_digits=10, decimal_places=2, null=True, default=0)

    investLine = models.DecimalField('投资额度', max_digits=10, decimal_places=2, null=True, default=10)
    portfoliosAdjustment = models.IntegerField('调仓周期', null=True, default=1)
    portfoliosAdjustmentNext = models.DateTimeField('下个调仓', auto_now_add=True, editable=True)
    regressionBegin = models.DateTimeField('回测开始', auto_now_add=True, editable=True)
    regressionEnd = models.DateTimeField('回测结束', auto_now_add=True, editable=True)
    pub_date = models.DateTimeField('发表时间', auto_now_add=True, editable=True)
    update_time = models.DateTimeField('更新时间', auto_now=True, null=True)

    published = models.BooleanField('正式发布', default=True)

    def getdays(self):
        return abs(now() - self.initialTime).days

    def __str__(self):
        return self.name


class Dealer(User):
    UserType = [
        (1, '交易员'),
        (2, '客户'),
    ]

    description = models.TextField(max_length=1000, default="暂无", blank=True)
    # headImage = models.ImageField(upload_to='/media/img/users/', null=True, blank=True)
    pop = models.IntegerField(default=0)

    objects = UserManager()

    def _get_full_name(self):
        # Returns the person's full name."
        return self.first_name

    full_name = property(_get_full_name)

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)


class Customer(User):
    description = models.TextField(max_length=1000, default="暂无", blank=True)
    # headImage = models.ImageField(upload_to='/media/img/users/', null=True, blank=True)
    strategyList_follow = models.ManyToManyField(Strategy, "关注列表");
    strategyList_deal = models.ManyToManyField(Strategy, "交易列表");
    strategyList_like = models.ManyToManyField(Strategy, "点赞列表");
    noticeList = models.ManyToManyField(Notice, "通知列表");
    dealerList = models.ManyToManyField(Dealer, "交易员列表");

    objects = UserManager()

    def _get_full_name(self):
        # Returns the person's full name."
        return self.first_name

    full_name = property(_get_full_name)

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)
