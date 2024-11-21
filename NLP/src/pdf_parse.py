import fitz
import re
import string
import re
from collections import Counter
import base64
import fitz 
from io import BytesIO

STOP_WORDS = {"and", "or", "of", "in", "on", "for", "with", "the", "a", "an", "to"}

def tags_pages(merged_pages):
    tagged_texts = []
    
    for item in merged_pages:
        tag = item['tag']
        text_content = item['text']
        
        tagged_texts.append({"tag":tag, "content": text_content})
    
    return tagged_texts

def add_tags(merged_pages):
    # Determine the most common font size for paragraphs
    font_sizes = [item['size'] for item in merged_pages]
    font_size_counts = Counter(font_sizes)
    p_font_size = font_size_counts.most_common(1)[0][0]  # Most common font size

    # Sort font sizes in descending order to assign header levels
    unique_font_sizes = sorted(set(font_sizes), reverse=True)
    
    # Regular expression pattern for list items
    list_pattern = re.compile(r'^\s*(?:\(\d+\)|\([a-zA-Z]+\)|\d+(\.\d+)*\.|[a-zA-Z]{1,2}\.|-)')

    # Map header levels based on font size order
    header_levels = {}
    header_counter = 1

    for font_size in unique_font_sizes:
        if font_size > p_font_size:
            header_levels[font_size] = f"h{header_counter}"
            header_counter += 1
            if header_counter > 5:
                break  # Stop at h5
        else:
            break

    for item in merged_pages:
        font_size = item['size']
        is_bold = item['bold']
        horizontal_offset = item['horizontal_offset']
        text_content = item['text']

        # Determine header tags
        if font_size in header_levels:
            item['tag'] = header_levels[font_size]
        
        # Determine paragraph (non-bold with p font size)
        elif font_size == p_font_size and not is_bold:
            item['tag'] = 'p'
        
        # Consider bold text with p font size as title (assign h1 or h2 based on specific needs)
        elif font_size == p_font_size and is_bold:
            item['tag'] = 'h1'
        
        # Determine list items
        elif font_size < p_font_size and horizontal_offset > 0 and list_pattern.match(text_content):
            item['tag'] = 'li'
        
        # Default to paragraph if none of the above conditions are met
        else:
            item['tag'] = 'p'

    return merged_pages

def is_header(text):
    # Remove extra spaces and split into words
    words = text.strip().split()
    if not words:
        return False  # Return False for empty text

    # Variables to count total words and capitalized words (ignoring stop words)
    total_words = 0
    capitalized_words = 0

    for word in words:
        cleaned_word = word.strip(string.punctuation)

        # Ignore stop words
        if cleaned_word.lower() not in STOP_WORDS:
            total_words += 1
            if cleaned_word.isupper():
                capitalized_words += 1

    # Avoid division by zero and check if 75% of the words are capitalized
    if total_words == 0:
        return False
    return capitalized_words / total_words >= 0.75
# problem where both are headers and gap
def combined_headers(text1, text2, is_gap):
  if is_header(text1) and is_header(text2) and is_gap:
    return False
  if is_header(text1) and not is_header(text2):
    return True
  return False

def starts_with_lowercase(text):
    return text and text[0].islower()

def starts_with_list_item(text):
    if len(text) < 4:
        return False
    first_char = text[0].lower()
    pattern = r'^\s*(?:\(\d+\)|\([a-zA-Z]+\)|\d+(\.\d+)*\.|[a-zA-Z]{1,2}\.|-)'
    return bool(re.match(pattern, text))

def _merge_spans(spans, vc, rightmost_margin, threshold):
    def is_paragraph_gap(gap):
      if gap is None:
        return False
      closest_gap = min(vc, key=lambda v: abs(v - gap))
      return abs(closest_gap - gap) >= abs(vc[0] - gap)

    merged_spans = []
    i = 0

    while i < len(spans):
        current_span = spans[i]

        # Prepare to accumulate values for merging
        merged_text = current_span["text"]
        merged_bold = current_span["bold"]
        merged_italic = current_span["italic"]
        horizontal_offset = current_span["horizontal_offset"]
        horizontal_offset_bin = current_span["horizontal_offset_bin"]
        vertical_gap = current_span["vertical_gap"]
        rightmost_offset = current_span["bbox"][2]

        # Track font usage for majority determination
        font_count = {current_span["font"]: len(current_span["text"])}
        size_count = {current_span["size"]: len(current_span["text"])}

        # Merge with the next span(s) as long as vertical_gap is 0
        while i + 1 < len(spans) and (
            vertical_gap == 0
            or starts_with_lowercase(spans[i + 1]["text"])# and not starts_with_list_item(spans[i + 1]["text"]))
            or is_paragraph_gap(vertical_gap)# and not starts_with_list_item(spans[i + 1]["text"])
            ):
            if vertical_gap != 0 and (
                # horizontal_offset_bin < spans[i + 1]["horizontal_offset_bin"]
                rightmost_margin - rightmost_offset > threshold or
                starts_with_list_item(spans[i + 1]["text"]) or
                merged_bold and not spans[i + 1]["bold"]
                or merged_italic and not spans[i + 1]["italic"]
                # or is_header(merged_text)
                or combined_headers(merged_text, spans[i + 1]["text"], is_paragraph_gap(vertical_gap))
                ):
                break
            next_span = spans[i + 1]
            merged_text += " " + next_span["text"]

            # Update bold and italic (if either is False, result is False)
            merged_bold = merged_bold and next_span["bold"]
            merged_italic = merged_italic and next_span["italic"]

            # Update font and size counts
            font_count[next_span["font"]] = font_count.get(next_span["font"], 0) + len(next_span["text"])
            size_count[next_span["size"]] = size_count.get(next_span["size"], 0) + len(next_span["text"])

            # Use the next span's vertical gap for the merged result
            # current_span["vertical_gap"] = next_span["vertical_gap"]
            vertical_gap = next_span["vertical_gap"]
            rightmost_offset = next_span["bbox"][2]

            # Skip to the next span
            i += 1

        # Determine the majority font and size by counting non-empty characters
        majority_font = max(font_count, key=font_count.get)
        majority_size = max(size_count, key=size_count.get)

        # Create the merged span and add to the list
        merged_spans.append({
            "text": merged_text,
            "font": majority_font,
            "size": majority_size,
            "bold": merged_bold,
            "italic": merged_italic,
            "horizontal_offset": horizontal_offset,
            "vertical_gap": vertical_gap,
        })

        # Move to the next span
        i += 1

    return merged_spans


def round_to_half(number):
    return round(number * 2) / 2

def bin_vertical_gaps(vertical_gaps):
    rounded_gaps = [round_to_half(gap) for gap in vertical_gaps if gap is not None and gap > 0]

    unique_gaps = sorted(set(rounded_gaps))

    bins = []
    current_bin = [unique_gaps[0]]

    for gap in unique_gaps[1:]:
        if gap - current_bin[-1] <= 1:
            current_bin.append(gap)
        else:
            bins.append(current_bin)
            current_bin = [gap]

    bins.append(current_bin)

    bins = [sum(bin)/len(bin) for bin in bins]
    return bins


def bin_gaps(gaps):
    rounded_gaps = [round(gap) for gap in gaps if gap is not None and gap > 0]

    unique_gaps = sorted(set(rounded_gaps))

    bins = []
    current_bin = [unique_gaps[0]]

    for gap in unique_gaps[1:]:
        if gap - current_bin[-1] < 2:
            current_bin.append(gap)
        else:
            bins.append(current_bin)
            current_bin = [gap]

    bins.append(current_bin)

    bins = [sum(bin)/len(bin) for bin in bins]
    return bins

def _extract_page_content(page):
    spans = []

    blocks = page.get_text("dict")["blocks"]
    for block in blocks:
        if "lines" in block:
            for line in block["lines"]:
                for span in line["spans"]:
                    span_text = span["text"].strip()
                    if span_text:
                        spans.append({
                            "text": span_text,
                            "font": span["font"],
                            "size": span["size"],
                            "bold": "Bold" in span["font"],
                            "italic": "Italic" in span["font"],
                            "bbox": span["bbox"],
                            "horizontal_offset": None,
                            "vertical_gap": None,
                        })

    spans = sorted(spans, key=lambda s: (s["bbox"][1], s["bbox"][0]))

    for span in spans:
        span["horizontal_offset"] = span["bbox"][0]

    for i in range(len(spans) - 1):
        current_span = spans[i]
        next_span = spans[i + 1]

        current_y1 = current_span["bbox"][3]
        next_y0 = next_span["bbox"][1]

        vertical_gap = next_y0 - current_y1

        current_span["vertical_gap"] = vertical_gap if vertical_gap > 0 else 0

    spans[-1]["vertical_gap"] = None

    return spans

def closoest_bin(value, bins):
    return min(bins, key=lambda x: abs(x - value))


def extract_text(pdf):
    
    if not pdf:
            raise ValueError("PDF data is missing or None.")
        
        
    pdf_binary = base64.b64decode(pdf)
    pdf_document = fitz.open(stream=BytesIO(pdf_binary), filetype="pdf")
    print(pdf_document)
    pages = []
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        pages.append(_extract_page_content(page))
        
    spams = []
    for page in pages:
        for item in page:
            spams.append(item)
            
    vertical_gaps = []
    for item in spams:
        vertical_gaps.append(item['vertical_gap'])
    vertical_gaps = set(vertical_gaps)
    vertical_gaps_bins = bin_vertical_gaps(vertical_gaps)
    
    horizontal_offsets = []
    for item in spams:
        horizontal_offsets.append(item['horizontal_offset'])
    horizontal_offsets = set(horizontal_offsets)
    horizontal_offsets_bins = bin_gaps(horizontal_offsets)

    for item in spams:
        h_o = item['horizontal_offset']
        item['horizontal_offset_bin'] = closoest_bin(h_o, horizontal_offsets_bins)
        
        rightmost_margin = 0

    for span in spams:
        bbox = span["bbox"]
        x1 = bbox[2]

        if x1 > rightmost_margin:
            rightmost_margin = x1

    page = pdf_document.load_page(0)
    page_rect = page.rect

    # Extract width and height
    page_width = page_rect.width
    page_height = page_rect.height

    right_gap = page_width - rightmost_margin
    left_gap = right_gap
    available_space = rightmost_margin - left_gap

    threshold = 0.25 * available_space
    merged_pages = _merge_spans(spams, list(vertical_gaps_bins), rightmost_margin, threshold)

    font_sizes = []
    for item in merged_pages:
        font_sizes.append(item['size'])
        
    # ---     
    return merged_pages

def extract_sections(tagged_spams):
    sections = []
    current_section = None

    for item in tagged_spams:
        tag = item['tag']
        text = item['content']
        if tag.startswith('h'):
            if current_section:
                sections.append(current_section)
            
            current_section = {"header": text, "content": ""}
        
        else:
            if current_section:
                current_section["content"] += f" {text}"

    if current_section:
        sections.append(current_section)

    return sections
    

def extract_tags(spams):
    tags = add_tags(spams)
    tagged_spams = tags_pages(tags)
    
    return tagged_spams
    