import json
import re
from urllib.parse import quote

def sanitize_url_filter(url_filter):
    url_filter = url_filter.strip()
    # Replace Adblock Plus syntax with wildcards
    url_filter = url_filter.replace('||', '*://*.')  # Domain-based rules
    url_filter = url_filter.replace('|', '')  # Remove start/end anchors
    url_filter = url_filter.replace('^', '*')  # Separator character
    # Remove unsupported regex characters
    url_filter = re.sub(r'[\^\$]+', '*', url_filter)
    # URL-encode non-ASCII characters
    sanitized = ''.join([char if ord(char) < 128 else quote(char) for char in url_filter])
    # Ensure the filter starts and ends with a wildcard
    if not sanitized.startswith('*'):
        sanitized = '*' + sanitized
    if not sanitized.endswith('*'):
        sanitized = sanitized + '*'
    return sanitized

def parse_easylist(easylist_paths):
    """
    Parse EasyList files and generate a list of JSON rules compatible with Chrome's Declarative Net Request API.
    """
    rules = []
    rule_id = 1

    # Modified resource types to exclude cookie-related types
    common_resource_types = [
        "script", "image", "stylesheet"
    ]

    for easylist_path in easylist_paths:
        with open(easylist_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        for line in lines:
            line = line.strip()

            # Skip comments, metadata, and empty lines
            if not line or line.startswith('!') or (line.startswith('[') and line.endswith(']')):
                continue

            # Skip cosmetic or unsupported rules
            if '##' in line or '#@#' in line or line.startswith('/') or line.endswith('/'):
                continue

            action_type = 'block'
            url_filter = line

            if line.startswith('@@'):
                action_type = 'allow'
                url_filter = url_filter[2:]

            # Sanitize and normalize the URL filter
            url_filter = sanitize_url_filter(url_filter)

            # Skip if url_filter is invalid or too broad
            if not url_filter or url_filter == '*':
                continue

            condition = {
                'urlFilter': url_filter,
                'resourceTypes': common_resource_types
            }

            # Add rule to the list
            rule = {
                'id': rule_id,
                'priority': 1,
                'action': {'type': action_type},
                'condition': condition
            }

            rules.append(rule)
            rule_id += 1

    # Add broader rules for unblocked trackers and ads
    append_common_tracker_rules(rules, rule_id)

    return rules

def append_common_tracker_rules(rules, starting_id):
    """
    Add broad blocking rules for known unblocked ad and tracker domains.
    """
    additional_rules = [
        "*googlesyndication*",
        "*doubleclick*",
        "*google-analytics*",
        "*hotjar*",
        "*mouseflow*",
        "*unityads*",
        "*luckyorange*",
        "*yahoo.com*",
        "*pinterest*",
        "*adservice*",
        "*ads-twitter*",
        "*ads.pinterest*",
        "*pagead*",
        "*media.net*",
        "*adcolony.com*",
        "*oppomobile.com*",
        "*freshmarketer.com*",
        "*samsungads.com*",
        "*yandex.ru*",
        "*metrics.icloud.com*",
        "*appmetrica.yandex.ru*",
        "*iot-logser.realme.com*",
        "*analytics.s3.amazonaws.com*",
        "*ads.youtube.com*",
        "*iadsdk.apple.com*",
        "*bdapi-in-ads.realmemobile.com*",
        "*adtech.yahooinc.com*",
        # Additional domains based on test results
        "*samsung-com.112.2o7.net*",
        "*smetrics.samsung.com*",
        "*metrics.mzstatic.com*",
        "*events.reddit.com*",
        "*events.redditmedia.com*",
        "*ads-api.twitter.com*",
        "*analytics.google.com*",
        "*click.googleanalytics.com*",
        "*iot-eu-logser.realme.com*",
        "*logbak.hicloud.com*",
        "*logservice.hicloud.com*",
        "*logservice1.hicloud.com*",
        "*grs.hicloud.com*",
        "*metrics2.data.hicloud.com*",
        "*metrics.data.hicloud.com*",
        "*tracking.rus.miui.com*",
        "*data.mistat.india.xiaomi.com*",
        "*data.mistat.rus.xiaomi.com*",
        "*data.mistat.xiaomi.com*",
        "*extmaps-api.yandex.net*",
        "*offerwall.yandex.net*",
        "*adtago.s3.amazonaws.com*",
        "*analyticsengine.s3.amazonaws.com*",
        "*advice-ads.s3.amazonaws.com*",
        "*log.byteoversea.com*",
        "*click.oneplus.cn*",
        "*bdapi-ads.realmemobile.com*",
        "*analytics-api.samsunghealthcn.com*",
        "*weather-analytics-events.apple.com*",
        "*notes-analytics-events.apple.com*",
        "*books-analytics-events.apple.com*",
        "*stats.wp.com*",
        "*open.oneplus.net*",
    ]

    for i, pattern in enumerate(additional_rules):
        rule = {
            'id': starting_id + i,
            'priority': 1,
            'action': {'type': 'block'},
            'condition': {
                'urlFilter': pattern,
                'resourceTypes': [
                    "script", "image", "stylesheet"
                ]
            }
        }
        rules.append(rule)

def save_rules_to_json(rules, output_path):
    """
    Save the parsed rules to a JSON file.
    """
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(rules, f, indent=2)

def main():
    easylist_paths = ['./easylist.txt']  # Add your path to EasyList
    output_path = './ad_block_rules.json'

    print("Parsing EasyList...")
    rules = parse_easylist(easylist_paths)
    print(f"Total rules parsed: {len(rules)}")

    print(f"Saving rules to {output_path}...")
    save_rules_to_json(rules, output_path)
    print(f"Rules saved successfully.")

if __name__ == '__main__':
    main()
