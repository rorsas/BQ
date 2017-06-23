from django.forms import forms
from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views import generic
from .models import Strategy, Dealer, Customer


# Create your views here.
def home(request):
    return render(request, 'home.html')


def test(request):
    return render(request, 'test.html')


def to_home(request):
    return HttpResponseRedirect(
        reverse('home')
    )


def sub_strategy(request, sid):
    if request.user.is_authenticated():  # 判断用户是否已登录
        user = request.user;  # 获取已登录的用户
    else:
        return JsonResponse({'result': False})

    strategy = Strategy.objects.get(id=sid)
    Customer.objects.get(id=user.id).strategyList_subscribe.add(strategy)
    strategy.subCount += 1
    strategy.save()

    return JsonResponse({'result': True})


def watch_strategy(request, sid):
    if request.user.is_authenticated():  # 判断用户是否已登录
        user = request.user;  # 获取已登录的用户
    else:
        return JsonResponse({'result': False})

    strategy = Strategy.objects.get(id=sid)
    Customer.objects.get(id=user.id).strategyList_watch.add(strategy)
    strategy.watchCount += 1
    strategy.save()

    return JsonResponse({'result': True})


class IndexView(generic.ListView):
    template_name = 'strategy_index.html'
    context_object_name = 'latest_strategy_list'

    def get_queryset(self):
        """Return the last five published questions."""
        return Strategy.objects.select_related('author').order_by('-pub_date')[:5]


class marketView(generic.ListView):
    template_name = 'market.html'
    context_object_name = 'latest_strategy_list'

    def get_queryset(self):
        """Return the last five strategy."""
        return Strategy.objects.select_related('author').order_by('-pub_date')[:5]


class StrategyDetailView(generic.DetailView):
    model = Strategy
    template_name = 'strategy_detail.html'

    # 在 get_context_data() 函数中可以用于传递一些额外的内容到网页
    def get_context_data(self, **kwargs):
        context = super(StrategyDetailView, self).get_context_data(**kwargs)
        context['is_sub'] = False
        context['is_watch'] = False
        if self.request.user.is_authenticated():  # 判断用户是否已登录
            user = self.request.user  # 获取已登录的用户
            sid = self.object.id
            if Customer.objects.get(id=user.id).strategyList_subscribe.filter(id=sid).count() == 1:
                context['is_sub'] = True
            if Customer.objects.get(id=user.id).strategyList_watch.filter(id=sid).count() == 1:
                context['is_watch'] = True
        return context

    def get_object(self):
        # Call the superclass
        object = super(StrategyDetailView, self).get_object()
        object.viewCount += 1
        object.save()
        # Return the object
        return object


class DealerIndexView(generic.ListView):
    template_name = 'dealer.html'
    context_object_name = 'top_dealer_list'

    def get_queryset(self):
        """Return the hottest five dealers."""
        return Dealer.objects.order_by('-pop')[:5]


class SubscribeIndexView(generic.ListView):
    template_name = 'my_strategy_sub.html'
    context_object_name = 'strategy_list'

    def get_queryset(self):
        if self.request.user.is_authenticated():  # 判断用户是否已登录
            user = self.request.user;  # 获取已登录的用户
        else:
            return HttpResponseRedirect(
                reverse('home')
            )

        return Customer.objects.get(id=user.id).strategyList_subscribe.order_by('-pub_date')[:5]


class WatchIndexView(generic.ListView):
    template_name = 'my_strategy_sub.html'
    context_object_name = 'strategy_list'

    def get_queryset(self):
        if self.request.user.is_authenticated():  # 判断用户是否已登录
            user = self.request.user;  # 获取已登录的用户
        else:
            return HttpResponseRedirect(
                reverse('home')
            )

        return Customer.objects.get(id=user.id).strategyList_watch.order_by('-pub_date')[:5]


class NoticeIndexView(generic.ListView):
    template_name = 'my_notice.html'
    context_object_name = 'notice_list'

    def get_queryset(self):
        if self.request.user.is_authenticated():  # 判断用户是否已登录
            user = self.request.user;  # 获取已登录的用户
        else:
            return HttpResponseRedirect(
                reverse('home')
            )

        return Customer.objects.get(id=user.id).noticeList.order_by('-pub_date')[:5]
