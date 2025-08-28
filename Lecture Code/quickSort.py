def quickSort(listA):
    if len(listA) <= 1:
        return listA
    
    pivot = listA[len(listA)//2]

    listALow = [x for x in listA if x < pivot]
    listAHigh = [x for x in listA if x > pivot]
    listAEqual = [x for x in listA if x == pivot]

    B1 = quickSort(listALow)
    B2 = quickSort(listAHigh)

    return B1 + listAEqual + B2


if __name__ == "__main__":
    testList = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {testList}")
    sortedList = quickSort(testList)
    print(f"Sorted: {sortedList}")

