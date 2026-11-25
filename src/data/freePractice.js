/* ══════════════════════════════════════════════════════════════
   Free DSA practice — /dashboard/practice
   A standalone, free question bank (open on every plan and in the
   preview). It is NOT the per-unit practice inside Content: solved
   state lives in its own storage key and never counts toward module
   progress, activity or certificates.
   Problem statements are original summaries; difficulty, company and
   topic tags are PLACEHOLDER data to show the layout — replace with
   the real bank.
   ══════════════════════════════════════════════════════════════ */

const P = (slug, title, level, topics, companies, fn, params, returns, statement, examples, constraints = []) => ({
  id: `fp-${slug}`, kind: 'coding', title, level, topics, companies, fn, params, returns, statement, examples, constraints
});
const ex = (input, output, explanation) => ({ input, output, ...(explanation ? { explanation } : {}) });

export const FREE_PROBLEMS = [
  P('two-sum', 'Two Sum', 'Easy', ['Arrays', 'Hashing'], ['Amazon', 'Google'], 'twoSum', [['nums', 'int[]'], ['target', 'int']], 'int[]',
    'Return the indices of the two numbers in nums that add up to target. Exactly one valid pair exists and you may not use the same element twice.',
    [ex('nums = [2, 7, 11, 15], target = 9', '[0, 1]', 'nums[0] + nums[1] = 9')], ['2 ≤ nums.length ≤ 10⁴']),
  P('best-time-stock', 'Best Time to Buy and Sell Stock', 'Easy', ['Arrays', 'Greedy'], ['Amazon', 'Flipkart'], 'maxProfit', [['prices', 'int[]']], 'int',
    'prices[i] is a stock price on day i. Buy once and sell once on a later day; return the largest profit, or 0 if no profit is possible.',
    [ex('prices = [7, 1, 5, 3, 6, 4]', '5', 'Buy at 1, sell at 6.')]),
  P('valid-parentheses', 'Valid Parentheses', 'Easy', ['Stack', 'Strings'], ['Microsoft', 'Razorpay'], 'isValid', [['s', 'string']], 'bool',
    'Given a string of brackets ()[]{}, return true if every bracket is closed by the same type in the right order.',
    [ex('s = "([]{})"', 'true'), ex('s = "(]"', 'false')]),
  P('majority-element', 'Majority Element', 'Easy', ['Arrays', 'Counting'], ['Zoho'], 'majorityElement', [['nums', 'int[]']], 'int',
    'Return the element that appears more than n / 2 times. One always exists. Try O(1) extra space.',
    [ex('nums = [2, 2, 1, 1, 1, 2, 2]', '2')]),
  P('reverse-list', 'Reverse a Linked List', 'Easy', ['Linked List'], ['Amazon', 'Paytm'], 'reverseList', [['head', 'ListNode']], 'ListNode',
    'Reverse a singly linked list and return the new head.',
    [ex('head = 1 → 2 → 3 → 4', '4 → 3 → 2 → 1')]),
  P('binary-search', 'Binary Search', 'Easy', ['Binary Search', 'Arrays'], ['TCS', 'Infosys'], 'search', [['nums', 'int[]'], ['target', 'int']], 'int',
    'nums is sorted in ascending order. Return the index of target, or -1 if it is missing. Run in O(log n).',
    [ex('nums = [-1, 0, 3, 5, 9, 12], target = 9', '4')]),
  P('max-depth', 'Maximum Depth of a Binary Tree', 'Easy', ['Trees', 'Recursion'], ['Uber'], 'maxDepth', [['root', 'TreeNode']], 'int',
    'Return the number of nodes on the longest path from the root down to a leaf.',
    [ex('root = [3, 9, 20, null, null, 15, 7]', '3')]),
  P('longest-substring', 'Longest Substring Without Repeats', 'Medium', ['Strings', 'Sliding Window'], ['Amazon', 'Swiggy'], 'lengthOfLongestSubstring', [['s', 'string']], 'int',
    'Return the length of the longest substring of s with no repeated characters.',
    [ex('s = "abcabcbb"', '3', '"abc" is the longest.')]),
  P('product-except-self', 'Product of Array Except Self', 'Medium', ['Arrays', 'Prefix Sum'], ['Microsoft', 'PhonePe'], 'productExceptSelf', [['nums', 'int[]']], 'int[]',
    'Return an array where answer[i] is the product of every element except nums[i], without using division, in O(n).',
    [ex('nums = [1, 2, 3, 4]', '[24, 12, 8, 6]')]),
  P('group-anagrams', 'Group Anagrams', 'Medium', ['Hashing', 'Strings'], ['Goldman Sachs'], 'groupAnagrams', [['words', 'string[]']], 'string[][]',
    'Group the words that are anagrams of each other. Return the groups in any order.',
    [ex('words = ["eat", "tea", "tan", "ate", "nat", "bat"]', '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]')]),
  P('kth-largest', 'Kth Largest Element', 'Medium', ['Heaps', 'Sorting'], ['Google', 'Zomato'], 'findKthLargest', [['nums', 'int[]'], ['k', 'int']], 'int',
    'Return the kth largest element in nums (by sorted order, not distinct). Aim for better than a full sort.',
    [ex('nums = [3, 2, 1, 5, 6, 4], k = 2', '5')]),
  P('number-of-islands', 'Number of Islands', 'Medium', ['Graphs', 'BFS / DFS'], ['Amazon', 'Atlassian'], 'numIslands', [['grid', 'char[][]']], 'int',
    'grid holds "1" for land and "0" for water. Count the islands: groups of land joined up, down, left or right.',
    [ex('grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', '2')]),
  P('coin-change', 'Coin Change', 'Medium', ['Dynamic Programming'], ['Razorpay', 'Paytm'], 'coinChange', [['coins', 'int[]'], ['amount', 'int']], 'int',
    'Return the fewest coins needed to make amount, using any number of each coin. Return -1 if it cannot be made.',
    [ex('coins = [1, 2, 5], amount = 11', '3', '5 + 5 + 1')]),
  P('merge-intervals', 'Merge Intervals', 'Medium', ['Arrays', 'Sorting'], ['Google', 'Zerodha'], 'merge', [['intervals', 'int[][]']], 'int[][]',
    'Merge every overlapping interval and return the result sorted by start.',
    [ex('intervals = [[1,3],[2,6],[8,10],[15,18]]', '[[1,6],[8,10],[15,18]]')]),
  P('lca-bst', 'Lowest Common Ancestor in a BST', 'Medium', ['Trees', 'BST'], ['Microsoft'], 'lowestCommonAncestor', [['root', 'TreeNode'], ['p', 'int'], ['q', 'int']], 'int',
    'In a binary search tree, return the value of the lowest node that has both p and q as descendants (a node counts as its own descendant).',
    [ex('root = [6,2,8,0,4,7,9], p = 2, q = 8', '6')]),
  P('course-schedule', 'Course Schedule', 'Medium', ['Graphs', 'Topological Sort'], ['Uber', 'Intuit'], 'canFinish', [['numCourses', 'int'], ['prereqs', 'int[][]']], 'bool',
    'prereqs[i] = [a, b] means course b must come before a. Return true if every course can be finished.',
    [ex('numCourses = 2, prereqs = [[1, 0]]', 'true')]),
  P('trapping-rain', 'Trapping Rain Water', 'Hard', ['Two Pointers', 'Arrays'], ['Amazon', 'Goldman Sachs'], 'trap', [['height', 'int[]']], 'int',
    'height[i] is the height of a bar of width 1. Return how much rain water is trapped between the bars.',
    [ex('height = [0,1,0,2,1,0,1,3,2,1,2,1]', '6')]),
  P('median-two-arrays', 'Median of Two Sorted Arrays', 'Hard', ['Binary Search'], ['Google'], 'findMedianSortedArrays', [['a', 'int[]'], ['b', 'int[]']], 'double',
    'Return the median of the two sorted arrays combined. Aim for O(log (m + n)).',
    [ex('a = [1, 3], b = [2]', '2.0')]),
  P('edit-distance', 'Edit Distance', 'Hard', ['Dynamic Programming', 'Strings'], ['Microsoft', 'CRED'], 'minDistance', [['a', 'string'], ['b', 'string']], 'int',
    'Return the fewest insertions, deletions and replacements needed to turn string a into string b.',
    [ex('a = "horse", b = "ros"', '3')]),
  P('merge-k-lists', 'Merge K Sorted Lists', 'Hard', ['Linked List', 'Heaps'], ['Amazon', 'Flipkart'], 'mergeKLists', [['lists', 'ListNode[]']], 'ListNode',
    'Merge k sorted linked lists into one sorted list and return its head.',
    [ex('lists = [1→4→5, 1→3→4, 2→6]', '1→1→2→3→4→4→5→6')])
];

export const FREE_LEVELS = ['Easy', 'Medium', 'Hard'];
export const FREE_TOPICS = [...new Set(FREE_PROBLEMS.flatMap((p) => p.topics))].sort();
export const findFreeProblem = (id) => FREE_PROBLEMS.find((p) => p.id === id) || null;

/* Solved state, separate from module progress */
const SOLVED_KEY = 'cs_free_practice_solved';
export const readFreeSolved = () => { try { return JSON.parse(localStorage.getItem(SOLVED_KEY)) || {}; } catch { return {}; } };
export const markFreeSolved = (id) => {
  const all = readFreeSolved();
  all[id] = new Date().toISOString();
  try { localStorage.setItem(SOLVED_KEY, JSON.stringify(all)); } catch { /* storage blocked */ }
};
