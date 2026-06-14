import re

file_path = r'c:\Users\mkmka\Desktop\Adomantra Dated 11 Jun 26\Final-Adomantra-2026-main\adotrip.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

content = "".join(lines)

style_blocks = []
for m in re.finditer(r'<style[^>]*>(.*?)</style>', content, re.DOTALL | re.IGNORECASE):
    start_pos = m.start()
    end_pos = m.end()
    
    # Calculate line numbers
    start_line = content[:start_pos].count('\n') + 1
    end_line = content[:end_pos].count('\n') + 1
    
    inner_css = m.group(1)
    css_lines = inner_css.strip().split('\n')
    
    print(f"Style Block at lines {start_line} to {end_line}:")
    print(f"Total lines inside: {len(css_lines)}")
    if len(css_lines) <= 20:
        for l in css_lines:
            print("  ", l)
    else:
        for l in css_lines[:10]:
            print("  ", l)
        print("   ...")
        for l in css_lines[-10:]:
            print("  ", l)
    print("-" * 50)
