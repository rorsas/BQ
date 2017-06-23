from django.contrib import admin

# Register your models here.
from BQMain.models import Strategy, Dealer, Notice, Tag

admin.site.register(Strategy)
admin.site.register(Dealer)
admin.site.register(Tag)
admin.site.register(Notice)
