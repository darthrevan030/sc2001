def mergeSort(listA):
    if len(listA) <= 1:
        return listA
    
    leftList = listA[0:len(listA)//2]
    rightList = listA[len(listA)//2:]

    leftList = mergeSort(leftList)
    rightList = mergeSort(rightList)

    return merge(leftList, rightList)

def merge(leftList, rightList):
    resultList = []
    i = 0
    j = 0

    while i < len(leftList) and j < len(rightList):
        if leftList[i] < rightList[j]:
            resultList.append(leftList[i])
            i += 1
        else:
            resultList.append(rightList[j])
            j += 1
    
    while i < len(leftList):
        resultList.append(leftList[i])
        i += 1

    while j < len(rightList):
        resultList.append(rightList[j])
        j += i
    
    return resultList


if __name__ == "__main__":
    testList = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {testList}")
    sortedList = mergeSort(testList)
    print(f"Sorted: {sortedList}")