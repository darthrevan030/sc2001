def inPlaceMergeSort(listA, left=0, right=None):
    if right is None:
        right = len(listA) - 1

    if left >= right:
        return
    
    mid = (left + right) // 2

    inPlaceMergeSort(listA, left, mid)
    inPlaceMergeSort(listA, mid + 1, right)

    merge(listA, left, mid, right)


def merge(listA, left, mid, right):
    leftList = listA[left: mid +1]
    rightList = listA[mid + 1: right + 1]

    i = j = 0
    k = left

    while i < len(leftList) and j < len(rightList):
        if leftList[i] <= rightList[j]:
            listA[k] = leftList[i]
            i += 1
        else: 
            listA[k] = rightList[j]
            j += 1
        
        k += 1

    while i < len(leftList):
        listA[k] = leftList[i]
        i += 1
        k += 1
    
    while j < len(rightList):
        listA[k] = rightList[j]
        j += 1
        k += 1


if __name__ == "__main__":
    test_list = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {test_list}")
    inPlaceMergeSort(test_list)
    print(f"Sorted: {test_list}")