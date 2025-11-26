class CreditNode {
    constructor(key, data, credit) {
        this.key = key;
        this.data = data;
        this.creditSum = credit;
        this.credit = credit;
        this.left = null;
        this.right = null;
    }
}

// This class defines a binary search tree but with a slightly different fashion. The tree is managed, 
// ordered and walked through by a normal key, but the balance is performed based on a different field,
// the credit. The tree is balanced in such a way that the credit of the left subtree is kept balanced with
// the right subtree and vice versa. This is done to ensure that the tree is balanced in
// a way that the search for a node such that the sum of the credit of preceding nodes is equal to a
// set number is done in O(log n) time. At the same time, credit modification is also O(log n) time.
const CreditBalancedBST = (function () {

    const getCreditSum = node => !node ? 0 : node.creditSum;

    const updateCreditSum = (node) => {
        if (node) {
            node.creditSum = node.credit + getCreditSum(node.left) + getCreditSum(node.right);
        }
    };

    const checkSumError = (node) => {
        const margin = 1e-4

        const leftSum = getCreditSum(node.left);
        const rightSum = getCreditSum(node.right);
        const diff = Math.abs(leftSum + node.credit + rightSum - node.creditSum);
        if (diff > margin) {
            console.error(`Unmatched sum for node ${node}: ${leftSum}+${node.credit}+${rightSum}!=${node.creditSum}. Diff: ${diff}`)
            console.dir(node, { depth: null, colors: true });
        }
    }

    const rotateRight = (y) => {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        updateCreditSum(y);
        updateCreditSum(x);

        return x;
    };

    const rotateLeft = (x) => {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        updateCreditSum(x);
        updateCreditSum(y);

        return y;
    };

    const balance = (treeRoot) => {
        if (!treeRoot) return treeRoot;

        const calculateCost = (rotationType) => {
            const O = treeRoot;
            const L = O.left;
            const R = O.right;
            const LL = L ? L.left : null;
            const LR = L ? L.right : null;
            const RL = R ? R.left : null;
            const RR = R ? R.right : null;
            const RLL = RL ? RL.left : null;
            const RLR = RL ? RL.right : null;
            const LRL = LR ? LR.left : null;
            const LRR = LR ? LR.right : null;

            switch (rotationType) {
                case 'RR':
                    // RR: -credit(R)-totalCredit(RR)+credit(O)+totalCredit(L)
                    if (!O || !R) return Number.MAX_VALUE;
                    return -R.credit - getCreditSum(RR) + O.credit + getCreditSum(L);

                case 'RL':
                    // RL: -2*credit(RL)+credit(O)+totalCredit(L)-totalCredit(RLL)-totalCredit(RLR)
                    if (!O || !R || !RL) return Number.MAX_VALUE;
                    return -2 * RL.credit + O.credit + getCreditSum(L) - getCreditSum(RLL) - getCreditSum(RLR);

                case 'LL':
                    // LL: -credit(L)-totalCredit(LL)+credit(O)+totalCredit(R)
                    if (!O || !L) return Number.MAX_VALUE;
                    return -L.credit - getCreditSum(LL) + O.credit + getCreditSum(R);

                case 'LR':
                    // LR: -2*totalCredit(LR)+credit(O)-totalCredit(LRL)-totalCredit(LRR)+totalCredit(R)
                    if (!O || !L || !LR) return Number.MAX_VALUE;
                    return -2 * getCreditSum(LR) + O.credit - getCreditSum(LRL) - getCreditSum(LRR) + getCreditSum(R);

                default:
                    return 0;
            }
        };

        // Calculate costs for all possible rotations
        const costs = {
            RR: calculateCost('RR'),
            RL: calculateCost('RL'),
            LL: calculateCost('LL'),
            LR: calculateCost('LR')
        };

        // Find the rotation with the lowest cost (most negative)
        let bestRotation = null;
        let minCost = 0; // 0 means do nothing

        for (const [rotation, cost] of Object.entries(costs)) {
            if (cost < minCost) {
                minCost = cost;
                bestRotation = rotation;
            }
        }

        // Apply the best rotation if it is better than doing nothing
        if (bestRotation) {
            const O = treeRoot;
            const L = O.left;
            const R = O.right;

            switch (bestRotation) {
                case 'RR':
                    // Single rotation to the left
                    treeRoot = rotateLeft(O);
                    break;

                case 'RL':
                    // Left-right rotation
                    O.right = rotateRight(R);
                    treeRoot = rotateLeft(O);
                    break;

                case 'LL':
                    // Sigle rotation to the left
                    treeRoot = rotateRight(O);
                    break;

                case 'LR':
                    // Right-left rotation
                    O.left = rotateLeft(L);
                    treeRoot = rotateRight(O);
                    break;
            }
        }

        return treeRoot;
    };

    const insertNode = (node, key, data, credit) => {
        if (!node) return new CreditNode(key, data, credit);

        if (key < node.key) {
            node.left = insertNode(node.left, key, data, credit);
        } else {
            node.right = insertNode(node.right, key, data, credit);
        }

        // node.creditSum is calculated and overriden in here in calls to 'rotate' if there is a rotation
        const returnedNode = balance(node)

        if (returnedNode == node) {
            // if there was no rotation in 'balance' node.creditSum calculation has to be forced
            updateCreditSum(node);
        }
        checkSumError(returnedNode)
        return returnedNode;
    };

    const deleteNode = (node, key) => {
        if (!node) return node;

        if (key < node.key) {
            node.left = deleteNode(node.left, key);
        } else if (key > node.key) {
            node.right = deleteNode(node.right, key);
        } else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            let minLargerNode = node.right;
            while (minLargerNode.left) {
                minLargerNode = minLargerNode.left;
            }
            node.key = minLargerNode.key;
            node.data = minLargerNode.data;
            node.right = deleteNode(node.right, minLargerNode.key);
        }

        updateCreditSum(node);

        // node.creditSum is calculated and overriden in here in calls to 'rotate' if there is a rotation
        const returnedNode = balance(node)

        if (returnedNode == node) {
            // if there was no rotation in 'balance' node.creditSum calculation has to be forced
            updateCreditSum(node)
        }

        checkSumError(returnedNode)
        return returnedNode;
    };

    const findNodeByCreditHelper = (node, creditSum) => {
        if (!node) return null;

        const leftCreditSum = getCreditSum(node.left);

        if (creditSum < leftCreditSum) {
            return findNodeByCreditHelper(node.left, creditSum);
        } else if (creditSum < leftCreditSum + node.credit) {
            return node;
        } else {
            return findNodeByCreditHelper(node.right, creditSum - leftCreditSum - node.credit);
        }
    };

    const findNodesByKeyHelper = (node, key) => {
        if (!node) return [];

        if (key < node.key) {
            return findNodesByKeyHelper(node.left, key);
        } else if (key > node.key) {
            return findNodesByKeyHelper(node.right, key);
        } else {
            return findNodesByKeyHelper(node.left, key).concat([node])
                .concat(findNodesByKeyHelper(node.right, key));
        }
    }

    const updateCreditRecursive = (node, key, newCredit) => {
        if (!node) return 0;

        let difference = 0;

        let newNode
        if (node.key === key) {
            difference = newCredit - node.credit;
            node.credit = newCredit;
            newNode = node
            updateCreditSum(node)
        } else {
            if (key < node.key) {
                const result = updateCreditRecursive(node.left, key, newCredit);
                difference = result.difference
                node.left = result.newNode
                // node.creditSum modification pending
            } else {
                const result = updateCreditRecursive(node.right, key, newCredit);
                difference = result.difference
                node.right = result.newNode
                // node.creditSum modification pending
            }

            // node.creditSum is calculated and overriden in here in calls to 'rotate' if there is a rotation
            newNode = balance(node);

            if (newNode == node) {
               // if there was no rotation in 'balance' node.creditSum calculation has to be forced
                updateCreditSum(node)
            }
        }

        checkSumError(node)
        return { newNode, difference }
    };

    const findNodesByPrefixHelper = (node, prefix, results) => {
        if (!node) return;

        if (prefix === "" || node.key.startsWith(prefix)) {
            results.push(node);
            findNodesByPrefixHelper(node.left, prefix, results);
            findNodesByPrefixHelper(node.right, prefix, results);
        }
        else if (prefix < node.key) {
            findNodesByPrefixHelper(node.left, prefix, results);
        } else {
            findNodesByPrefixHelper(node.right, prefix, results);
        }
    };

    // MAIN CLASS RETURNED: ONLY PUBLIC METHODS BELOW
    return class {
        constructor() {
            this.root = null;
        }

        getTotalCredit() {
            return getCreditSum(this.root);
        }

        isEmpty() {
            return this.root === null;
        }

        insert(key, data, credit) {
            this.root = insertNode(this.root, key, data, credit);
        }

        delete(key) {
            this.root = deleteNode(this.root, key);
        }

        findNodeByCredit(creditSum) {
            return findNodeByCreditHelper(this.root, creditSum);
        }

        findNodesByKey(key) {
            return findNodesByKeyHelper(this.root, key);
        }

        findNodesByPrefix(prefix = "") {
            const results = [];
            findNodesByPrefixHelper(this.root, prefix, results);
            return results;
        }

        // This method should always be used to alter credits if the tree is to be maintained as a credit balanced tree.
        // Otherwise the rest of methods could fail
        updateCreditByKey(key, newCredit) {
            updateCreditRecursive(this.root, key, newCredit);
        }
    };
})();

export { CreditBalancedBST };