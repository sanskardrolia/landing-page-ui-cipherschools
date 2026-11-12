/* ══════════════════════════════════════════════════════════════
   Practice bank — keyed by module id → unit id (the SAME unit ids
   as the Watch content in learnerModules.js), so practice follows
   the lectures unit by unit, in order.

   Item kinds that open the coding workspace:
     coding     — DSA problem (function signature → starter code per language)
     debugging  — fix a buggy snippet (single language)
     vibe       — build a feature with an AI assistant (single language)
     sql        — write a query (SQL only)
   Every other practice kind (MCQ, labs, design, drills…) is generated
   per unit by practiceForUnit() below.

   Problem statements are original summaries; levels and company tags
   are PLACEHOLDER data to show the layout — replace with the real bank.
   ══════════════════════════════════════════════════════════════ */

const C = (title, level, companies, fn, params, returns, statement, examples, constraints = []) => ({
  kind: 'coding', title, level, companies, fn, params, returns, statement, examples, constraints
});
const ex = (input, output, explanation) => ({ input, output, ...(explanation ? { explanation } : {}) });

const DSA = {
  arrays: [
    C('Two Sum', 'Easy', ['Amazon', 'Google'], 'twoSum', [['nums', 'int[]'], ['target', 'int']], 'int[]',
      'Return the indices of the two numbers in nums that add up to target. Exactly one valid pair exists and you may not use the same element twice.',
      [ex('nums = [2, 7, 11, 15], target = 9', '[0, 1]', 'nums[0] + nums[1] = 2 + 7 = 9')],
      ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i], target ≤ 10⁹']),
    C('Move Zeroes to End', 'Easy', ['Microsoft'], 'moveZeroes', [['nums', 'int[]']], 'int[]',
      'Move every 0 in nums to the end while keeping the relative order of the non-zero elements. Return the updated array.',
      [ex('nums = [0, 1, 0, 3, 12]', '[1, 3, 12, 0, 0]')]),
    C('Balanced Boundary Subarrays', 'Medium', ['Flipkart', 'Adobe'], 'countBalancedSubarrays', [['nums', 'int[]']], 'long',
      'A subarray nums[l..r] of length at least 3 is balanced when nums[l] and nums[r] both equal the sum of the elements strictly between them. Count the balanced subarrays.',
      [ex('nums = [9, 3, 3, 3, 9]', '2', '[9, 3, 3, 3] and [3, 3, 3, 9] are balanced: 9 = 3 + 3 + 3.')],
      ['3 ≤ nums.length ≤ 10⁵', '0 ≤ nums[i] ≤ 10⁹'])
  ],
  strings: [
    C('Valid Anagram', 'Easy', ['Amazon'], 'isAnagram', [['s', 'string'], ['t', 'string']], 'bool',
      'Return true if t is a rearrangement of the letters of s.',
      [ex('s = "listen", t = "silent"', 'true')]),
    C('Longest Common Prefix', 'Easy', ['Google'], 'longestCommonPrefix', [['words', 'string[]']], 'string',
      'Return the longest prefix shared by every word in the list, or an empty string if there is none.',
      [ex('words = ["flower", "flow", "flight"]', '"fl"')]),
    C('Find the Pattern Start', 'Medium', ['Microsoft', 'Uber'], 'findPattern', [['text', 'string'], ['pattern', 'string']], 'int',
      'Return the first index where pattern occurs in text, or -1. Aim for linear time.',
      [ex('text = "sadbutsad", pattern = "sad"', '0')])
  ],
  recursion: [
    C('Power of a Number', 'Easy', ['TCS'], 'power', [['x', 'long'], ['n', 'int']], 'long',
      'Compute x raised to n using recursion in O(log n) multiplications.',
      [ex('x = 2, n = 10', '1024')]),
    C('All Subsets', 'Medium', ['Amazon', 'Meta'], 'subsets', [['nums', 'int[]']], 'int[][]',
      'Return every subset of the distinct integers in nums, in any order.',
      [ex('nums = [1, 2, 3]', '[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]')]),
    C('N-Queens Count', 'Hard', ['Google'], 'totalNQueens', [['n', 'int']], 'int',
      'Count the ways to place n queens on an n×n board so no two attack each other.',
      [ex('n = 4', '2')])
  ],
  'linked-list': [
    C('Reverse a Linked List', 'Easy', ['Amazon', 'Microsoft'], 'reverseList', [['head', 'ListNode']], 'ListNode',
      'Reverse the singly linked list and return the new head.',
      [ex('head = [1, 2, 3, 4, 5]', '[5, 4, 3, 2, 1]')]),
    C('Detect a Cycle', 'Easy', ['Adobe'], 'hasCycle', [['head', 'ListNode']], 'bool',
      'Return true if the linked list contains a cycle, using O(1) extra space.',
      [ex('head = [3, 2, 0, -4], tail connects to index 1', 'true')]),
    C('Merge K Sorted Lists', 'Hard', ['Google', 'Amazon'], 'mergeKLists', [['lists', 'ListNode[]']], 'ListNode',
      'Merge k sorted linked lists into one sorted list and return its head.',
      [ex('lists = [[1,4,5], [1,3,4], [2,6]]', '[1,1,2,3,4,4,5,6]')])
  ],
  'stack-queue': [
    C('Valid Parentheses', 'Easy', ['Amazon', 'Flipkart'], 'isValid', [['s', 'string']], 'bool',
      'Return true if every bracket in s is closed by the same type of bracket in the correct order.',
      [ex('s = "([]{})"', 'true')]),
    C('Next Greater Element', 'Medium', ['Microsoft'], 'nextGreater', [['nums', 'int[]']], 'int[]',
      'For each element, return the next element to its right that is larger, or -1 if none exists.',
      [ex('nums = [4, 5, 2, 25]', '[5, 25, 25, -1]')]),
    C('Largest Rectangle in Histogram', 'Hard', ['Google'], 'largestRectangle', [['heights', 'int[]']], 'int',
      'Given bar heights of width 1, return the area of the largest rectangle in the histogram.',
      [ex('heights = [2, 1, 5, 6, 2, 3]', '10')])
  ],
  trees: [
    C('Maximum Depth of Binary Tree', 'Easy', ['Amazon'], 'maxDepth', [['root', 'TreeNode']], 'int',
      'Return the number of nodes on the longest root-to-leaf path.',
      [ex('root = [3, 9, 20, null, null, 15, 7]', '3')]),
    C('Validate a BST', 'Medium', ['Microsoft', 'Adobe'], 'isValidBST', [['root', 'TreeNode']], 'bool',
      'Return true if the binary tree is a valid binary search tree.',
      [ex('root = [2, 1, 3]', 'true')]),
    C('Lowest Common Ancestor', 'Medium', ['Meta'], 'lowestCommonAncestor', [['root', 'TreeNode'], ['p', 'int'], ['q', 'int']], 'int',
      'Return the value of the lowest node that has both p and q as descendants.',
      [ex('root = [3,5,1,6,2,0,8], p = 5, q = 1', '3')])
  ],
  graphs: [
    C('Number of Islands', 'Medium', ['Amazon', 'Google'], 'numIslands', [['grid', 'char[][]']], 'int',
      "Count the groups of connected '1' cells (up, down, left, right) in the grid.",
      [ex('grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', '2')]),
    C('Flood Fill', 'Easy', ['Microsoft'], 'floodFill', [['image', 'int[][]'], ['sr', 'int'], ['sc', 'int'], ['color', 'int']], 'int[][]',
      'Recolour the connected region containing (sr, sc) to the new colour and return the image.',
      [ex('image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', '[[2,2,2],[2,2,0],[2,0,1]]')]),
    C('Course Schedule', 'Medium', ['Uber', 'Amazon'], 'canFinish', [['n', 'int'], ['prereqs', 'int[][]']], 'bool',
      'Given n courses and prerequisite pairs [a, b] (take b before a), return true if all courses can be finished.',
      [ex('n = 2, prereqs = [[1, 0]]', 'true')])
  ]
};

const DSA_ADV = {
  hashing: [
    C('Longest Consecutive Sequence', 'Medium', ['Google', 'Amazon'], 'longestConsecutive', [['nums', 'int[]']], 'int',
      'Return the length of the longest run of consecutive integers in nums, in O(n) time.',
      [ex('nums = [100, 4, 200, 1, 3, 2]', '4', 'The run is 1, 2, 3, 4.')]),
    C('Group Anagrams', 'Medium', ['Amazon', 'Meta'], 'groupAnagrams', [['words', 'string[]']], 'string[][]',
      'Group the words that are anagrams of each other.',
      [ex('words = ["eat","tea","tan","ate","nat","bat"]', '[["eat","tea","ate"],["tan","nat"],["bat"]]')]),
    C('Subarray Sum Equals K', 'Medium', ['Microsoft', 'Flipkart'], 'subarraySum', [['nums', 'int[]'], ['k', 'int']], 'int',
      'Count the contiguous subarrays whose sum equals k.',
      [ex('nums = [1, 1, 1], k = 2', '2')])
  ],
  heaps: [
    C('Kth Largest Element', 'Medium', ['Amazon', 'Meta'], 'findKthLargest', [['nums', 'int[]'], ['k', 'int']], 'int',
      'Return the kth largest element in the array.',
      [ex('nums = [3, 2, 1, 5, 6, 4], k = 2', '5')]),
    C('Top K Frequent Elements', 'Medium', ['Google'], 'topKFrequent', [['nums', 'int[]'], ['k', 'int']], 'int[]',
      'Return the k most frequent elements, in any order.',
      [ex('nums = [1, 1, 1, 2, 2, 3], k = 2', '[1, 2]')]),
    C('Find Median from Data Stream', 'Hard', ['Microsoft', 'Uber'], 'runningMedian', [['stream', 'int[]']], 'double[]',
      'Return the median after each number of the stream is added.',
      [ex('stream = [5, 15, 1, 3]', '[5.0, 10.0, 5.0, 4.0]')])
  ],
  'advanced-graphs': [
    C("Network Delay Time", 'Medium', ['Amazon'], 'networkDelayTime', [['times', 'int[][]'], ['n', 'int'], ['k', 'int']], 'int',
      'Signals travel along weighted directed edges from node k. Return the time for all n nodes to receive it, or -1.',
      [ex('times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', '2')]),
    C('Course Order', 'Medium', ['Google'], 'findOrder', [['n', 'int'], ['prereqs', 'int[][]']], 'int[]',
      'Return any valid order to finish all courses, or an empty array if impossible.',
      [ex('n = 2, prereqs = [[1, 0]]', '[0, 1]')]),
    C('Redundant Connection', 'Medium', ['Microsoft'], 'findRedundantConnection', [['edges', 'int[][]']], 'int[]',
      'A tree had one extra edge added. Return the edge that can be removed to make it a tree again.',
      [ex('edges = [[1,2],[1,3],[2,3]]', '[2, 3]')])
  ],
  'dynamic-programming': [
    C('Climbing Stairs', 'Easy', ['Amazon'], 'climbStairs', [['n', 'int']], 'int',
      'You can climb 1 or 2 steps at a time. Return the number of distinct ways to reach the top of n steps.',
      [ex('n = 3', '3')]),
    C('Longest Common Subsequence', 'Medium', ['Google', 'Microsoft'], 'longestCommonSubsequence', [['a', 'string'], ['b', 'string']], 'int',
      'Return the length of the longest subsequence common to both strings.',
      [ex('a = "abcde", b = "ace"', '3')]),
    C('Edit Distance', 'Hard', ['Amazon', 'Google'], 'minDistance', [['a', 'string'], ['b', 'string']], 'int',
      'Return the minimum insert, delete or replace operations to turn a into b.',
      [ex('a = "horse", b = "ros"', '3')])
  ],
  greedy: [
    C('Jump Game', 'Medium', ['Amazon'], 'canJump', [['nums', 'int[]']], 'bool',
      'Each element is your maximum jump length from that index. Return true if you can reach the last index.',
      [ex('nums = [2, 3, 1, 1, 4]', 'true')]),
    C('Non-overlapping Intervals', 'Medium', ['Meta'], 'eraseOverlapIntervals', [['intervals', 'int[][]']], 'int',
      'Return the minimum number of intervals to remove so the rest do not overlap.',
      [ex('intervals = [[1,2],[2,3],[3,4],[1,3]]', '1')]),
    C('Gas Station', 'Medium', ['Flipkart'], 'canCompleteCircuit', [['gas', 'int[]'], ['cost', 'int[]']], 'int',
      'Return the starting station index that lets you travel the circuit once, or -1.',
      [ex('gas = [1,2,3,4,5], cost = [3,4,5,1,2]', '3')])
  ]
};


/* ── Ultra: DSA Mastery (Hard problem sets, one unit per DSA Advanced topic) ── */
const DSA_MASTERY = {
  'hashing-mastery': [
    C('Count Distinct in Every Window', 'Hard', ['Goldman Sachs'], 'distinctInWindows', [['nums', 'int[]'], ['k', 'int']], 'int[]',
      'For every window of size k, return the number of distinct elements in it.',
      [ex('nums = [1, 2, 1, 3, 4, 2, 3], k = 4', '[3, 4, 4, 3]')]),
    C('Longest Substring With At Most K Distinct', 'Hard', ['Amazon'], 'longestKDistinct', [['s', 'string'], ['k', 'int']], 'int',
      'Return the length of the longest substring that contains at most k distinct characters.',
      [ex('s = "eceba", k = 2', '3')])
  ],
  'heaps-mastery': [
    C('Merge Intervals by Priority', 'Hard', ['Atlassian'], 'minMeetingRooms', [['intervals', 'int[][]']], 'int',
      'Return the minimum number of rooms needed to hold all the meetings.',
      [ex('intervals = [[0, 30], [5, 10], [15, 20]]', '2')]),
    C('Smallest Range Covering K Lists', 'Hard', ['Google'], 'smallestRange', [['lists', 'int[][]']], 'int[]',
      'Each list is sorted. Return the smallest range [a, b] that includes at least one number from every list.',
      [ex('lists = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]', '[20, 24]')])
  ],
  'graph-mastery': [
    C('Cheapest Flights Within K Stops', 'Hard', ['Uber', 'Airbnb'], 'findCheapestPrice', [['n', 'int'], ['flights', 'int[][]'], ['src', 'int'], ['dst', 'int'], ['k', 'int']], 'int',
      'Return the cheapest price from src to dst with at most k stops, or -1.',
      [ex('n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1', '200')]),
    C('Critical Connections in a Network', 'Hard', ['Amazon', 'Microsoft'], 'criticalConnections', [['n', 'int'], ['connections', 'int[][]']], 'int[][]',
      'Return every connection whose removal disconnects the network.',
      [ex('n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]', '[[1, 3]]')])
  ],
  'dp-mastery': [
    C('Burst Balloons', 'Hard', ['Google'], 'maxCoins', [['nums', 'int[]']], 'int',
      'Bursting balloon i earns nums[i-1] × nums[i] × nums[i+1]. Return the maximum coins obtainable.',
      [ex('nums = [3, 1, 5, 8]', '167')]),
    C('Minimum Cost to Cut a Stick', 'Hard', ['Google'], 'minCost', [['n', 'int'], ['cuts', 'int[]']], 'int',
      'Cutting a stick costs its current length. Return the minimum total cost to make all the cuts.',
      [ex('n = 7, cuts = [1, 3, 4, 5]', '16')])
  ],
  'greedy-mastery': [
    C('Minimum Platforms', 'Hard', ['Goldman Sachs'], 'minPlatforms', [['arrivals', 'int[]'], ['departures', 'int[]']], 'int',
      'Return the minimum number of railway platforms needed so no train waits.',
      [ex('arrivals = [900, 940, 950], departures = [910, 1200, 1120]', '2')]),
    C('IPO — Maximise Capital', 'Hard', ['Uber'], 'findMaximizedCapital', [['k', 'int'], ['w', 'int'], ['profits', 'int[]'], ['capital', 'int[]']], 'int',
      'Pick at most k projects you can afford with your current capital to maximise final capital.',
      [ex('k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]', '4')])
  ]
};

/* ── Development: debugging + vibe coding per unit ── */
const D = (title, level, language, statement, starter, hint) => ({ kind: 'debugging', title, level, language, statement, starter, hint });
const V = (title, level, language, statement, starter) => ({ kind: 'vibe', title, level, language, statement, starter });

const MERN = {
  'web-foundations': [
    D('Fix the Broken Flex Layout', 'Easy', 'javascript',
      'The card list should wrap into rows on small screens, but cards overflow the page. Find and fix the bug in the style object.',
      "const listStyle = {\n  display: 'flex',\n  flexWrap: 'nowrap', // ← cards never wrap\n  gap: 16,\n};\n\nexport default listStyle;\n",
      'Look at how flex items behave when they run out of room.'),
    V('Build a Dark Mode Toggle', 'Easy', 'javascript',
      'Use the AI assistant to build a toggle that switches the page between light and dark themes and remembers the choice.',
      '// Describe what you want to the assistant, then refine the code it writes.\n')
  ],
  react: [
    D('Stale State in a Counter', 'Medium', 'javascript',
      'Clicking "+3" only adds 1. Fix the handler so it adds 3.',
      "function Counter() {\n  const [count, setCount] = useState(0);\n  const addThree = () => {\n    setCount(count + 1);\n    setCount(count + 1);\n    setCount(count + 1);\n  };\n  return <button onClick={addThree}>{count}</button>;\n}\n",
      'The three updates all read the same value of count.'),
    V('Searchable Product List', 'Medium', 'javascript',
      'Build a product list with a search box that filters as you type, with the assistant as your pair programmer.',
      '// Start by asking the assistant for a component skeleton.\n')
  ],
  'node-express': [
    D('Route Never Responds', 'Medium', 'javascript',
      'GET /health hangs forever. Fix the middleware so requests reach the route.',
      "app.use((req, res, next) => {\n  console.log(req.method, req.url);\n  // forgot something here\n});\n\napp.get('/health', (req, res) => res.json({ ok: true }));\n",
      'Middleware must hand control to the next handler.'),
    V('JWT Login Endpoint', 'Hard', 'javascript',
      'Build POST /login that checks a password hash and returns a signed JWT, using the assistant.',
      '// Ask the assistant for a plan first: routes, hashing, token signing.\n')
  ],
  mongodb: [
    D('Query Returns Nothing', 'Easy', 'javascript',
      'The query should find users older than 18 but always returns an empty list. Fix it.',
      "const adults = await User.find({ age: { $gt: '18' } });\n",
      'Compare the stored type of age with the value in the query.'),
    V('Paginated Notes API', 'Medium', 'javascript',
      'Add page and limit query params to GET /notes, with the assistant.',
      '// Describe the endpoint and the pagination rules to the assistant.\n')
  ],
  shipping: [
    D('Env Variable Undefined in Production', 'Medium', 'javascript',
      'The API URL works locally but is undefined after deploy. Fix how it is read.',
      "const API_URL = process.env.API_URL;\n// Vite only exposes variables with a specific prefix to the browser\nfetch(`${API_URL}/notes`);\n",
      'Check which env variables your bundler exposes to client code.'),
    V('Add a Health Check & Dockerfile', 'Medium', 'javascript',
      'Containerise the MERN app with a health check, using the assistant.',
      '// Ask the assistant for a minimal Dockerfile and a /health route.\n')
  ]
};

const JFS = {
  'core-java': [
    D('ConcurrentModificationException', 'Easy', 'java',
      'Removing even numbers from the list crashes. Fix the loop.',
      "for (Integer n : numbers) {\n    if (n % 2 == 0) {\n        numbers.remove(n);\n    }\n}\n",
      'You cannot change a list while a for-each loop is iterating it.'),
    V('Word Frequency Counter', 'Easy', 'java',
      'Build a method that returns the 5 most frequent words in a text, with the assistant.',
      '// Ask the assistant to use streams and a Map<String, Long>.\n')
  ],
  'spring-boot': [
    D('Bean Not Found at Startup', 'Medium', 'java',
      'The app fails with "No qualifying bean of type NoteService". Fix it.',
      "public class NoteService {\n    public List<Note> all() { return repo.findAll(); }\n}\n",
      'Spring only manages classes it knows about.'),
    V('CRUD API for Notes', 'Medium', 'java',
      'Build a REST controller with create, read, update and delete for notes, with the assistant.',
      '// Start with the entity and repository, then the controller.\n')
  ],
  frontend: [
    D('CORS Error Calling Spring API', 'Medium', 'java',
      'The React app gets a CORS error calling localhost:8080. Fix it on the Spring side.',
      "@RestController\n@RequestMapping(\"/api/notes\")\npublic class NoteController {\n    // ...\n}\n",
      'The API must allow the React dev server origin.'),
    V('Notes Dashboard UI', 'Medium', 'javascript',
      'Build a React page that lists, adds and deletes notes from the Spring API, with the assistant.',
      '// Ask the assistant for a component plan first.\n')
  ],
  shipping: [
    D('Test Fails Only in CI', 'Hard', 'java',
      'A date-based test passes locally but fails in CI. Make it deterministic.',
      "@Test\nvoid isWeekend() {\n    assertTrue(service.isWeekend(LocalDate.now()));\n}\n",
      'The result depends on the day the test runs.'),
    V('Dockerise the Spring App', 'Medium', 'java',
      'Write a multi-stage Dockerfile for the Spring Boot app, with the assistant.',
      '// Ask for a build stage and a slim runtime stage.\n')
  ]
};

/* ── DBMS: SQL practice in the SQL unit ── */
const S = (title, level, companies, statement, schema, examples) => ({ kind: 'sql', title, level, companies, language: 'sql', statement, schema, examples, starter: '-- Write your query below\nSELECT\n' });
const DBMS_SQL = {
  sql: [
    S('Second Highest Salary', 'Medium', ['Amazon'], 'Return the second highest distinct salary, or NULL if there is none.',
      'Employee(id INT, name VARCHAR, salary INT)', [ex('Employee: (1, Asha, 100), (2, Ravi, 200), (3, Neha, 300)', '200')]),
    S('Customers Who Never Ordered', 'Easy', ['Flipkart'], 'List the names of customers who have never placed an order.',
      'Customers(id INT, name VARCHAR) · Orders(id INT, customer_id INT)', [ex('Customers: Joe, Henry, Sam · Orders by Joe', 'Henry, Sam')]),
    S('Department Top Earners', 'Hard', ['Microsoft'], 'Return employees who earn one of the top three distinct salaries in their department.',
      'Employee(id, name, salary, department_id) · Department(id, name)', [ex('IT: 90k, 85k, 85k, 70k, 69k', 'The 90k, 85k, 85k and 70k earners')])
  ],
  normalization: [
    S('Find Duplicate Emails', 'Easy', ['TCS'], 'Return every email that appears more than once.',
      'Person(id INT, email VARCHAR)', [ex('a@x.com, b@x.com, a@x.com', 'a@x.com')])
  ],
  transactions: [
    S('Running Account Balance', 'Medium', ['Goldman Sachs'], 'Return each transaction with the running balance per account, ordered by time.',
      'Txn(id, account_id, amount, created_at)', [ex('+100, -30, +50 on one account', '100, 70, 120')])
  ]
};

const BANK = { dsa: DSA, 'dsa-advanced': DSA_ADV, 'dsa-mastery': DSA_MASTERY, mern: MERN, jfs: JFS, dbms: DBMS_SQL };

/* Generated sets for non-coding practice kinds */
const SET_META = {
  mcq: { noun: 'MCQs', label: 'MCQ Set' },
  lab: { noun: 'labs', label: 'Sandbox Lab' },
  sd: { noun: 'scenario', label: 'Design Scenario' },
  project: { noun: 'project', label: 'Mini Project' },
  speaking: { noun: 'drills', label: 'Speaking Drill' },
  company: { noun: 'problems', label: 'Company Set' }
};
const LEVELS = ['Easy', 'Medium', 'Hard'];

/* Everything practisable in one unit, in display order. `isExt` = Ultra on a Plus-tier module. */
export const practiceForUnit = (mod, unit, isExt) => {
  const bank = BANK[mod.id]?.[unit.id] || [];
  const items = bank
    .filter((p) => !p.extended || isExt)
    .map((p, i) => ({ ...p, id: `${mod.id}--${unit.id}--${i}` }));

  // Practice kinds without a hand-written bank get generated sets (MCQ, labs, drills…)
  mod.practice
    .filter((p) => SET_META[p.kind] && !(p.kind === 'company' && BANK[mod.id]))
    .forEach((p) => {
      const meta = SET_META[p.kind];
      const perSet = p.kind === 'mcq' ? 10 : 1;
      const total = isExt && p.extendedPerUnit ? p.extendedPerUnit : p.perUnit;
      const sets = Math.max(1, Math.min(3, Math.round(total / perSet)));
      for (let s = 0; s < sets; s++) {
        items.push({
          id: `${mod.id}--${unit.id}--${p.kind}-${s}`,
          kind: p.kind,
          title: `${unit.title} · ${meta.label} ${s + 1}`,
          level: LEVELS[Math.min(s, 2)],
          count: p.kind === 'mcq' ? perSet : 1,
          noun: meta.noun
        });
      }
    });

  return items;
};

export const WORKSPACE_KINDS = ['coding', 'debugging', 'vibe', 'sql'];

/* Look up one workspace item by id (ids are `${moduleId}--${unitId}--${index}`) */
export const findPracticeItem = (mod, itemId, isExt) => {
  for (const subj of mod.subjects) {
    for (const unit of subj.units) {
      const item = practiceForUnit(mod, unit, isExt).find((p) => p.id === itemId);
      if (item) return { item, unit, subject: subj };
    }
  }
  return null;
};

/* ── Starter code per language for coding problems ── */
const TYPES = {
  int: { cpp: 'int', java: 'int', python: 'int', javascript: 'number' },
  long: { cpp: 'long long', java: 'long', python: 'int', javascript: 'number' },
  double: { cpp: 'double', java: 'double', python: 'float', javascript: 'number' },
  bool: { cpp: 'bool', java: 'boolean', python: 'bool', javascript: 'boolean' },
  string: { cpp: 'string', java: 'String', python: 'str', javascript: 'string' },
  'int[]': { cpp: 'vector<int>', java: 'int[]', python: 'List[int]', javascript: 'number[]' },
  'double[]': { cpp: 'vector<double>', java: 'double[]', python: 'List[float]', javascript: 'number[]' },
  'int[][]': { cpp: 'vector<vector<int>>', java: 'int[][]', python: 'List[List[int]]', javascript: 'number[][]' },
  'char[][]': { cpp: 'vector<vector<char>>', java: 'char[][]', python: 'List[List[str]]', javascript: 'string[][]' },
  'string[]': { cpp: 'vector<string>', java: 'String[]', python: 'List[str]', javascript: 'string[]' },
  'string[][]': { cpp: 'vector<vector<string>>', java: 'List<List<String>>', python: 'List[List[str]]', javascript: 'string[][]' },
  ListNode: { cpp: 'ListNode*', java: 'ListNode', python: 'Optional[ListNode]', javascript: 'ListNode' },
  'ListNode[]': { cpp: 'vector<ListNode*>', java: 'ListNode[]', python: 'List[Optional[ListNode]]', javascript: 'ListNode[]' },
  TreeNode: { cpp: 'TreeNode*', java: 'TreeNode', python: 'Optional[TreeNode]', javascript: 'TreeNode' }
};
const DEFAULT_RETURN = {
  cpp: (t) => (t.includes('vector') ? '{}' : t === 'bool' ? 'false' : t === 'string' ? '""' : t.endsWith('*') ? 'nullptr' : '0'),
  java: (t) => (t.endsWith(']') ? `new ${t.replace(/\[\]/, '[0]')}` : t === 'boolean' ? 'false' : t === 'String' ? '""' : /^[A-Z]/.test(t) ? 'null' : '0'),
  python: () => 'None',
  javascript: () => 'null'
};
const byRef = (t) => (t.startsWith('vector') || t === 'string' ? `${t}&` : t);

export const LANGUAGES = [
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' }
];

export const starterCode = (item, lang) => {
  if (item.kind !== 'coding') return item.starter || '';
  const ty = (t) => (TYPES[t] || TYPES.int)[lang];
  const ret = ty(item.returns);
  if (lang === 'cpp') {
    const args = item.params.map(([n, t]) => `${byRef(ty(t))} ${n}`).join(', ');
    return `${ret} ${item.fn}(${args}) {\n    // add your code here\n    return ${DEFAULT_RETURN.cpp(ret)};\n}\n`;
  }
  if (lang === 'java') {
    const args = item.params.map(([n, t]) => `${ty(t)} ${n}`).join(', ');
    return `class Solution {\n    public ${ret} ${item.fn}(${args}) {\n        // add your code here\n        return ${DEFAULT_RETURN.java(ret)};\n    }\n}\n`;
  }
  if (lang === 'python') {
    const args = item.params.map(([n, t]) => `${n}: ${ty(t)}`).join(', ');
    return `class Solution:\n    def ${item.fn}(self, ${args}) -> ${ret}:\n        # add your code here\n        return None\n`;
  }
  const args = item.params.map(([n]) => n).join(', ');
  const doc = item.params.map(([n, t]) => ` * @param {${ty(t)}} ${n}`).join('\n');
  return `/**\n${doc}\n * @return {${ret}}\n */\nfunction ${item.fn}(${args}) {\n    // add your code here\n    return null;\n}\n`;
};

/* ── Problem of the Day (DSA modules only) ──
   Deterministic per calendar day + module, so every learner sees the
   same problem today and it rotates at local midnight. Drawn from the
   problems the learner can open (Ultra-only problems only for Ultra). */
export const POTD_MODULES = ['dsa', 'dsa-advanced'];

const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

export const problemOfTheDay = (mod, isExt) => {
  if (!POTD_MODULES.includes(mod.id)) return null;
  const pool = mod.subjects.flatMap((s) => s.units.flatMap((u) =>
    practiceForUnit(mod, u, isExt).filter((i) => i.kind === 'coding').map((item) => ({ item, unit: u }))
  ));
  if (!pool.length) return null;
  return pool[hash(`${dayKey()}:${mod.id}`) % pool.length];
};
