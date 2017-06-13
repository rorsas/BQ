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

urlpatterns = [
                  url(r'^jet/', include('jet.urls', 'jet')),  # Django JET URLS
                  url(r'^jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),  # Django JET dashboard URLS
                  url(r'^admin/', admin.site.urls),

                  url(r'^$', main_view.to_home),
                  url(r'^home/', main_view.home, name='home'),
                  url(r'^test/', main_view.test),
                  url(r'^index/', main_view.IndexView.as_view(), name='index'),
                  url(r'^market/', main_view.marketView.as_view(), name='market'),
                  url(r'^dealer/', main_view.DealerIndexView.as_view(), name='dealer'),
                  url(r'^market/strategy/(?P<pk>[0-9]+)/$', main_view.DetailView.as_view(), name='detail'),

                  url(r'^(?P<path>.*)$', static_view.serve),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
