import os
import django
from django.core.management import call_command
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fintrack.settings')
django.setup()

output_file = 'data_backup_utf8.json'

print(f"Exporting data to {output_file} (UTF-8)...")

with open(output_file, 'w', encoding='utf-8') as f:
    call_command(
        'dumpdata', 
        exclude=['auth.permission', 'contenttypes', 'corsheaders'], 
        indent=2, 
        stdout=f
    )

print("Export complete.")
