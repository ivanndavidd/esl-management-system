from django.core.management.base import BaseCommand
from categories.models import USPCategory

CATEGORIES = [
    {
        'name': 'Blibli White',
        'icon_url': '/upload/images/000/esl_image/esi69a10c06a6643_dither.png',
        'keywords': [],
    },
    {
        'name': 'Blibli Black',
        'icon_url': '/upload/images/000/esl_image/esi699fc691040e1_dither.png',
        'keywords': [],
    },
    {
        'name': 'Battery',
        'icon_url': '/upload/images/000/esl_image/esi69af8b5bbef01_dither.png',
        'keywords': ['battery', 'baterai', 'mah', 'playback', 'charging', 'charge',
                     'pengisian', 'daya tahan', 'fast charge', 'flashcharge',
                     'hypercharge', 'supercharge', 'supervooc'],
    },
    {
        'name': 'Camera',
        'icon_url': '/upload/images/000/esl_image/esi69af8bc5a8b5a_dither.png',
        'keywords': ['camera', 'kamera', 'portrait', 'potrait', 'telephoto', 'zoom',
                     'ois', 'photo', 'video', 'vlog', 'cinematic', 'leica', 'zeiss',
                     'hasselblad', 'xmage', 'imx', '50mp', '64mp', '108mp', '200mp'],
    },
    {
        'name': 'Productivity',
        'icon_url': '/upload/images/000/esl_image/esi69af8c293f70c_dither.png',
        'keywords': ['productivity', 'office', 'keyboard', 'key travel', 'keypad',
                     'notes', 'wps', 'gopaint', 'pencil', 'stylus', 'm-pencil',
                     'app', 'kids mode', 'mode anak'],
    },
    {
        'name': 'Performance',
        'icon_url': '/upload/images/000/esl_image/esi69af8c550b6a6_dither.png',
        'keywords': ['performance', 'performa', 'snapdragon', 'dimensity', 'helio',
                     'qualcomm', 'processor', 'prosesor', 'chipset', 'chip',
                     'platform', 'intel', 'core', 'octa-core', 'liquidcool',
                     'lag', 'fluency'],
    },
    {
        'name': 'Durability',
        'icon_url': '/upload/images/000/esl_image/esi69af8c8f01f93_dither.png',
        'keywords': ['water resistant', 'water resistance', 'waterproof', 'tahan air',
                     'splash', 'dust', 'shock', 'impact resistant', 'military',
                     'mil-std', 'armorshell', 'reliability', 'ip54', 'ip64',
                     'ip65', 'ip66', 'ip67', 'ip68', 'ip69'],
    },
    {
        'name': 'Design',
        'icon_url': '/upload/images/000/esl_image/esi69af8cebc79cf_dither.png',
        'keywords': ['design', 'desain', 'slim', 'thin', 'lightweight', 'ultra light',
                     'body', 'curved', 'curve', 'premium', 'glass', 'metal',
                     'texture', 'titanium', 'leather', 'kulit', 'hinge',
                     'creaseless', 'symbol'],
    },
    {
        'name': 'Audio',
        'icon_url': '/upload/images/000/esl_image/esi69af8d288580c_dither.png',
        'keywords': ['speaker', 'sound', 'audio', 'bass', 'dolby', 'dts', 'jbl',
                     'anc', 'noise', 'mic', 'microphone', 'voice', 'listen',
                     'driver', 'volume'],
    },
    {
        'name': 'Security',
        'icon_url': '/upload/images/000/esl_image/esi69af8d4f01c7b_dither.png',
        'keywords': ['fingerprint', 'unlock', 'face unlock', 'security'],
    },
    {
        'name': 'Memory',
        'icon_url': '/upload/images/000/esl_image/esi69af8d8bdcb3e_dither.png',
        'keywords': ['ram', 'rom', 'memory', 'storage', 'internal storage',
                     'extended ram', 'ram expansion', 'card slot', 'slot kartu'],
    },
    {
        'name': 'Display',
        'icon_url': '/upload/images/000/esl_image/esi69af9b3295bb6_dither.png',
        'keywords': ['display', 'layar', 'screen', 'amoled', 'oled', 'lcd',
                     'refresh', '120hz', '144hz', '90hz', 'bezel', 'fhd',
                     'fullview', 'papermatte', 'eye comfort', 'eyecare', 'true color'],
    },
    {
        'name': 'Compatibility',
        'icon_url': '/upload/images/000/esl_image/esi69b141528ce7b_dither.png',
        'keywords': ['ios', 'android', 'compatible', 'kompatibel'],
    },
    {
        'name': 'Software',
        'icon_url': '/upload/images/000/esl_image/esi69af8c550b6a6_dither.png',
        'keywords': ['hyperos', 'system update', 'operating system', 'clean os',
                     'pure os', 'software'],
    },
    {
        'name': 'Gaming',
        'icon_url': '/upload/images/000/esl_image/esi69b140b752945_dither.png',
        'keywords': ['gaming', 'freefire', 'mlbb', 'esports'],
    },
    {
        'name': 'Health',
        'icon_url': '/upload/images/000/esl_image/esi69b140e18d1a8_dither.png',
        'keywords': ['health', 'kesehatan', 'sleep', 'spo2', 'heart', 'truseen',
                     'trusleep', 'oxygen', 'oksigen darah'],
    },
    {
        'name': 'Connectivity',
        'icon_url': '/upload/images/000/esl_image/esi69b1412d529ea_dither.png',
        'keywords': ['connectivity', 'bluetooth', 'wifi', '5g', 'nearlink', 'nfc',
                     'network', 'usb type-c', 'whatsapp', 'gnss', 'antenna', 'connect'],
    },
    {
        'name': 'Feature',
        'icon_url': '/upload/images/000/esl_image/esi69b141528ce7b_dither.png',
        'keywords': [],
    },
    {
        'name': 'Fitness',
        'icon_url': '/upload/images/000/esl_image/esi69b140e18d1a8_dither.png',
        'keywords': ['fitness', 'olahraga', 'workout', 'outdoor', 'bersepeda',
                     'golf', 'sport'],
    },
    {
        'name': 'AI',
        'icon_url': '/upload/images/000/esl_image/esi69b14188c99d7_dither.png',
        'keywords': ['ai', 'advanced ai', 'advance ai', 'ai editor', 'ai retouch',
                     'ai erase', 'al-enhanced'],
    },
    {
        'name': 'Comfort',
        'icon_url': '/upload/images/000/esl_image/esi69af8c550b6a6_dither.png',
        'keywords': ['comfort', 'cushion', 'headband', 'ergonomic', 'ergonomis'],
    },
]


class Command(BaseCommand):
    help = 'Seed USP categories with keywords and icon URLs'

    def handle(self, *args, **kwargs):
        created = 0
        updated = 0
        for cat in CATEGORIES:
            obj, is_new = USPCategory.objects.update_or_create(
                name=cat['name'],
                defaults={
                    'icon_url': cat['icon_url'],
                    'keywords': cat['keywords'],
                }
            )
            if is_new:
                created += 1
            else:
                updated += 1

        self.stdout.write(self.style.SUCCESS(
            f'Done! {created} created, {updated} updated.'
        ))
