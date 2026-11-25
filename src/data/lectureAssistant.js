/* ══════════════════════════════════════════════════════════════
   Lecture assistant — what the in-player A.I. chat can show.
   DEMO: there is no model behind it yet. Each topic below is matched
   against the lecture's title and unit, and a request is answered
   with one of three "generative UI" blocks:
     article  — a plain-English breakdown
     quiz     — multiple-choice questions with instant feedback
     code     — a runnable JavaScript snippet (Run executes it locally)
   Replace with real model output (same block shapes) when wired up.
   ══════════════════════════════════════════════════════════════ */

const TOPICS = [
  {
    match: ['two pointer'],
    article: {
      title: 'Two pointers, in simple English',
      intro: 'Instead of checking every pair with two loops, you keep two markers in the array and move them toward the answer. One pass, no extra memory.',
      sections: [
        { h: 'The idea', body: 'Put one pointer at the start and one at the end (or both at the start). Look at the values they point to and decide which pointer to move.' },
        { h: 'Why it works', body: 'On a sorted array, moving the left pointer makes the sum bigger and moving the right pointer makes it smaller, so every step rules out a whole group of pairs.' },
        { h: 'When to use it', body: 'Pair sums on sorted data, reversing in place, removing duplicates, and checking palindromes.' }
      ],
      takeaway: 'Two nested loops are O(n²). Two pointers turn many of those problems into O(n).'
    },
    quiz: [
      { q: 'What is the time complexity of the two-pointer pair-sum on a sorted array?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'], answer: 2, why: 'Each pointer moves at most n times in total, so it is one linear pass.' },
      { q: 'The sum of the two pointed values is too small. What do you do?', options: ['Move the right pointer left', 'Move the left pointer right', 'Move both pointers', 'Restart from the middle'], answer: 1, why: 'Moving left forward picks a bigger value (the array is sorted), which raises the sum.' },
      { q: 'Which problem is NOT a natural two-pointer fit?', options: ['Check a palindrome', 'Reverse an array in place', 'Find the shortest path in a graph', 'Pair with a target sum'], answer: 2, why: 'Shortest path needs BFS or Dijkstra; it is not a linear scan over a sequence.' }
    ],
    code: {
      title: 'Pair with target sum (sorted array)',
      code: `function pairSum(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   // need a bigger sum
    else right--;               // need a smaller sum
  }
  return [-1, -1];
}

console.log(pairSum([1, 3, 4, 6, 9, 11], 13)); // [2, 4]
console.log(pairSum([2, 5, 8], 4));            // [-1, -1]`
    }
  },
  {
    match: ['prefix'],
    article: {
      title: 'Prefix sums, in simple English',
      intro: 'A prefix sum is a running total. Build it once, and you can answer "what is the sum from i to j?" instantly, as many times as you like.',
      sections: [
        { h: 'Build it', body: 'prefix[i] holds the sum of the first i numbers. Each entry is the previous one plus the next number.' },
        { h: 'Use it', body: 'The sum from index i to j is prefix[j + 1] − prefix[i]. Two lookups, one subtraction.' },
        { h: 'Where it shows up', body: 'Range-sum queries, counting subarrays with a given sum, and 2D grid sums.' }
      ],
      takeaway: 'Spend O(n) once to make every range-sum query O(1).'
    },
    quiz: [
      { q: 'For nums = [2, 4, 6], what is prefix (with a leading 0)?', options: ['[2, 4, 6]', '[0, 2, 6, 12]', '[0, 2, 4, 6]', '[2, 6, 12, 0]'], answer: 1, why: 'Start at 0, then add each number: 0, 2, 6, 12.' },
      { q: 'How do you get the sum of nums[i..j]?', options: ['prefix[j] + prefix[i]', 'prefix[j + 1] − prefix[i]', 'prefix[i] − prefix[j]', 'prefix[j] × prefix[i]'], answer: 1, why: 'Everything up to j, minus everything before i.' },
      { q: 'What does each range query cost after building the prefix array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 0, why: 'It is two array reads and a subtraction.' }
    ],
    code: {
      title: 'Range sum with a prefix array',
      code: `function buildPrefix(nums) {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);
  return prefix;
}

const nums = [3, 1, 4, 1, 5, 9];
const prefix = buildPrefix(nums);
const rangeSum = (i, j) => prefix[j + 1] - prefix[i];

console.log('prefix:', prefix);
console.log('sum of nums[1..3] =', rangeSum(1, 3)); // 1 + 4 + 1 = 6
console.log('sum of nums[2..5] =', rangeSum(2, 5)); // 4 + 1 + 5 + 9 = 19`
    }
  },
  {
    match: ['recursion', 'recursive', 'backtrack'],
    article: {
      title: 'Recursion, in simple English',
      intro: 'A recursive function solves a problem by calling itself on a smaller version of the same problem, until the problem is so small the answer is obvious.',
      sections: [
        { h: 'Base case', body: 'The smallest input you can answer directly, like factorial(0) = 1. Without it the calls never stop.' },
        { h: 'Recursive step', body: 'Shrink the problem and trust the call: factorial(n) = n × factorial(n − 1).' },
        { h: 'The call stack', body: 'Each call waits on the stack until the smaller one returns. Too deep, and you get a stack overflow.' }
      ],
      takeaway: 'Always write the base case first, then make sure every call moves toward it.'
    },
    quiz: [
      { q: 'What happens if a recursive function has no base case?', options: ['It returns 0', 'It runs until the stack overflows', 'The compiler adds one', 'It becomes a loop'], answer: 1, why: 'Every call makes another call, so the stack keeps growing until it runs out.' },
      { q: 'What does factorial(4) return?', options: ['10', '16', '24', '4'], answer: 2, why: '4 × 3 × 2 × 1 = 24.' },
      { q: 'Naive recursive Fibonacci is slow mainly because…', options: ['It uses a stack', 'It recomputes the same values many times', 'Numbers get too big', 'It has no base case'], answer: 1, why: 'fib(n − 2) is computed again inside fib(n − 1). Memoisation fixes that.' }
    ],
    code: {
      title: 'Factorial and memoised Fibonacci',
      code: `function factorial(n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // smaller problem
}

const memo = {};
function fib(n) {
  if (n < 2) return n;
  if (memo[n]) return memo[n];
  return (memo[n] = fib(n - 1) + fib(n - 2));
}

console.log('5! =', factorial(5));
console.log('fib(40) =', fib(40));`
    }
  },
  {
    match: ['linked list', 'linked-list', 'node'],
    article: {
      title: 'Linked lists, in simple English',
      intro: 'A linked list is a chain of boxes. Each box holds a value and an arrow to the next box. There is no index; you walk the chain from the head.',
      sections: [
        { h: 'Why use one', body: 'Adding or removing at the front is O(1): just move an arrow. No shifting like in an array.' },
        { h: 'The cost', body: 'Finding the 5th item means walking 5 steps, so access is O(n).' },
        { h: 'Common patterns', body: 'A dummy head node, fast and slow pointers (find the middle, detect a cycle), and reversing arrows in place.' }
      ],
      takeaway: 'Draw the boxes and arrows before you code. Most bugs are a lost "next" pointer.'
    },
    quiz: [
      { q: 'What is the cost of reading the k-th element of a linked list?', options: ['O(1)', 'O(k)', 'O(log k)', 'O(k²)'], answer: 1, why: 'You must follow k arrows from the head.' },
      { q: 'Fast and slow pointers meet inside the list. What does that tell you?', options: ['The list is sorted', 'The list has a cycle', 'The list is empty', 'The list has even length'], answer: 1, why: 'In a list without a cycle, the fast pointer would reach the end first.' },
      { q: 'Reversing a list in place needs how much extra space?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2, why: 'Three pointers (prev, curr, next) are enough.' }
    ],
    code: {
      title: 'Reverse a linked list',
      code: `const list = (...vals) => vals.reduceRight((next, val) => ({ val, next }), null);
const show = (head) => { const out = []; for (let n = head; n; n = n.next) out.push(n.val); return out.join(' → '); };

function reverse(head) {
  let prev = null;
  while (head) {
    const next = head.next;
    head.next = prev;   // flip the arrow
    prev = head;
    head = next;
  }
  return prev;
}

const head = list(1, 2, 3, 4);
console.log('before:', show(head));
console.log('after: ', show(reverse(head)));`
    }
  },
  {
    match: ['string', 'anagram', 'palindrome'],
    article: {
      title: 'Strings, in simple English',
      intro: 'A string is an array of characters. Most string problems are array problems in disguise: count, compare, or scan with a window.',
      sections: [
        { h: 'Counting', body: 'A frequency map (character → count) answers anagram and "first unique character" questions in one pass.' },
        { h: 'Comparing', body: 'Two pointers from both ends check palindromes without making a reversed copy.' },
        { h: 'Watch out', body: 'In many languages strings are immutable, so building one with += in a loop can be O(n²). Collect parts and join once.' }
      ],
      takeaway: 'Ask: can I solve this with a count map or a moving window?'
    },
    quiz: [
      { q: 'Best way to check if two strings are anagrams?', options: ['Compare lengths only', 'Compare character counts', 'Check the first letter', 'Reverse one string'], answer: 1, why: 'Anagrams have exactly the same count of every character.' },
      { q: 'Is "racecar" a palindrome?', options: ['Yes', 'No'], answer: 0, why: 'It reads the same from both ends.' },
      { q: 'Why can s += c in a loop be slow?', options: ['Strings are immutable, so each += copies', 'It uses recursion', 'Characters are large', 'It is never slow'], answer: 0, why: 'Each concatenation can create a new string, giving O(n²) total.' }
    ],
    code: {
      title: 'Anagram check with a count map',
      code: `function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = {};
  for (const ch of a) count[ch] = (count[ch] || 0) + 1;
  for (const ch of b) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}

console.log(isAnagram('listen', 'silent')); // true
console.log(isAnagram('rat', 'car'));       // false`
    }
  },
  {
    match: ['array', 'travers'],
    article: {
      title: 'Arrays, in simple English',
      intro: 'An array is a row of numbered boxes that sit next to each other in memory. Because the boxes are side by side, jumping to any box by its number is instant.',
      sections: [
        { h: 'Reading', body: 'arr[i] is O(1): the computer calculates exactly where box i is.' },
        { h: 'Traversal', body: 'Visiting every element once with a loop is O(n). Most array problems start with one clean pass.' },
        { h: 'Inserting', body: 'Adding in the middle means shifting everything after it, so it is O(n). Adding at the end is usually O(1).' }
      ],
      takeaway: 'Fast to read, slow to insert in the middle. Pick the right tool for the operation you repeat most.'
    },
    quiz: [
      { q: 'What is the time to read arr[i]?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 0, why: 'The address is computed directly from the index.' },
      { q: 'Inserting at index 0 of an array with n items costs…', options: ['O(1)', 'O(n)', 'O(log n)', 'Nothing'], answer: 1, why: 'Every existing item shifts one place to the right.' },
      { q: 'One loop that finds the max of an array runs in…', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], answer: 1, why: 'It looks at each element exactly once.' }
    ],
    code: {
      title: 'One pass: max, min and sum',
      code: `function stats(nums) {
  let max = -Infinity, min = Infinity, sum = 0;
  for (const n of nums) {
    if (n > max) max = n;
    if (n < min) min = n;
    sum += n;
  }
  return { max, min, sum, avg: sum / nums.length };
}

console.log(stats([7, 2, 9, 4, 1]));`
    }
  }
];

/* Fallback when no topic matches: built around the lecture's own title */
const generic = (title, unit) => ({
  article: {
    title: `${title}, in simple English`,
    intro: `This lecture is part of ${unit}. Here is the short version, so you know what to listen for while you watch.`,
    sections: [
      { h: 'What it is', body: `${title} is one building block of ${unit}. Focus on the problem it solves before the syntax.` },
      { h: 'How to learn it', body: 'Pause after each example and predict the output. Then write the example yourself without looking.' },
      { h: 'How it is tested', body: 'Interviewers ask you to explain the idea in one line, trace a small input by hand, and state the time complexity.' }
    ],
    takeaway: 'If you can explain it to a friend in two sentences, you understand it.'
  },
  quiz: [
    { q: `Best first step when you meet a new ${unit} problem?`, options: ['Start coding at once', 'Trace a small example by hand', 'Memorise a solution', 'Skip it'], answer: 1, why: 'A small hand-traced example shows the pattern before you write code.' },
    { q: 'Which describes "time complexity"?', options: ['How long the code is', 'How running time grows with input size', 'How fast your laptop is', 'How many files you use'], answer: 1, why: 'Big-O describes growth, not seconds.' },
    { q: 'Which is O(n)?', options: ['One loop over n items', 'Two nested loops over n', 'Reading one array index', 'Binary search'], answer: 0, why: 'A single pass touches each item once.' }
  ],
  code: {
    title: 'Trace it: a small worked example',
    code: `// Change the input and run again to see how the output changes
const input = [5, 3, 8, 1];
let steps = 0;
const sorted = [...input].sort((a, b) => { steps++; return a - b; });

console.log('input :', input);
console.log('sorted:', sorted);
console.log('comparisons:', steps);`
  }
});

export const lectureTopic = (lectureTitle = '', unitTitle = '') => {
  const hay = `${lectureTitle} ${unitTitle}`.toLowerCase();
  return TOPICS.find((t) => t.match.some((m) => hay.includes(m))) || generic(lectureTitle, unitTitle || 'this module');
};

/* What kind of answer a free-text request wants */
export const detectIntent = (text = '') => {
  const t = text.toLowerCase();
  if (/\b(quiz|test me|mcq|question|questions|practice|ask me)\b/.test(t)) return 'quiz';
  if (/\b(code|snippet|implement|program|example code|write|function|run)\b/.test(t)) return 'code';
  return 'article';
};

export const STARTERS = [
  { kind: 'quiz', label: 'Ask me a quiz' },
  { kind: 'code', label: 'Write code snippet' },
  { kind: 'article', label: 'Break down in simple English' }
];

/* After each answer, offer the other two as one-tap follow-ups */
export const FOLLOW_UPS = {
  quiz: [{ kind: 'quiz', label: 'Another quiz' }, { kind: 'code', label: 'Show me the code' }],
  code: [{ kind: 'article', label: 'Explain this simply' }, { kind: 'quiz', label: 'Quiz me on it' }],
  article: [{ kind: 'quiz', label: 'Quiz me on this' }, { kind: 'code', label: 'Show a code example' }]
};
