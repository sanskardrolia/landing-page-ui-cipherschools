/* ══════════════════════════════════════════════════════════════
   Free practice (DSA · Programming · SQL) — /dashboard/practice
   A standalone, free question bank (open on every plan and in the
   preview). It is NOT the per-unit practice inside Content: solved
   state lives in its own storage key and never counts toward module
   progress, activity or certificates.
   Problem statements are original summaries; difficulty, company and
   topic tags are PLACEHOLDER data to show the layout — replace with
   the real bank.
   ══════════════════════════════════════════════════════════════ */

const P = (slug, title, level, topics, companies, fn, params, returns, statement, examples, constraints = [], track = 'DSA') => ({
  id: `fp-${slug}`, kind: 'coding', track, title, level, topics, companies, fn, params, returns, statement, examples, constraints
});
/* Programming basics: same coding workspace, track 'Programming' */
const G = (slug, title, level, topics, companies, fn, params, returns, statement, examples) =>
  P(slug, title, level, topics, companies, fn, params, returns, statement, examples, [], 'Programming');
/* SQL: opens the SQL workspace (schema + query editor) */
const Q = (slug, title, level, topics, companies, statement, schema, examples) => ({
  id: `fp-${slug}`, kind: 'sql', track: 'SQL', language: 'sql', title, level, topics, companies, statement, schema, examples,
  starter: '-- Write your query below\nSELECT\n'
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
    [ex('lists = [1→4→5, 1→3→4, 2→6]', '1→1→2→3→4→4→5→6')]),

  /* ── Programming ── */
  G('fizzbuzz', 'FizzBuzz', 'Easy', ['Loops', 'Conditionals'], ['TCS', 'Wipro'], 'fizzBuzz', [['n', 'int']], 'string[]',
    'Return the numbers 1 to n as strings, but "Fizz" for multiples of 3, "Buzz" for multiples of 5 and "FizzBuzz" for both.',
    [ex('n = 5', '["1", "2", "Fizz", "4", "Buzz"]')]),
  G('palindrome-number', 'Palindrome Number', 'Easy', ['Math'], ['Infosys'], 'isPalindrome', [['x', 'int']], 'bool',
    'Return true if x reads the same forwards and backwards, without converting it to a string.',
    [ex('x = 121', 'true'), ex('x = -121', 'false')]),
  G('count-vowels', 'Count the Vowels', 'Easy', ['Strings', 'Loops'], ['Cognizant'], 'countVowels', [['s', 'string']], 'int',
    'Return how many vowels (a, e, i, o, u, either case) are in s.',
    [ex('s = "CipherSchools"', '3')]),
  G('fibonacci', 'Nth Fibonacci Number', 'Easy', ['Recursion', 'Math'], ['Accenture'], 'fib', [['n', 'int']], 'int',
    'Return the nth Fibonacci number, where fib(0) = 0 and fib(1) = 1.',
    [ex('n = 7', '13')]),
  G('armstrong', 'Armstrong Number', 'Easy', ['Math', 'Loops'], ['Capgemini'], 'isArmstrong', [['n', 'int']], 'bool',
    'Return true if n equals the sum of its digits each raised to the number of digits.',
    [ex('n = 153', 'true', '1³ + 5³ + 3³ = 153')]),
  G('second-largest', 'Second Largest in an Array', 'Easy', ['Arrays'], ['HCL'], 'secondLargest', [['nums', 'int[]']], 'int',
    'Return the second largest distinct value in nums, or -1 if there is none. One pass, no sorting.',
    [ex('nums = [12, 35, 1, 10, 34, 1]', '34')]),
  G('word-frequency', 'Most Frequent Word', 'Medium', ['Strings', 'Hashing'], ['Zoho'], 'mostFrequent', [['text', 'string']], 'string',
    'Return the word that appears most often in text, ignoring case and punctuation. On a tie, return the one that appears first.',
    [ex('text = "Code, test. Code again!"', '"code"')]),
  G('matrix-spiral', 'Print a Matrix in Spiral', 'Medium', ['Arrays', 'Simulation'], ['Paytm'], 'spiralOrder', [['matrix', 'int[][]']], 'int[]',
    'Return all elements of the matrix in spiral order, starting top-left and going clockwise.',
    [ex('matrix = [[1,2,3],[4,5,6],[7,8,9]]', '[1,2,3,6,9,8,7,4,5]')]),
  G('calculator', 'Evaluate an Expression', 'Hard', ['Strings', 'Parsing'], ['Atlassian'], 'calculate', [['expr', 'string']], 'int',
    'Evaluate a string with integers, + - * / and parentheses, following normal precedence. Do not use eval. Division truncates toward zero.',
    [ex('expr = "2 * (3 + 4) - 5 / 2"', '12')]),

  /* ── SQL ── */
  Q('sql-duplicate-emails', 'Find Duplicate Emails', 'Easy', ['GROUP BY', 'HAVING'], ['TCS'],
    'Return every email that appears more than once.', 'Person(id INT, email VARCHAR)', [ex('a@x.com, b@x.com, a@x.com', 'a@x.com')]),
  Q('sql-never-ordered', 'Customers Who Never Ordered', 'Easy', ['Joins'], ['Flipkart'],
    'List the names of customers who have never placed an order.', 'Customers(id INT, name VARCHAR) · Orders(id INT, customer_id INT)', [ex('Customers: Joe, Henry, Sam · Orders by Joe', 'Henry, Sam')]),
  Q('sql-earn-more', 'Employees Earning More Than Managers', 'Easy', ['Self Join'], ['Amazon'],
    'Return employees who earn more than their manager.', 'Employee(id INT, name VARCHAR, salary INT, manager_id INT)', [ex('Joe 70k (manager Sam 60k)', 'Joe')]),
  Q('sql-orders-per-customer', 'Orders per Customer', 'Easy', ['GROUP BY', 'ORDER BY'], ['Swiggy'],
    'Return each customer id with their number of orders, most orders first.', 'Orders(id INT, customer_id INT, amount INT)', [ex('Orders by 1, 1, 2', '1 → 2, 2 → 1')]),
  Q('sql-second-salary', 'Second Highest Salary', 'Medium', ['Subqueries'], ['Amazon', 'Google'],
    'Return the second highest distinct salary, or NULL if there is none.', 'Employee(id INT, name VARCHAR, salary INT)', [ex('100, 200, 300', '200')]),
  Q('sql-running-total', 'Running Total of Sales', 'Medium', ['Window Functions'], ['Razorpay'],
    'For each day, return the sales amount and the running total up to that day.', 'Sales(day DATE, amount INT)', [ex('10, 20, 5', '10, 30, 35')]),
  Q('sql-top-three', 'Top Three Earners per Department', 'Hard', ['Window Functions', 'Joins'], ['Microsoft'],
    'Return employees who earn one of the top three distinct salaries in their department.', 'Employee(id, name, salary, department_id) · Department(id, name)', [ex('IT: 90k, 85k, 85k, 70k, 69k', 'The 90k, 85k, 85k and 70k earners')])
];

export const FREE_TRACKS = [
  { id: 'DSA', label: 'DSA', lede: 'DSA questions asked in real interviews.' },
  { id: 'Programming', label: 'Programming', lede: 'Programming basics to build logic and fluency in any language.' },
  { id: 'SQL', label: 'SQL', lede: 'SQL queries asked in data and backend interviews.' }
];

export const FREE_LEVELS = ['Easy', 'Medium', 'Hard'];
export const FREE_TOPICS = [...new Set(FREE_PROBLEMS.flatMap((p) => p.topics))].sort();
export const topicsFor = (track) => [...new Set(FREE_PROBLEMS.filter((p) => p.track === track).flatMap((p) => p.topics))].sort();
export const findFreeProblem = (id) => FREE_PROBLEMS.find((p) => p.id === id) || null;

/* Solved state, separate from module progress */
const SOLVED_KEY = 'cs_free_practice_solved';
export const readFreeSolved = () => { try { return JSON.parse(localStorage.getItem(SOLVED_KEY)) || {}; } catch { return {}; } };
export const markFreeSolved = (id) => {
  const all = readFreeSolved();
  all[id] = new Date().toISOString();
  try { localStorage.setItem(SOLVED_KEY, JSON.stringify(all)); } catch { /* storage blocked */ }
};
