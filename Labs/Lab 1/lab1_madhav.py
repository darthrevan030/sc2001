import random
import time

comparisons = 0

def generate_random_array(size, maxVal):
    return [random.randint(0,maxVal) for i in range(size)]

# no need for print function

def insertionSort(arr, left, right):
    global comparisons
    for i in range(left+1, right+1):
        key = arr[i]
        j = i - 1
        while j >= left and arr[j] > key:
            comparisons += 1
            arr[j+1] = arr[j]
            j -= 1
        
        if j >= left:
            comparisons += 1
        arr[j+1] = key
    # end of function

def merge(arr, left, mid, right):
    global comparisons
    leftArr = arr[left:mid+1]
    rightArr = arr[mid+1:right+1]
    i,j,k = 0, 0, left

    while i < len(leftArr) and j < len(rightArr):
        comparisons += 1
        if leftArr[i] <= rightArr[j]:
            arr[k] = leftArr[i]
            i+=1
        else:
            arr[k] = rightArr[j]
            j+=1
        k+=1
    
    while i < len(leftArr):
        arr[k] = leftArr[i]
        i+=1
        k+=1
    while j < len(rightArr):
        arr[k] = rightArr[j]
        j+=1
        k+=1
    #end of function

def hybridSort(arr, left, right, S):
    if left >= right:
        return
    size = right - left + 1
    if size <= S:
        insertionSort(arr, left, right)
    else:
        mid = left + (right- left) // 2
        hybridSort(arr, left, mid, S)
        hybridSort(arr, mid+1, right, S)
        merge(arr, left, mid, right)

def main():
    global comparisons
    random.seed(int(time.time()))

    size = int(input("Enter size of array: "))
    maxVal = int(input("Enter maxmimum value: "))

    arr = generate_random_array(size, maxVal)
    print(arr)

    start = time.perf_counter()
    hybridSort(arr, 0, len(arr)-1, 2)
    end = time.perf_counter()

    timeTaken = end - start

    print()
    print(arr)
    print()
    print("Time taken: ", timeTaken)
    print("# of comparisons: ", comparisons)

if __name__ == 'main':
    main()