import csv
import io
import re
from collections import defaultdict
from .models import Product, ProductVariant


def clean_price(value):
    """Convert price string like ' 3,499,000 ' to integer 3499000"""
    if not value or not value.strip():
        return None
    cleaned = re.sub(r'[^\d]', '', value.strip())
    return int(cleaned) if cleaned else None


def normalize_brand(brand):
    return brand.strip().lower()


def normalize_str(value):
    return (value or '').strip()


def make_group_key(row):
    """Group key: normalized brand + commercial_name + colour + usp1-4"""
    return (
        normalize_brand(row.get('Brand', '')),
        normalize_str(row.get('Commercial Name', '')).lower(),
        normalize_str(row.get('Colour', '')).lower(),
        normalize_str(row.get('USP 1', '')).lower(),
        normalize_str(row.get('USP 2', '')).lower(),
        normalize_str(row.get('USP 3', '')).lower(),
        normalize_str(row.get('USP 4', '')).lower(),
    )


def parse_and_import_csv(file):
    raw = file.read()
    for enc in ('utf-8-sig', 'utf-8', 'latin-1', 'cp1252'):
        try:
            content = raw.decode(enc)
            break
        except (UnicodeDecodeError, LookupError):
            continue
    else:
        raise ValueError('Tidak dapat membaca encoding file. Simpan ulang sebagai UTF-8.')
    reader = csv.DictReader(io.StringIO(content))

    # Group rows by product key
    groups = defaultdict(list)
    group_meta = {}  # key -> first row metadata

    for row in reader:
        brand = normalize_str(row.get('Brand', ''))
        commercial_name = normalize_str(row.get('Commercial Name', ''))

        # Skip empty rows
        if not brand or not commercial_name:
            continue

        # Skip rows with no price and no RAM/ROM (truly empty products)
        unit_price = clean_price(row.get('Unit Price', ''))
        ram = normalize_str(row.get('RAM', ''))
        rom = normalize_str(row.get('ROM', ''))
        if unit_price is None and not ram and not rom:
            continue

        key = make_group_key(row)

        if key not in group_meta:
            group_meta[key] = {
                'brand': brand,
                'commercial_name': commercial_name,
                'colour': normalize_str(row.get('Colour', '')),
                'usp_1': normalize_str(row.get('USP 1', '')),
                'usp_2': normalize_str(row.get('USP 2', '')),
                'usp_3': normalize_str(row.get('USP 3', '')),
                'usp_4': normalize_str(row.get('USP 4', '')),
            }

        variant = {
            'ram': ram,
            'rom': rom,
            'unit_price': unit_price,
            'installment': clean_price(row.get('Installment ', '') or row.get('Installment', '')),
        }
        groups[key].append(variant)

    created_count = 0
    updated_count = 0
    skipped_count = 0

    for key, variants in groups.items():
        meta = group_meta[key]

        # Deduplicate variants by (ram, rom, unit_price)
        seen_variants = set()
        unique_variants = []
        for v in variants:
            vkey = (v['ram'].lower(), v['rom'].lower(), v['unit_price'])
            if vkey not in seen_variants:
                seen_variants.add(vkey)
                unique_variants.append(v)

        # Find or create product (match by brand + commercial_name case-insensitive)
        existing = Product.objects.filter(
            brand__iexact=meta['brand'],
            commercial_name__iexact=meta['commercial_name'],
        ).first()

        if existing:
            # Update product metadata
            existing.colour = meta['colour']
            existing.usp_1 = meta['usp_1']
            existing.usp_2 = meta['usp_2']
            existing.usp_3 = meta['usp_3']
            existing.usp_4 = meta['usp_4']
            existing.save()
            product = existing
            # Delete old variants and recreate
            product.variants.all().delete()
            updated_count += 1
        else:
            product = Product.objects.create(**meta)
            created_count += 1

        # Create variants
        for i, v in enumerate(unique_variants, start=1):
            ProductVariant.objects.create(
                product=product,
                variant_number=i,
                ram=v['ram'],
                rom=v['rom'],
                unit_price=v['unit_price'],
                installment=v['installment'],
            )

    return {
        'created': created_count,
        'updated': updated_count,
        'skipped': skipped_count,
        'total_products': created_count + updated_count,
    }


def parse_and_import_accessories_csv(file):
    raw = file.read()
    for enc in ('utf-8-sig', 'utf-8', 'latin-1', 'cp1252'):
        try:
            content = raw.decode(enc)
            break
        except (UnicodeDecodeError, LookupError):
            continue
    else:
        raise ValueError('Tidak dapat membaca encoding file. Simpan ulang sebagai UTF-8.')

    reader = csv.DictReader(io.StringIO(content))

    created_count = 0
    skipped_count = 0

    for row in reader:
        # Strip whitespace from all keys and values
        row = {k.strip(): v for k, v in row.items() if k is not None}

        brand = normalize_str(row.get('Brand2', '') or row.get('Brand', ''))
        product_id = normalize_str(row.get('Kode Item', ''))
        commercial_name = normalize_str(row.get('Rename Final', ''))
        colour = normalize_str(row.get('Color Option', '') or row.get('Colour Option', '') or row.get('Colour', ''))
        unit_price = clean_price(row.get('SRP', '') or row.get('SRP ', ''))

        # Skip empty rows
        if not product_id or not commercial_name:
            continue

        # Check for exact duplicate: same product_id AND all fields identical
        existing = Product.objects.filter(product_id=product_id).first()
        if existing:
            # If all fields are identical, skip (duplicate)
            existing_price = None
            existing_variant = existing.variants.first()
            if existing_variant:
                existing_price = existing_variant.unit_price

            if (
                existing.brand == brand and
                existing.commercial_name == commercial_name and
                existing.colour == colour and
                existing_price == unit_price
            ):
                skipped_count += 1
                continue
            # Different data with same ID — update
            existing.brand = brand
            existing.commercial_name = commercial_name
            existing.colour = colour
            existing.save()
            existing.variants.all().delete()
            if unit_price is not None:
                ProductVariant.objects.create(
                    product=existing,
                    variant_number=1,
                    unit_price=unit_price,
                )
        else:
            product = Product(
                product_id=product_id,
                product_type=Product.PRODUCT_TYPE_ACCESSORY,
                brand=brand,
                commercial_name=commercial_name,
                colour=colour,
            )
            product.save()
            if unit_price is not None:
                ProductVariant.objects.create(
                    product=product,
                    variant_number=1,
                    unit_price=unit_price,
                )
            created_count += 1

    return {
        'created': created_count,
        'skipped': skipped_count,
        'total_products': created_count,
    }
