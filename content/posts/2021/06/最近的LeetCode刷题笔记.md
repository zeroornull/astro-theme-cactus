---
title: "最近的LeetCode刷题笔记"
description: "最近的LeetCode刷题笔记"
publishDate: 2021-06-01T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["LeetCode"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---


# LeetCode刷题笔记

### [7]整数反转

```java
class Solution {
    public int reverse(int x) {
        int rev = 0;
        while (x!=0){
            if (rev < Integer.MIN_VALUE / 10 || rev > Integer.MAX_VALUE/10){
                return 0;
            }
            int digit = x % 10;
            x /= 10;
            rev = rev * 10 + digit;
        }
        return rev;
    }
}
```

### [9]回文数

```java
class Solution {
    public boolean isPalindrome(int x) {
        // 特殊情况：
        // 如上所述，当 x < 0 时，x 不是回文数。
        // 同样地，如果数字的最后一位是 0，为了使该数字为回文，
        // 则其第一位数字也应该是 0
        // 只有 0 满足这一属性
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }

        int revertedNumber = 0;
        while (x > revertedNumber) {
            revertedNumber = revertedNumber * 10 + x % 10;
            x /= 10;
        }

        // 当数字长度为奇数时，我们可以通过 revertedNumber/10 去除处于中位的数字。
        // 例如，当输入为 12321 时，在 while 循环的末尾我们可以得到 x = 12，revertedNumber = 123，
        // 由于处于中位的数字不影响回文（它总是与自己相等），所以我们可以简单地将其去除。
        return x == revertedNumber || x == revertedNumber / 10;
    }
}
```

### [14]最长公共前缀

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0){
            return  "";
        }
        String prefix = strs[0];
        int count = strs.length;
        for (int i = 1; i < count; i++) {
            prefix = longestCommonPrefix(prefix, strs[i]);
            if (prefix.length() == 0){
                break;
            }
        }
        return prefix;
    }
    
    public String longestCommonPrefix(String str1,String str2){
        int length = Math.min(str1.length(), str2.length());
        int index = 0;
        while (index < length && str1.charAt(index) == str2.charAt(index)){
            index++;
        }
        return str1.substring(0, index);
    }
}
```

### [20]有效的括号

```java
class Solution {
    public boolean isValid(String s) {
        int n = s.length();
        //偶数必错
        if (n % 2 == 1) {
            return false;
        }
        Map<Character, Character> pairs = new HashMap<Character, Character>() {{
            put(')', '(');
            put(']', '[');
            put('}', '{');
        }};
        Deque<Character> stack = new LinkedList<Character>();
        for (int i = 0; i < n; i++) {
            char ch = s.charAt(i);
            if (pairs.containsKey(ch)) {
                if (stack.isEmpty() || stack.peek() != pairs.get(ch)) {
                    return false;
                }
                stack.pop();
            } else {
                stack.push(ch);
            }
        }
        return stack.isEmpty();
    }
}
```

### [21]合并两个有序链表

```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        //使用带头结点的链表解决问题
        //待输出链表的头部
        ListNode head = new ListNode();
        
        // 待输出链表的 last 结点
        ListNode last = head;
        while (l1 != null && l2 != null){
            if (l1.val > l2.val){
                last.next = l2;
                l2 = l2.next;
            }else {
                last.next = l1;
                l1 = l1.next;
            }
            last = last.next;
        }
        // l1 或 l2 可能还有剩余结点没有合并，
        // 由于从上面的while循环中退出，那么链表 l1 和 l2 至少有一个已经遍历结束
        if (l1 != null) last.next = l1;
        if (l2 != null) last.next = l2;
        return head.next;
        
    }
}
```

### [26]删除有序数组中的重复项

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int n = nums.length;
        if (n == 0){
            return 0;
        }
        int fast = 1,slow = 1;
        while (fast < n){
            if (nums[fast] != nums[fast - 1]){
                nums[slow] = nums[fast];
                ++ slow;
            }
            ++fast;
        }
        return slow;
    }
}
```



### [53]最大子序和

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int ans = nums[0];
        int sum = 0;
        for (int num : nums) {
            if (sum > 0) {
                sum += num;
            } else {
                sum = num;
            }
            ans = Math.max(ans, sum);
        }
        return ans;
    }
}
```

### [70]爬楼梯

```java
// 动态规划
class Solution {
    public int climbStairs(int n) {
        int p = 0, q = 0, r = 1;
        // 倒着推 f(x) = f(x-1) + f(x-2)
        for (int i = 0; i < n; ++i) {
            p = q;
            q = r;
            r = p + q;
        }
        return r;
    }
}
```

### [88]合并两个有序数组

```java
//方法一：直接合并后排序
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        for (int i = 0; i != n; ++i) {
            nums1[m + i] = nums2[i];
        }
        Arrays.sort(nums1);
    }
}
```

```java
//方法二：双指针
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = 0, p2 = 0;
        int[] sorted = new int[m + n];
        int cur;
        while (p1 < m || p2 < n) {
            if (p1 == m) {
                cur = nums2[p2++];
            } else if (p2 == n) {
                cur = nums1[p1++];
            } else if (nums1[p1] < nums2[p2]) {
                cur = nums1[p1++];
            } else {
                cur = nums2[p2++];
            }
            sorted[p1 + p2 - 1] = cur;
        }
        for (int i = 0; i != m + n; i++) {
            nums1[i] = sorted[i];
        }
    }
}
```



### [101]对称二叉树

```java
// 方法一：递归
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return check(root, root);
    }

    public boolean check(TreeNode p, TreeNode q) {
        if (p == null && q == null) {
            return true;
        }
        if (p == null || q == null) {
            return false;
        }
        return p.val == q.val && check(p.left, q.right) && check(p.right, q.left);
    }
}
```

```java
// 迭代法
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return check(root, root);
    }
    public boolean check(TreeNode u,TreeNode v){
        Queue<TreeNode> q = new LinkedList<TreeNode>();
        q.offer(u);
        q.offer(v);
        while (!q.isEmpty()){
            u = q.poll();
            v = q.poll();
            if (u == null && v == null){
                continue;
            }
            if (u == null || v == null || (u.val != v.val)){
                return false;
            }
            q.offer(u.left);
            q.offer(v.right);
            
            q.offer(u.right);
            q.offer(v.left);
        }
        return true;
    }
}
```

### [103]二叉树的锯齿形层序遍历

```java
// 方法一: 层级遍历 双端队列
class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> ans = new LinkedList<List<Integer>>();
        if (root == null){
            return ans;
        }
        
        Queue<TreeNode> nodeQueue = new LinkedList<TreeNode>();
        nodeQueue.offer(root);
        boolean isOrderLeft = true;
        
        while (!nodeQueue.isEmpty()){
            Deque<Integer> levelList = new LinkedList<>();
            int size = nodeQueue.size();
            for (int i = 0; i < size; i++) {
                TreeNode curNode = nodeQueue.poll();
                if (isOrderLeft){
                    levelList.offerLast(curNode.val);
                }else {
                    levelList.offerFirst(curNode.val);
                }
                if (curNode.left != null){
                    nodeQueue.offer(curNode.left);
                }
                if (curNode.right != null){
                    nodeQueue.offer(curNode.right);
                }
            }
            ans.add(new LinkedList<Integer>(levelList));
            isOrderLeft = !isOrderLeft;
        }
        return ans;
    }
}
```

**复杂度分析**

- 时间复杂度：*O(N)*，其中 *N* 为二叉树的节点数。每个节点会且仅会被遍历一次。
- 空间复杂度：*O(N)*。我们需要维护存储节点的队列和存储节点值的双端队列，空间复杂度为 *O(N)*。

### [104]二叉树的最大深度

```java
// 方法一：深度优先搜索 DFS
class Solution {
    public int maxDepth(TreeNode root) {
         if (root == null){
             return 0;
         }else {
             int leftHeight = maxDepth(root.left);
             int rightHeight = maxDepth(root.right);
             //一直递归+1
             return Math.max(leftHeight, rightHeight) + 1;
         }
    }
}
```

```java
// 方法二:BFS
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null){
            return 0;
        }
        Queue<TreeNode> queue = new LinkedList<TreeNode>();
        queue.offer(root);
        int ans = 0;
        while (!queue.isEmpty()){
            int size = queue.size();
            while (size>0){
                TreeNode node = queue.poll();
                if (node.left != null){
                    queue.offer(node.left);
                }
                //反复压栈
                if (node.right != null){
                    queue.offer(node.right);
                }
                size --;
            }//
            //size = 0 时，最后+1
            ans ++;
        }
        return ans;
    }
}
```

### [121]买卖股票的最佳时机

```java
// 方法一：暴力破解 超时
class Solution {
    public int maxProfit(int[] prices) {
        int maxprofit = 0;
        for (int i = 0; i < prices.length; i++) {
            for (int j = i+1; j <prices.length ; j++) {
                int profit = prices[j] - prices[i];
                if (profit > maxprofit){
                    maxprofit = profit;
                }
            }
        }
        return maxprofit;
    }
}
```

- 时间复杂度：*O(n^2)*。循环运行 n(n-1)/2 次。
- 空间复杂度：*O(1)*。只使用了常数个变量。

[Integer.MAX_VALUE的含义](https://blog.csdn.net/weixin_44824500/article/details/104768290)

**Integer.MAX_VALUE表示int数据类型的最大取值数：2 147 483 647
Integer.MIN_VALUE表示int数据类型的最小取值数：-2 147 483 648**

对应：
**Short.MAX_VALUE 为short类型的最大取值数 32 767
Short.MIN_VALUE 为short类型的最小取值数 -32 768**

**Integer.MAX_VALUE+1=Integer.MIN_VALUE**

```java
// 方法二：一次遍历
class Solution {
    public int maxProfit(int[] prices) {
        int minprice = Integer.MAX_VALUE;
        int maxprofit = 0;
        //一次遍历 不会出现前面-后面而出现利润错误的情况
        for (int i = 0; i < prices.length; i++) {
            if (prices[i] < minprice){
                minprice = prices[i];
            }else if (prices[i] - minprice > maxprofit){
                maxprofit = prices[i] - minprice;
            }
        }
        return maxprofit;
    }
}
```

- 时间复杂度：*O(n)*，只需要遍历一次。

- 空间复杂度：*O(1)*，只使用了常数个变量。

### [141]环形链表

```java
// 方法一：哈希表
public class Solution {
    public boolean hasCycle(ListNode head) {
        Set<ListNode> seen = new HashSet<ListNode>();
        while (head != null){
            //这一步应该是表示不能添加 则返回true
            if (!seen.add(head)){
                return true;
            }
            head = head.next;
        }
        return false;
    }
}
```

- 时间复杂度：*O(N)*，其中 *N* 是链表中的节点数。最坏情况下我们需要遍历每个节点一次。
- 空间复杂度：*O(N)*，其中 *N* 是链表中的节点数。主要为哈希表的开销，最坏情况下我们需要将每个节点插入到哈希表中一次。

```java
// 方法二：快慢指针
/*
具体地，我们定义两个指针，一快一满。慢指针每次只移动一步，而快指针每次移动两步。初始时，慢指针在位置 head，而快指针在位置 head.next。这样一来，如果在移动的过程中，快指针反过来追上慢指针，就说明该链表为环形链表。否则快指针将到达链表尾部，该链表不为环形链表。
*/
public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null){
            return false;
        }
        ListNode slow = head;
        ListNode fast = head.next;
        while (slow!=fast){
            if (fast == null || fast.next == null){
                return false;
            }
            slow = slow.next;
            fast = fast.next.next;
        }
        return true;
    }
}
```

- 时间复杂度：*O(N)*，其中 *N* 是链表中的节点数。
  - 当链表中不存在环时，快指针将先于慢指针到达链表尾部，链表中每个节点至多被访问两次。
  - 当链表中存在环时，每一轮移动后，快慢指针的距离将减小一。而初始距离为环的长度，因此至多移动 *N* 轮。
- 空间复杂度：*O(1)*。我们只使用了两个指针的额外空间。

### [155]最小栈

这道题没什么思路，基础太差的原因

```java
class MinStack {

    Deque<Integer> xStack;
    Deque<Integer> minStack;
    
    /** initialize your data structure here. */
    public MinStack() {
        xStack = new LinkedList<Integer>();
        minStack = new LinkedList<Integer>();
        minStack.push(Integer.MAX_VALUE);
    }
    
    public void push(int val) {
        xStack.push(val);
        minStack.push(Math.min(minStack.peek(),val));
    }
    
    public void pop() {
        xStack.pop();
        minStack.pop();
    }
    
    public int top() {
        return xStack.peek();
    }
    
    public int getMin() {
        return minStack.peek();
    }
}
```
### [169]多数元素

```java
// 方法一：哈希表
class Solution {
    private Map<Integer,Integer> countNums(int[] nums){
        Map<Integer, Integer> counts = new HashMap<Integer, Integer>();
        for (int num : nums) {
            if (!counts.containsKey(num)){
                counts.put(num, 1);
            }else {
                counts.put(num, counts.get(num) + 1);
            }
        }
        return counts;
    }
    public int majorityElement(int[] nums) {
        Map<Integer, Integer> counts = countNums(nums);
        Map.Entry<Integer,Integer> majorityEntry = null;
        for (Map.Entry<Integer, Integer> entry : counts.entrySet()) {
            if (majorityEntry == null || entry.getValue() > majorityEntry.getValue()){
                majorityEntry = entry;
            }
        }
        return majorityEntry.getKey();
    }
}
```

- 时间复杂度：*O(n)*
- 空间复杂度：*O(n)*。

```java
// 方法二：排序
class Solution {
    public int majorityElement(int[] nums) {
        Arrays.sort(nums);
        return nums[nums.length/2];
    }
}
```



```java
// 方法三：随机化
class Solution {
    public int majorityElement(int[] nums) {
        Random rand = new Random();
        int majorityCount = nums.length / 2;
        while (true){
            int candidate = nums[randRange(rand,0,nums.length)];
            if (countOccurences(nums,candidate) > majorityCount){
                return candidate;
            }
        }
    }
    private int randRange(Random rand,int min,int max){
        return rand.nextInt(max-min) + min;
    }
    private int countOccurences(int[] nums,int num){
        int count = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == num){
                count++;
            }
        }
        return count;
    }
}
```

由于一个给定的下标对应的数字很有可能是众数，我们随机挑选一个下标，检查它是否是众数，如果是就返回，否则继续随机挑选。

```java
// 方法四：分治
class Solution {
    public int majorityElement(int[] nums) {
        return majorityElementRec(nums, 0, nums.length - 1);
    }

    private int countInRange(int[] nums, int num, int lo, int hi) {
        int count = 0;
        for (int i = 0; i < lo; i++) {
            if (nums[i] == num) {
                count++;
            }
        }
        return count;
    }

    private int majorityElementRec(int[] nums, int lo, int hi) {
        //base case; the only element in an array of size 1 is the majority element
        if (lo == hi) {
            return nums[lo];
        }

        //recurse on left and right halves of this slice
        int mid = (hi - lo) / 2 + lo;
        int left = majorityElementRec(nums, lo, mid);
        int right = majorityElementRec(nums, mid + 1, hi);

        //if the two halves agree on the majority element,return it
        if (left == right) {
            return left;
        }

        //otherwise,count each element and return the "winner"
        int leftCount = countInRange(nums, left, lo, hi);
        int rightCount = countInRange(nums, right, lo, hi);

        return leftCount > rightCount ? left : right;
    }

}
```

### [206]反转链表

```java
// 方法一：迭代
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null){
            ListNode next = curr.next;
            curr.next = prev;
            prev  = curr;
            curr = next;
        }
        return prev;
    }
}
```

**复杂度分析**

- 时间复杂度：*O(n)*，其中 *n* 是链表的长度。需要遍历链表一次。
- 空间复杂度：*O(1)*。

```java
// 方法二：递归
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null){
            return head;
        }
        ListNode newHead = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }
}
```

**复杂度分析**

- 时间复杂度：*O(n)*，其中 *n* 是链表的长度。需要对链表的每个节点进行反转操作。
- 空间复杂度：*O(n)*，其中 *n* 是链表的长度。空间复杂度主要取决于递归调用的栈空间，最多为 *n* 层。

### [226]翻转二叉树

```java
// 方法一：递归
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null){
            return null;
        }
        // 递归翻转
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}
```

**复杂度分析**

- 时间复杂度：*O(N)*，其中 *N* 为二叉树节点的数目。我们会遍历二叉树中的每一个节点，对每个节点而言，我们在常数时间内交换其两棵子树。
- 空间复杂度：*O(N)*。使用的空间由递归栈的深度决定，它等于当前节点在二叉树中的高度。在平均情况下，二叉树的高度与节点个数为对数关系，即 O(logN)。而在最坏情况下，树形成链状，空间复杂度为 *O(N)*。

### [234]回文链表

```java
//方法一：将值复制到数组中后用双指针法
class Solution {
    
    public boolean isPalindrome(ListNode head) {
        List<Integer> vals = new ArrayList<Integer>();
        // 将链表的值复制到数组中
        ListNode currentNode = head;
        while (currentNode != null){
            vals.add(currentNode.val);
            currentNode = currentNode.next;
        }
        //
        int front = 0;
        int back = vals.size() - 1;
        while (front < back){
            if (!vals.get(front).equals(vals.get(back))){
                return false;
            }
            front++;
            back--;
        }
        return true;
    }
}
```

```java
//方法二：递归
class Solution {
    
    private ListNode frontPointer;
    
    private boolean recursivelyCheck(ListNode currentNode){
        if (currentNode!=null){
            if (!recursivelyCheck(currentNode.next)){
                return false;
            }
            if (currentNode.val != frontPointer.val){
                return false;
            }
            frontPointer = frontPointer.next;
        }
        return true;
    }
    
    public boolean isPalindrome(ListNode head) {
        frontPointer = head;
        return recursivelyCheck(head);
    }
}
```

### [283]移动零

```java
// 方法一：双指针
class Solution {
    public void moveZeroes(int[] nums) {
        int n = nums.length,left = 0,right = 0;
        while (right < n){
            if (nums[right] != 0){
                swap(nums, left, right);
                left++;
            }
            right++;
        }
    }
    public void swap(int[] nums,int left,int right){
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
    }
}
```

**复杂度分析**

- 时间复杂度：*O(n)*，其中 *n* 为序列长度。每个位置至多被遍历两次。
- 空间复杂度：*O(1)*。只需要常数的空间存放若干变量。

### [448]找到所有数组中消失的数字



```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int n = nums.length;
        for (int num : nums) {
            // 取模 以免被增加过
            int x = (num - 1) % n;
            nums[x] += n;
        }
        List<Integer> ret = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (nums[i] <= n) {
                ret.add(i + 1);
            }

        }
        return ret;
    }
}
```

### [461]汉明距离

```java
// 内置位计数功能
class Solution {
    public int hammingDistance(int x, int y) {
            return Integer.bitCount(x ^ y);
    }
}
```

```java
// 方法二：移位
class Solution {
    public int hammingDistance(int x, int y) {
        int xor = x ^ y;
        int distance = 0;
        while (xor != 0) {
            if (xor % 2 == 1)
                distance += 1;
            xor = xor >> 1;
        }
        return distance;
    }
}
```

```java
//布赖恩·克尼根算法
class Solution {
    public int hammingDistance(int x, int y) {
        int xor = x ^ y;
        int distance = 0;
        while (xor != 0) {
            distance += 1;
            // remove the rightmost bit of '1'
            xor = xor & (xor - 1);
        }
        return distance;
    }
}
```

### [543]二叉树的直径

```java
class Solution {
    int ans;

    public int diameterOfBinaryTree(TreeNode root) {
        ans = 1;
        depth(root);
        return ans - 1;
    }

    public int depth(TreeNode node) {
        if (node == null) {
            return 0;//访问了空节点，返回0
        }
        int L = depth(node.left);//左儿子为根的子树的深度
        int R = depth(node.right);//右儿子为根的子树的深度
        ans = Math.max(ans, L + R + 1);//计算d_node即L+R+1 并更新ans
        return Math.max(L, R) + 1;//返回该节点为根的子树的深度

    }

}
```

### [617]合并二叉树

```java
//方法一：深度优先搜索
class Solution {
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
            if (root1 == null){
                return root2;
            }
            if (root2 == null){
                return root1;
            }
            TreeNode merged = new TreeNode(root1.val+root2.val);
            merged.left = mergeTrees(root1.left, root2.left);
            merged.right = mergeTrees(root1.right, root2.right);
            return merged;
    }
}
```



```java
//方法二：广度优先搜索
class Solution {
    public TreeNode mergeTrees(TreeNode t1, TreeNode t2) {
        if (t1 == null) {
            return t2;
        }
        if (t2 == null) {
            return t1;
        }
        TreeNode merged = new TreeNode(t1.val + t2.val);
        Queue<TreeNode> queue = new LinkedList<TreeNode>();
        Queue<TreeNode> queue1 = new LinkedList<TreeNode>();
        Queue<TreeNode> queue2 = new LinkedList<TreeNode>();
        queue.offer(merged);
        queue1.offer(t1);
        queue2.offer(t2);
        while (!queue1.isEmpty() && !queue2.isEmpty()) {
            TreeNode node = queue.poll(), node1 = queue1.poll(), node2 = queue2.poll();
            TreeNode left1 = node1.left, left2 = node2.left, right1 = node1.right,right2 = node2.right;
            if (left1 != null || left2 != null) {
                if (left1 != null && left2 != null) {
                    TreeNode left = new TreeNode(left1.val + left2.val);
                    node.left = left;
                    queue.offer(left);
                    queue1.offer(left1);
                    queue2.offer(left2);
                } else if (left1 != null) {
                    node.left = left1;
                } else if (left2 != null) {
                    node.left = left2;
                }
            }
            if (right1 != null || right2 != null) {
                if (right1 != null && right2 != null) {
                    TreeNode right = new TreeNode(right1.val + right2.val);
                    node.right = right;
                    queue.offer(right);
                    queue1.offer(right1);
                    queue2.offer(right2);
                } else if (right1 != null) {
                    node.right = right1;
                } else if (right2 != null) {
                    node.right = right2;
                }
            }
        }
        return merged;
    }
}
```

