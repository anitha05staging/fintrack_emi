import json

input_file = 'data_backup.json'
output_file = 'data_backup_fixed.json'

try:
    # Try reading as UTF-16 (common PowerShell redirect encoding)
    with open(input_file, 'r', encoding='utf-16') as f:
        data = json.load(f)
    
    # Write back as UTF-8
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully converted {input_file} to UTF-8 as {output_file}")

except UnicodeError:
    print("Could not decode as UTF-16, trying default...")
    try:
        with open(input_file, 'r', encoding='utf-8-sig') as f: # Handle BOM
            data = json.load(f)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Successfully converted {input_file} to UTF-8 as {output_file}")
    except Exception as e:
        print(f"Failed to convert: {e}")
except Exception as e:
    print(f"Error: {e}")
