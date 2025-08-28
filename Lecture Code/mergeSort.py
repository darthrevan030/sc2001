def mergeSort(listA):
    if len(listA) <= 1:
        return listA
    
    leftList = listA[0:len(listA)//2]
    rightList = listA[len(listA)//2:]

    leftList = mergeSort(leftList)
    rightList = mergeSort(rightList)

    return merge(leftList, rightList)

def merge(leftList, rightList):
    sorted = []

    while leftList and rightList:
        if leftList[0] < rightList[0]:
            sorted.append(leftList[0])
            leftList.pop(0)
        else:
            sorted.append(rightList[0])
            rightList.pop(0)
    if leftList:
        sorted.extend(leftList)
    else:
        sorted.extend(rightList)
    
    return sorted

if __name__ == "__main__":
    test_list = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {test_list}")
    mergeSort(test_list)
    print(f"Sorted: {test_list}")