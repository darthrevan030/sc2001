def inPlaceQuickSort(listA, low=0, high=None):
    if high is None:
        high = len(listA) - 1
    
    if low < high:
        pivotIndex = partition(listA, low, high)

        inPlaceQuickSort(listA, low, pivotIndex - 1)
        inPlaceQuickSort(listA, pivotIndex + 1, high)


def partition(listA, low, high):
    mid = (low + high) // 2
    
    pivot = listA[high]

    i = low - 1

    for j in range(low, high):
        if listA[j] <= pivot:
            i += 1
            listA[i], listA[j] = listA[j], listA[i]

    listA[i + 1], listA[high] = listA[high], listA[i + 1]
    return i + 1


if __name__ == "__main__":
    test_list = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {test_list}")
    inPlaceQuickSort(test_list)
    print(f"Sorted: {test_list}")