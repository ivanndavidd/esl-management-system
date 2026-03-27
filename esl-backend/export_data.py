import os, django, json
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'
os.environ.setdefault('DB_HOST', 'localhost')
django.setup()

from django.core import serializers
from django.apps import apps

exclude = [
    'contenttypes.contenttype',
    'auth.permission',
    'admin.logentry',
    'sessions.session',
    'token_blacklist.outstandingtoken',
    'token_blacklist.blacklistedtoken',
]
all_objects = []
for model in apps.get_models():
    label = model._meta.label_lower
    if label in exclude:
        continue
    qs = list(model.objects.all())
    all_objects.extend(qs)
    print(f'{label}: {len(qs)} objects')

with open('db_dump.json', 'w', encoding='utf-8', errors='replace') as f:
    f.write(serializers.serialize('json', all_objects, indent=2))
print('Done:', len(all_objects), 'total objects')
