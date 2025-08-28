def insertionSort(list1):
    # list1[i] is included in the sorted portion already
    for i in range(1, len(list1)):
        # restore order to the sorted portion of the list
        for j in range (1, len(list1)): # loop over the list
            if list1[j] < list1[j - 1]: # compare new element with the left neighbor
                list1[j], list1[j - 1] = list1[j - 1], list1[j] # swap if the new element is smaller 
            else: # otherwise stop
                break
