"""BOCQuant URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.contrib import admin
from BQMain import views as main_view
from django.contrib.staticfiles import views as static_view
from django.contrib.auth import views as auth_views

urlpatterns = [
                  url(r'^jet/', include('jet.urls', 'jet')),  # Django JET URLS
                  url(r'^jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),  # Django JET dashboard URLS
                  url(r'^admin/', admin.site.urls),

                  url(r'^', include('django.contrib.auth.urls')),
                  url(r'^$', main_view.to_home),
                  url(r'^home/$', main_view.home, name='home'),
                  url(r'^login/$', auth_views.login, {'template_name': 'templates/login.html'}),
                  url(r'^test/', main_view.test),
                  url(r'^index/', main_view.IndexView.as_view(), name='index'),
                  url(r'^market/$', main_view.MarketView.as_view(), name='market'),
                  url(r'^dealer/$', main_view.DealerIndexView.as_view(), name='dealer'),
                  url(r'^market/strategy/(?P<pk>[0-9]+)/$', main_view.StrategyDetailView.as_view(), name='detail'),
                  url(r'^sub_strategy/(?P<sid>[0-9]+)/$', main_view.sub_strategy, name='sub_strategy'),
                  url(r'^watch_strategy/(?P<sid>[0-9]+)/$', main_view.watch_strategy, name='watch_strategy'),
                  url(r'^my/strategy/subscribe$', main_view.SubscribeIndexView.as_view(), name='my_sub_strategy'),
                  url(r'^my/strategy/watch$', main_view.WatchIndexView.as_view(), name='my_watch_strategy'),
                  url(r'^my/notice$', main_view.NoticeIndexView.as_view(), name='my_notice'),
                  url(r'^notice/(?P<pk>[0-9]+)/$', main_view.NoticeDetailView.as_view(), name='notice'),

                  url(r'^(?P<path>.*)$', static_view.serve),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
