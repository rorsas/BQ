from django.contrib import admin

# Register your models here.
from BQMain.models import Strategy, Dealer

admin.site.register(Strategy)
admin.site.register(Dealer)