# Credit Balanced Binary Search Tree

A binary search tree implementation that maintains balance based on credit values rather than height, enabling efficient credit-based search operations.

## 📋 Overview

This data structure combines the properties of a traditional BST (ordered by key) with a credit-based balancing mechanism. It's particularly useful for scenarios where you need to:

- Find nodes based on cumulative credit sums in O(log n) time
- Efficiently maintain and modify credit values
- Perform prefix-based key operations

## 🏗️ Structure

### CreditNode Class
```javascript
class CreditNode {
    constructor(key, data, credit) {
        this.key = key;          // Sorting key
        this.data = data;        // Associated data
        this.creditSum = credit; // Sum of credits in subtree
        this.credit = credit;    // Node's own credit
        this.left = null;        // Left child
        this.right = null;       // Right child
    }
}
```

## 🚀 Features

- **Dual Balancing**: Ordered by keys, balanced by credits
- **Efficient Operations**: O(log n) for insert, delete, and credit-based search
- **Credit Management**: Maintains cumulative sums for efficient range queries
- **Prefix Search**: Find nodes by key prefixes

## 📖 API Reference

### Constructor
```javascript
const tree = new CreditBalancedBST();
```

### Methods

#### `insert(key, data, credit)`
Inserts a new node into the tree.

#### `delete(key)`
Removes a node with the specified key.

#### `findNodeByCredit(creditSum)`
Finds the node where the cumulative credit of preceding nodes equals the specified sum.

#### `findNodesByKey(key)`
Returns all nodes with the specified key.

#### `findNodesByPrefix(prefix = "")`
Finds all nodes whose keys start with the given prefix.

#### `updateCreditByKey(key, newCredit)`
Updates the credit value for nodes with the specified key.

#### `getTotalCredit()`
Returns the sum of all credits in the tree.

#### `isEmpty()`
Checks if the tree is empty.

## 💡 Usage Examples

```javascript
const tree = new CreditBalancedBST();

// Insert nodes with credits
tree.insert("user1", { name: "Alice" }, 10);
tree.insert("user2", { name: "Bob" }, 20);
tree.insert("user3", { name: "Charlie" }, 15);

// Find node by cumulative credit
const node = tree.findNodeByCredit(25); // Finds node where preceding credits sum to 25

// Update credits
tree.updateCreditByKey("user2", 25);

// Search by prefix
const users = tree.findNodesByPrefix("user");

// Get total credit
const total = tree.getTotalCredit(); // Returns 50
```

## ⚙️ Balancing Mechanism

The tree uses a credit-based balancing strategy that considers four possible rotations:

- **LL**: Single right rotation
- **LR**: Left-right double rotation  
- **RR**: Single left rotation
- **RL**: Right-left double rotation

Each rotation is evaluated based on a cost function that minimizes credit imbalance between subtrees.

## 🛠️ Implementation Details

- **Credit Sum Maintenance**: Each node maintains the sum of credits in its subtree
- **Recursive Operations**: Insertion, deletion, and updates use recursive traversal
- **Error Checking**: Includes validation for credit sum consistency
- **Memory Efficient**: Only stores necessary metadata for balancing

## 📊 Performance

| Operation | Time Complexity |
|-----------|-----------------|
| Insert | O(log n) |
| Delete | O(log n) |
| Credit Search | O(log n) |
| Key Search | O(log n) |
| Prefix Search | O(log n + m) |
| Credit Update | O(log n) |

## 🎯 Use Cases

- **Weighted Random Selection**: Use credits as weights for probabilistic selection
- **Resource Allocation**: Manage resources with credit-based priorities
- **Load Balancing**: Distribute load based on capacity credits
- **Priority Queues**: Implement efficient priority-based data structures

## 📝 Notes

- Keys are used for ordering and searching
- Credits are used for balancing and cumulative operations
- The tree automatically rebalances after insertions, deletions, and credit updates
- All credit modifications should use `updateCreditByKey()` to maintain balance

## 🔧 Development

The implementation uses an IIFE (Immediately Invoked Function Expression) to create a closure around private helper functions while exposing only the public API.
