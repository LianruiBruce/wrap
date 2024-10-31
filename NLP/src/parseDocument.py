def build_dp_table(nums, k):
    n = len(nums)
    dp = [[] for _ in range(n+1)]
    
    dp[-1].append((-1, 0, None, None))  # (value, loss)
    
    for i in range(n - 1, -1, -1):
        current = nums[i]

        for j in range(i + 1, n + 1):
            minDiff = float('inf')
            best_source = None
            best_pos = None

            # Find the best option for merging
            for pos, (next_value, next_loss, _, _) in enumerate(dp[j]):
                if next_value == -1:
                    diff = 0
                else:
                    diff = (current - next_value) ** 2 + next_loss
                
                if diff < minDiff:
                    minDiff = diff
                    best_source = j
                    best_pos = pos
            
            dp[i].append((current, minDiff, best_source, best_pos))

            if j < n and current + nums[j] <= k:
                current += nums[j]
            else:
                break
    return dp

def find_min_loss(dp):
    min_loss = float('inf')
    best_pos = None
    for pos, (value, loss, source_index, source_pos) in enumerate(dp[0]):
        if loss < min_loss:
            min_loss = loss
            best_pos = pos
    return min_loss, best_pos

def retrieve_solution(strings, values, table, index, pos):
    solution = []
    
    while index < len(table) - 1:
        next_index = table[index][pos][2]
        if next_index is None:
            solution.append(strings[index])
            break
        
        merged_value = sum(values[index:next_index])
        merged_string = " ".join(strings[index:next_index])
        solution.append(merged_string)

        pos = table[index][pos][3]
        index = next_index

    return solution

def chunk_text(text, tokenizer, max_tokens=512):
    paragraphs = [p for p in text.split('\n') if p.strip()]
    
    paragraph_dict = {}
    for para in paragraphs:
        paragraph_dict[para] = len(tokenizer.encode(para, truncation=False))

    strings = list(paragraph_dict.keys())
    nums = list(paragraph_dict.values()) 

    dp_table = build_dp_table(nums, max_tokens)   

    min_loss, best_pos = find_min_loss(dp_table)
    solution = retrieve_solution(strings, nums, dp_table, 0, best_pos)

    return solution
